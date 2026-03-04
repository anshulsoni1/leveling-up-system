import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { AchievementService } from '../../../core/services/achievement.service';

interface AchievementDef {
  key: string;
  name: string;
  desc: string;
  icon: string;
}

const ACHIEVEMENTS_DEFS: AchievementDef[] = [
  { key: 'BOOK_100', name: 'Scholar', desc: 'Read 100 Pages', icon: '&#128214;' },
  { key: 'DSA_50', name: 'Algorithms Master', desc: 'Solve 50 Problems', icon: '&#128187;' },
  { key: 'STREAK_7', name: 'Relentless', desc: '7 Day Streak', icon: '&#128293;' },
  { key: 'LEVEL_5', name: 'Awakened', desc: 'Reach Level 5', icon: '&#9889;' },
  { key: 'SKILL_1', name: 'Initiate', desc: 'Learn 1 Skill', icon: '&#9876;' }
];

@Component({
  selector: 'app-achievements-panel',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="hud-panel achievements-panel">
       <h2 class="panel-title">ACHIEVEMENTS <span class="system-dim">[{{unlockedCount}}/{{totalCount}}]</span></h2>
       <div class="achievements-grid">
          <div *ngFor="let def of getDisplayGrid()" 
               class="achievement-card"
               [class.unlocked]="def.unlocked">
             <div class="icon-wrapper" [innerHTML]="def.icon"></div>
             <div class="details">
                <div class="name">{{def.name}}</div>
                <div class="desc">{{def.unlocked ? def.desc : 'Locked'}}</div>
             </div>
          </div>
       </div>
    </div>
  `,
  styles: [`
    @use '../../styles/system-theme' as *;
    .achievements-panel {
       margin-top: 1rem;
       width: 100%;
       padding: 1.5rem;
    }
    .achievements-grid {
       display: grid;
       grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
       gap: 1rem;
    }
    .achievement-card {
       display: flex;
       align-items: center;
       gap: 1rem;
       padding: 1rem;
       background: rgba($bg-deep, 0.4);
       border: 1px solid rgba($text-primary, 0.1);
       border-radius: 4px;
       transition: all 0.3s ease;
       opacity: 0.5;
       
       &.unlocked {
         opacity: 1;
         border-color: rgba($neon-cyan, 0.5);
         box-shadow: $glow-soft;
         background: rgba($neon-cyan, 0.05);
       }
    }
    .icon-wrapper {
       font-size: 1.5rem;
       width: 40px;
       height: 40px;
       display: flex;
       align-items: center;
       justify-content: center;
       background: rgba(0,0,0,0.5);
       border-radius: 50%;
       border: 1px solid rgba($neon-cyan, 0.2);
    }
    .details {
       display: flex;
       flex-direction: column;
    }
    .name {
       font-family: 'Rajdhani', sans-serif;
       font-weight: 600;
       color: $text-primary;
       letter-spacing: 1px;
    }
    .desc {
       font-size: 0.8rem;
       color: rgba($text-primary, 0.6);
    }
  `]
})
export class AchievementsPanelComponent implements OnInit, OnDestroy {
  private achievementService = inject(AchievementService);
  
  unlockedList: any[] = [];
  totalCount = ACHIEVEMENTS_DEFS.length;
  unlockedCount = 0;
  private sub?: Subscription;

  ngOnInit() {
     this.sub = this.achievementService.achievements$.subscribe(list => {
         this.unlockedList = list || [];
         this.unlockedCount = this.unlockedList.length;
     });
     this.achievementService.getAchievements().subscribe();
  }

  ngOnDestroy() {
     if (this.sub) this.sub.unsubscribe();
  }
  
  getDisplayGrid() {
     return ACHIEVEMENTS_DEFS.map(def => {
         return {
            ...def,
            unlocked: this.unlockedList.some(u => u.key === def.key)
         };
     });
  }
}