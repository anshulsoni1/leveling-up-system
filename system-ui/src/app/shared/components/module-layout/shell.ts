import { Component, Input, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, NavigationEnd } from '@angular/router';
import { filter, Subscription } from 'rxjs';
import { ModuleHeaderComponent } from './header';
import { ModuleHeatmapComponent } from './heatmap';
import { ModuleJournalComponent } from './journal';
import { ModuleLogViewerComponent } from '../module-log-viewer/module-log-viewer.component';

@Component({
  selector: 'app-module-shell',
  standalone: true,
  imports: [
    CommonModule, 
    ModuleHeaderComponent, 
    ModuleHeatmapComponent, 
    ModuleJournalComponent,
    ModuleLogViewerComponent
  ],
  template: `
    <div class="module-shell-container">
      <app-module-header 
         [title]="title || 'Module'" 
         [streak]="computedStreak"
         [bestStreak]="computedBestStreak"
         [statLabel]="computedStatLabel"
         [statValue]="computedStatValue">
      </app-module-header>
      
      <div class="module-scroll-content">
        <app-module-heatmap></app-module-heatmap>
        <div class="tracker-slot hud-panel">
          <h2 class="panel-title">SYSTEM TRACKER <span class="system-dim">[Module Specific]</span></h2>
          <div class="slot-content">
            <ng-content select="[tracker]"></ng-content>
          </div>
        </div>
        <app-module-journal [moduleName]="currentModule"></app-module-journal>
        <app-module-log-viewer [moduleId]="currentModule"></app-module-log-viewer>
      </div>
    </div>
  `,
  styles: [`
    @use '../../styles/system-theme' as *;
    .module-shell-container {
      display: flex;
      flex-direction: column;
      gap: 2rem;
      width: 100%;
      height: 100%;
      animation: fadeIn 0.5s ease-out;
    }
    .module-scroll-content {
      display: flex;
      flex-direction: column;
      gap: 2rem;
      width: 100%;
    }
    .tracker-slot {
      width: 100%;
      padding: 1.5rem;
      min-height: 200px;
    }
    .slot-content {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }
    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }
  `]
})
export class ModuleShellComponent implements OnInit, OnDestroy {
  @Input() title: string | null = '';
  computedStreak: number = 0;
  computedBestStreak: number = 0;
  computedStatLabel: string = '';
  computedStatValue: number = 0;
  
  currentModule: string = '';
  private sub?: Subscription;

