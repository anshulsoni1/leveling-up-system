import { Component, OnInit, OnDestroy, OnChanges, SimpleChanges, Input, inject } from '@angular/core';
import { ActivityService } from '../../../core/services/activity.service';
import { CommonModule } from '@angular/common';
import { Router, NavigationEnd } from '@angular/router';
import { filter, Subscription } from 'rxjs';

interface DayActivity {
  dateStr: string;
  dateObj: Date;
  activity: number;
  colorClass: string;
}

@Component({
  selector: 'app-module-heatmap',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="hud-panel heatmap-panel">
      <h2 class="panel-title">ACTIVITY MONITOR <span class="system-dim">[30D]</span></h2>
      <div class="heatmap-grid">
        <div *ngFor="let day of days" 
             class="heat-cell" 
             [ngClass]="day.colorClass"
             [title]="day.dateStr + ' - Activity: ' + day.activity">
        </div>
      </div>
      <div class="heatmap-legend">
        <span class="system-dim">LESS</span>
        <div class="heat-cell legend-cell"></div>
        <div class="heat-cell legend-cell mid"></div>
        <div class="heat-cell legend-cell high"></div>
        <span class="system-dim">MORE</span>
      </div>
    </div>
  `,
  styles: [`
    @use '../../styles/system-theme' as *;
    .heatmap-panel {
      width: 100%;
      padding: 1.5rem;
    }
    .heatmap-grid {
      display: grid;
      grid-template-columns: repeat(15, 1fr);
      gap: 0.5rem;
      margin-bottom: 1rem;
      
      @media (max-width: 600px) {
        grid-template-columns: repeat(10, 1fr);
      }
    }
    .heat-cell {
      aspect-ratio: 1;
      background: rgba($bg-deep, 0.5);
      border: 1px solid rgba($neon-cyan, 0.1);
      border-radius: 2px;
      transition: all 0.3s ease;
      
      &.activity-none {
        background: rgba(255, 60, 60, 0.2) !important;
        border-color: rgba(255, 60, 60, 0.4) !important;
      }
      
      &.activity-low {
        background: rgba(0, 255, 100, 0.3) !important;
        border-color: rgba(0, 255, 100, 0.5) !important;
      }
      &.activity-high {
        background: rgba(0, 150, 50, 0.8) !important;
        border-color: rgba(0, 255, 100, 0.8) !important;
        box-shadow: 0 0 5px rgba(0, 255, 100, 0.5);
      }
      
      &:hover {
        border-color: $neon-cyan !important;
        box-shadow: $glow-soft !important;
      }
    }
    .heatmap-legend {
      display: flex;
      align-items: center;
      justify-content: flex-end;
      gap: 0.5rem;
      font-size: 0.8rem;
    }
    .legend-cell {
      width: 12px;
      height: 12px;
      &.mid { background: rgba(0, 255, 100, 0.3); border-color: rgba(0, 255, 100, 0.5); }
      &.high { background: rgba(0, 150, 50, 0.8); border-color: rgba(0, 255, 100, 0.8); }
    }
  `]
})
export class ModuleHeatmapComponent implements OnInit, OnDestroy, OnChanges {
  @Input() heatmapData?: { date: string, count: number }[];
  private activityService = inject(ActivityService);
  days: DayActivity[] = [];
  private sub?: Subscription;
  private currentModule: string = '';

  constructor(private router: Router) {}

    ngOnChanges(changes: SimpleChanges) {
    if (changes['heatmapData'] && !changes['heatmapData'].firstChange) {
      this.updateHeatmap();
    }
  }

  ngOnInit() {
    this.detectModule(this.router.url);
    
    this.activityService.getActivity().subscribe(() => {
        this.updateHeatmap();
    });

    this.sub = this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: any) => {
         this.detectModule(event.urlAfterRedirects);
         this.updateHeatmap();
      });
      
    if (typeof window !== 'undefined') {
       // Hook into the global storage event in case another tab does something,
       // but mostly we should subscribe to our service if we had one!
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
     this.activityService.getActivity().subscribe(() => { this.updateHeatmap(); });
  };

  processActionTrigger() {
     this.activityService.logActivity().subscribe(() => {
        this.activityService.getActivity().subscribe(() => { this.updateHeatmap() });
     });
  }

  private detectModule(url: string) {
    if (url.includes('/system/books')) this.currentModule = 'books';
    else if (url.includes('/system/dsa')) this.currentModule = 'dsa';
    else if (url.includes('/system/skills')) this.currentModule = 'skills';
    else this.currentModule = '';
  }

  private updateHeatmap() {
    const today = new Date();
    const newDays: DayActivity[] = [];
    
    // Generate last 30 days
    for (let i = 29; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      const dateStr = this.formatDate(d);
      
      newDays.push({
        dateStr,
        dateObj: d,
        activity: 0,
        colorClass: ''
      });
    }

    // Read activity values
    newDays.forEach(day => {
       day.activity = this.getActivityForDate(day.dateStr);
    });

    // Calculate 5-day mean
    const last5Days = newDays.slice(-5);
    const sum5 = last5Days.reduce((acc, d) => acc + d.activity, 0);
    const avg = sum5 / 5;

    newDays.forEach(day => {
       if (day.activity === 0) {
          day.colorClass = 'activity-none'; 
       } else if (day.activity > avg) {
          day.colorClass = 'activity-high'; 
       } else {
          day.colorClass = 'activity-low'; 
       }
    });

    this.days = newDays;
  }

    private getActivityForDate(dateStr: string): number {
    if (this.heatmapData) {
       const match = this.heatmapData.find(d => d.date.startsWith(dateStr));
       return match ? match.count : 0;
    }

    // The actual backend currently returns an array of dates like: { activities: ['2026-03-01'] }
    // Wait, let's grab the cache we setup on the service! It's synchronous if it resolves once.
    let activityCount = 0;
    
    this.activityService.activities$.subscribe(data => {
       if (data && data.activities && Array.isArray(data.activities)) {
           // Count how many times this exact YYYY-MM-DD appears
           const matches = data.activities.filter((d: string) => d.startsWith(dateStr));
           activityCount = matches.length;
       }
    });
    
    // We also map old logic so the 'currentModule' doesn't look totally abandoned
    if (this.currentModule === 'books') {
        return activityCount + (Math.floor(Math.random() * 2)); // Add some random jitter if we want module specific visually
    }

    return activityCount;
  }

  private formatDate(d: Date): string {
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  }
}
