import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { ModuleService } from '../../../core/services/module.service';
import { UserService } from '../../../core/services/user.service';
import { BossService } from '../../../core/services/boss.service';
import { SystemStateService } from '../../../shared/services/system-state.service';
import { ModuleHeatmapComponent } from '../../../shared/components/module-layout/heatmap';

@Component({
  selector: 'app-module-page',
  standalone: true,
  imports: [CommonModule, RouterModule, ModuleHeatmapComponent],
  templateUrl: './module-page.component.html',
  styleUrl: './module-page.component.scss'
})
export class ModulePageComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private moduleService = inject(ModuleService);
  private userService = inject(UserService);
  private bossService = inject(BossService);
  private stateService = inject(SystemStateService);

  moduleId: string = '';
  module = signal<any>(null);
  logs = signal<any[]>([]);
  currentStreak = signal<number>(0);
  longestStreak = signal<number>(0);
  heatmapData = signal<{date: string, count: number}[]>([]);

  ngOnInit(): void {
    this.moduleId = this.route.snapshot.paramMap.get('id') || '';
    
    if (this.moduleId) {
      // 1. Fetch modules, find matching module
      this.moduleService.getModules().subscribe((res: any[]) => {
        if (res) {
          const matchedModule = res.find((m: any) => m._id === this.moduleId);
          if (matchedModule) {
            this.module.set(matchedModule);
          }
        }
      });

      // 2. Load logs
      this.loadLogs();
    }
  }

  loadLogs(): void {
    this.moduleService.getModuleLogs(this.moduleId).subscribe((res: any[]) => {
      if (res) {
        this.logs.set(res);
        this.calculateStats(res);
      }
    });
  }

    calculateStats(logsArray: any[]) {
    // Heatmap formatting
    const formattedHeatmap = logsArray.map((log: any) => ({
      date: typeof log.date === 'string' ? log.date.split('T')[0] : new Date(log.date).toISOString().split('T')[0],
      count: log.value || 1
    }));
    this.heatmapData.set(formattedHeatmap);

    if (!logsArray || logsArray.length === 0) {
      this.currentStreak.set(0);
      this.longestStreak.set(0);
      return;
    }

    // Isolate unique days descending
    const daysLog = [...new Set(logsArray.map((log: any) => {
      const d = new Date(log.date);
      return new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
    }))].sort((a, b) => b - a);

    const todayObj = new Date();
    const today = new Date(todayObj.getFullYear(), todayObj.getMonth(), todayObj.getDate()).getTime();
    const msPerDay = 24 * 60 * 60 * 1000;

    let curr = 0;
    
    // Check if streak covers today or yesterday
    if (daysLog[0] === today || daysLog[0] === today - msPerDay) {
       curr = 1;
       let target = daysLog[0] - msPerDay;
       for (let i = 1; i < daysLog.length; i++) {
         if (daysLog[i] === target) {
            curr++;
            target -= msPerDay;
         } else {
            break;
         }
       }
    }
    this.currentStreak.set(curr);

    // Longest Streak array permutation
    let max = 1;
    let tempMax = 1;
    // Walk through ascending unique numbers
    const ascLogs = [...daysLog].reverse();
    for (let i = 1; i < ascLogs.length; i++) {
       if (ascLogs[i] - ascLogs[i-1] === msPerDay) {
          tempMax++;
       } else {
          if (tempMax > max) max = tempMax;
          tempMax = 1;
       }
    }
    if (tempMax > max) max = tempMax;
    
    this.longestStreak.set(max);
  }

  logActivity(): void {
    if (!this.module()) return;
    
    const xp = this.module().xpReward || 20;
    
    this.moduleService.logActivity(this.moduleId, 1).subscribe({
      next: () => {
        // reload logs upon success
        this.loadLogs();
        
        // Deal Boss Damage if active
        this.bossService.dealDamage(50);
        
        // Refetch module to update local XP display without breaking old flow
        this.moduleService.getModules().subscribe((res: any[]) => {
          if (res) {
            const m = res.find((x: any) => x._id === this.moduleId);
            if (m) this.module.set(m);
          }
        });
        
        // Broadcast XP update
        this.userService.updateXP(xp).subscribe({
          next: () => {
             console.log("+XP gained:", xp);
             
             // Sync backend XP visually straight into the legacy HUD state
             this.userService.getMe().subscribe((res: any) => {
                if (res) {
                   this.stateService.setStateFromApi(res);
                }
             });
          },
          error: (err) => {
             console.error('Failed to parse XP update', err);
          }
        });
      },
      error: (err) => {
        console.error('Failed to log activity', err);
      }
    });
  }
}