  constructor(private router: Router, private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    this.detectModule(this.router.url);
    this.calculateStreak();
    this.calculateStats();

    this.sub = this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: any) => {
         this.detectModule(event.urlAfterRedirects);
         this.calculateStreak();
         this.calculateStats();
         this.cdr.detectChanges();
      });
      
    if (typeof window !== 'undefined') {
       window.addEventListener('storage', this.handleStorageChange);
    }
  }

  ngOnDestroy() {
    if (this.sub) {
       this.sub.unsubscribe();
    }
    if (typeof window !== 'undefined') {
       window.removeEventListener('storage', this.handleStorageChange);
    }
  }
  
  private handleStorageChange = () => {
    this.calculateStreak();
    this.calculateStats();
    this.cdr.detectChanges();
  }

  private detectModule(url: string) {
    if (url.includes('/system/books')) {
      this.currentModule = 'books';
      this.computedStatLabel = 'TOTAL PAGES';
    } else if (url.includes('/system/dsa')) {
      this.currentModule = 'dsa';
      this.computedStatLabel = 'TOTAL SOLVED';
    } else if (url.includes('/system/skills')) {
      this.currentModule = 'skills';
      this.computedStatLabel = 'ACTIVE DAYS';
    } else {
      this.currentModule = '';
      this.computedStatLabel = '';
    }
  }

  private calculateStreak() {
    let streakCount = 0;
    const today = new Date();
    
    for (let i = 0; i < 5000; i++) {
       const d = new Date(today);
       d.setDate(today.getDate() - i);
       const dateStr = this.formatDate(d);
       
       const activity = this.getActivityForDate(dateStr);
       
       if (activity > 0) {
          streakCount++;
       } else {
          break;
       }
    }
    this.computedStreak = streakCount;
  }
  
  private calculateStats() {
      if (typeof window === 'undefined') return;
      
      let dates: string[] = [];
      let totalStat = 0;

      if (this.currentModule === 'books') {
         const saved = window.localStorage.getItem('bookData');
         if (saved) {
             try {
                 const data = JSON.parse(saved);
                 if (data && data.history) {
                    dates = Object.keys(data.history).filter(k => data.history[k] > 0);
                    totalStat = Object.values(data.history).reduce((sum: any, val: any) => sum + (val || 0), 0) as number;
                 }
             } catch(e) {}
         }
      } else if (this.currentModule === 'dsa') {
         const saved = window.localStorage.getItem('dsaData');
         if (saved) {
             try {
                 const data = JSON.parse(saved);
                 if (data && data.history) {
                    dates = Object.keys(data.history).filter(k => data.history[k] > 0);
                    totalStat = Object.values(data.history).reduce((sum: any, val: any) => sum + (val || 0), 0) as number;
                 }
                 if (totalStat === 0 && data.categories && Array.isArray(data.categories)) {
                     totalStat = data.categories.reduce((catSum: number, cat: any) => {
                         if (!cat.topics) return catSum;
                         return catSum + cat.topics.reduce((topicSum: number, topic: any) => topicSum + (topic.solved || 0), 0);
                     }, 0);
                 }
             } catch(e) {}
         }
      } else if (this.currentModule === 'skills') {
         const saved = window.localStorage.getItem('journalData');
         if (saved) {
             try {
                 const entries = JSON.parse(saved);
                 if (Array.isArray(entries)) {
                     const uniqueDates = new Set<string>();
                     entries.forEach((e: any) => {
                        if (e.timestamp) uniqueDates.add(this.formatDate(new Date(e.timestamp)));
                     });
                     dates = Array.from(uniqueDates);
                     totalStat = dates.length;
                 }
             } catch(e) {}
         }
      }
      
      this.computedStatValue = totalStat;
      
      if (dates.length === 0) {
          this.computedBestStreak = 0;
          return;
      }
      
      dates.sort((a, b) => new Date(a).getTime() - new Date(b).getTime());
      
      let maxStreak = 1;
      let currentRun = 1;
      
      for (let i = 1; i < dates.length; i++) {
          const prevDate = new Date(dates[i - 1]);
          const currDate = new Date(dates[i]);
          
          prevDate.setHours(0,0,0,0);
          currDate.setHours(0,0,0,0);
          
          const diffTime = Math.abs(currDate.getTime() - prevDate.getTime());
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
          
          if (diffDays === 1) {
              currentRun++;
              if (currentRun > maxStreak) {
                  maxStreak = currentRun;
              }
          } else if (diffDays > 1) {
              currentRun = 1;
          }
      }
      
      this.computedBestStreak = maxStreak;
  }

  private getActivityForDate(dateStr: string): number {
    if (typeof window === 'undefined') return 0;
    
    if (this.currentModule === 'books') {
       const saved = window.localStorage.getItem('bookData');
       if (saved) {
          try {
             const data = JSON.parse(saved);
             if (data && data.history && typeof data.history[dateStr] === 'number') {
                return data.history[dateStr];
             }
          } catch (e) {}
       }
    } else if (this.currentModule === 'dsa') {
       const saved = window.localStorage.getItem('dsaData');
       if (saved) {
          try {
             const data = JSON.parse(saved);
             if (data && data.history && typeof data.history[dateStr] === 'number') {
                return data.history[dateStr];
             }
          } catch (e) {}
       }
    } else if (this.currentModule === 'skills') {
       const saved = window.localStorage.getItem('journalData'); 
       if (saved) {
          try {
             const entries = JSON.parse(saved);
             if (Array.isArray(entries)) {
                const exists = entries.some((e: any) => {
                   if (e.timestamp) {
                      const d = new Date(e.timestamp);
                      return this.formatDate(d) === dateStr;
                   }
                   return false;
                });
                return exists ? 1 : 0;
             }
          } catch (e) {}
       }
    }
    return 0;
  }

  private formatDate(d: Date): string {
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  }
}
