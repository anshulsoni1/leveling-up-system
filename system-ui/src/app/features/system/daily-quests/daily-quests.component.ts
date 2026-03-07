import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModuleService } from '../../../core/services/module.service';
import { UserService } from '../../../core/services/user.service';
import { SystemStateService } from '../../../shared/services/system-state.service';
import { forkJoin, switchMap, of, map, catchError } from 'rxjs';

@Component({
  selector: 'app-daily-quests',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './daily-quests.component.html',
  styleUrl: './daily-quests.component.scss'
})
export class DailyQuestsComponent implements OnInit {
  private moduleService = inject(ModuleService);
  private userService = inject(UserService);
  private stateService = inject(SystemStateService);

  quests = [
    { id: "log3", title: "Log 3 activities", reward: 30, completed: false },
    { id: "complete1", title: "Complete 1 module activity", reward: 20, completed: false },
    { id: "streak", title: "Maintain streak", reward: 25, completed: false }
  ];

  ngOnInit() {
    this.evaluateQuests();
  }

  evaluateQuests() {
    const todayObj = new Date();
    const todayStr = `${todayObj.getFullYear()}-${String(todayObj.getMonth() + 1).padStart(2, '0')}-${String(todayObj.getDate()).padStart(2, '0')}`;
    const storageKey = `daily_quests_${todayStr}`;
    
    // Load local anti-cheat cache
    let savedState: any = {};
    if (typeof localStorage !== 'undefined') {
        savedState = JSON.parse(localStorage.getItem(storageKey) || '{}');
    }

    // Pre-mark
    this.quests.forEach(q => {
       if (savedState[q.id]) q.completed = true;
    });

    if (this.quests.every(q => q.completed)) return; // All done!

    // Fetch all logs
    this.moduleService.getModules().pipe(
      switchMap((modules: any[]) => {
        if (!modules || modules.length === 0) return of([]);
        const reqs = modules.map(m => this.moduleService.getModuleLogs(m._id).pipe(catchError(() => of([]))));
        return forkJoin(reqs);
      })
    ).subscribe((results: any[]) => {
       const allLogs = results.flat();
       
       let logsToday = 0;
       
       const uniqueDays = [...new Set(allLogs.map(log => {
          const d = new Date(log.date);
          if (d.getFullYear() === todayObj.getFullYear() && d.getMonth() === todayObj.getMonth() && d.getDate() === todayObj.getDate()) {
             logsToday++;
          }
          return new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
       }))].sort((a, b) => b - a);

       const msPerDay = 24 * 60 * 60 * 1000;
       const todayTime = new Date(todayObj.getFullYear(), todayObj.getMonth(), todayObj.getDate()).getTime();
       
       let currentStreak = 0;
       if (uniqueDays[0] === todayTime || uniqueDays[0] === todayTime - msPerDay) {
          currentStreak = 1;
          let target = uniqueDays[0] - msPerDay;
          for (let i = 1; i < uniqueDays.length; i++) {
             if (uniqueDays[i] === target) {
                currentStreak++;
                target -= msPerDay;
             } else {
                break;
             }
          }
       }

       let xpAwarded = 0;
       let updated = false;

       this.quests.forEach(q => {
          if (!q.completed) {
             let meets = false;
             if (q.id === 'log3' && logsToday >= 3) meets = true;
             if (q.id === 'complete1' && logsToday >= 1) meets = true;
             if (q.id === 'streak' && currentStreak > 0) meets = true;

             if (meets) {
                q.completed = true;
                savedState[q.id] = true;
                xpAwarded += q.reward;
                updated = true;
                console.log(`+XP gained (${q.title}):`, q.reward);
             }
          }
       });

       if (updated) {
          if (typeof localStorage !== 'undefined') {
             localStorage.setItem(storageKey, JSON.stringify(savedState));
          }
          
          if (xpAwarded > 0) {
             this.userService.updateXP(xpAwarded).subscribe({
                next: () => {
                   this.userService.getMe().subscribe((res: any) => {
                      if (res) this.stateService.setStateFromApi(res);
                   });
                }
             });
          }
       }
    });
  }
}
