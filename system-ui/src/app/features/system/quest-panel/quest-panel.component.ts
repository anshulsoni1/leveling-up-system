import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { QuestSystemService } from '../../../core/services/quest-system.service';
import { SoundService } from '../../../core/services/sound.service';
import { SystemStateService } from '../../../shared/services/system-state.service';

@Component({
  selector: 'app-quest-panel',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="quest-panel">
      <div class="panel-header">
        <h2 class="sys-title">DAILY QUESTS</h2>
      </div>

      <div class="quests-container" *ngIf="quests.length > 0; else noQuests">
        <div class="quest-card" *ngFor="let quest of quests" [class.completed]="quest.completed">
          <div class="quest-info">
             <div class="quest-title">[{{ quest.type }}] {{ quest.title }}</div>
             <div class="quest-desc">{{ quest.description }}</div>
             <div class="quest-reward">Reward: {{ quest.rewardXP }} XP</div>
          </div>
          <button class="sys-btn" (click)="completeQuest(quest)" [disabled]="quest.completed">
             {{ quest.completed ? 'COMPLETED' : 'COMPLETE QUEST' }}
          </button>
        </div>
      </div>
      <ng-template #noQuests>
          <div class="empty-msg">No active quests today.</div>
      </ng-template>
    </div>
  `,
  styles: [`
    .quest-panel {
      background: rgba(10, 15, 25, 0.9);
      border: 1px solid var(--system-cyan);
      box-shadow: 0 0 15px rgba(0, 234, 255, 0.1);
      border-radius: 8px;
      padding: 24px;
    }
    .panel-header {
      text-align: center;
      margin-bottom: 24px;
      border-bottom: 1px solid rgba(0, 234, 255, 0.2);
      padding-bottom: 15px;
    }
    .sys-title {
      color: var(--system-cyan);
      text-shadow: 0 0 10px var(--system-cyan);
      margin: 0;
      letter-spacing: 3px;
      font-size: 1.4rem;
    }
    .quests-container {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }
    .quest-card {
      background: rgba(0, 0, 0, 0.4);
      border: 1px solid rgba(0, 234, 255, 0.3);
      border-left: 4px solid var(--system-cyan);
      border-radius: 4px;
      padding: 16px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      transition: all 0.3s ease;
    }
    .quest-card:hover {
       background: rgba(0, 234, 255, 0.05);
       box-shadow: 0 0 10px rgba(0, 234, 255, 0.2) inset;
    }
    .quest-card.completed {
       border-left-color: #44ff44;
       opacity: 0.6;
    }
    .quest-title {
      color: #fff;
      font-size: 1.15rem;
      font-weight: bold;
      margin-bottom: 6px;
    }
    .quest-desc {
      color: #aaa;
      margin-bottom: 8px;
      font-size: 0.95rem;
    }
    .quest-reward {
      color: #ffaa00;
      font-weight: bold;
      font-family: monospace;
      font-size: 1.05rem;
    }
    .sys-btn {
      background: rgba(0, 234, 255, 0.1);
      border: 1px solid var(--system-cyan);
      color: var(--system-cyan);
      padding: 10px 20px;
      text-transform: uppercase;
      font-weight: bold;
      letter-spacing: 1px;
      cursor: pointer;
      border-radius: 4px;
      transition: all 0.2s ease;
      white-space: nowrap;
    }
    .sys-btn:not([disabled]):hover {
      background: var(--system-cyan);
      color: #000;
      box-shadow: 0 0 15px var(--system-cyan);
    }
    .sys-btn[disabled] {
      background: rgba(68, 255, 68, 0.1);
      border-color: #44ff44;
      color: #44ff44;
      cursor: not-allowed;
    }
    .empty-msg {
       color: #666;
       text-align: center;
       font-style: italic;
       padding: 2rem 0;
    }
  `]
})
export class QuestPanelComponent implements OnInit {
  private questService = inject(QuestSystemService);
  private soundService = inject(SoundService);
  private state = inject(SystemStateService);

  quests: any[] = [];

  ngOnInit() {
    this.questService.getDailyQuests().subscribe({
      next: (res: any) => {
        if (res && res.quests) {
           this.quests = res.quests;
        }
      },
      error: (err: any) => console.error(err)
    });
  }

  completeQuest(quest: any) {
    if (quest.completed) return;
    this.soundService.playSound('success');
    this.questService.completeQuest(quest._id).subscribe({
      next: (res: any) => {
         quest.completed = true;
         if (res && res.totalXP != null) {
            this.state.updateUserXp(res.totalXP);
         }
      },
      error: (err: any) => console.error(err)
    });
  }
}
