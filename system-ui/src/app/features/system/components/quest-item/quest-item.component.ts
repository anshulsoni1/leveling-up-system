import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Quest } from '../../../../shared/services/system-state.service';

@Component({
  selector: 'app-quest-item',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="quest-card hud-border" [class.completed]="quest.completed">
      <div class="quest-info">
        <div class="quest-header">
          <span class="system-label">{{ quest.type | uppercase }}</span>
          <span class="difficulty-tag" [class]="quest.difficulty">{{ quest.difficulty }}</span>
        </div>
        <span class="system-value quest-title">{{ quest.title }}</span>
        <div class="quest-footer">
          <span class="system-dim">Reward: {{ quest.xp }} XP</span>
        </div>
      </div>
      <div class="quest-actions">
        <button *ngIf="!quest.completed" (click)="complete.emit(quest.id)" class="quest-status pending glow-hover">
          Complete
        </button>
        <div *ngIf="quest.completed" class="quest-status complete">
          Done
        </div>
      </div>
    </div>
  `,
  styles: [`
    .quest-card {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1rem;
      margin-bottom: 0.75rem;
      background: rgba(0, 243, 255, 0.03);
      transition: all 0.3s ease;
    }
    .quest-card.completed {
      opacity: 0.6;
      border-color: rgba(0, 243, 255, 0.1);
      background: rgba(0, 0, 0, 0.2);
    }
    .quest-header {
      display: flex;
      gap: 0.5rem;
      align-items: center;
      margin-bottom: 0.25rem;
    }
    .difficulty-tag {
      font-size: 0.65rem;
      padding: 1px 4px;
      border: 1px solid currentColor;
      text-transform: uppercase;
    }
    .easy { color: #00ff88; }
    .medium { color: #ffcc00; }
    .hard { color: #ff3333; }
    .quest-title {
      font-size: 1.1rem;
      display: block;
    }
    .quest-footer {
      margin-top: 0.25rem;
    }
    .quest-actions {
      display: flex;
      align-items: center;
    }
    button.quest-status {
      background: transparent;
      border: 1px solid #00f3ff;
      color: #00f3ff;
      padding: 0.5rem 1rem;
      cursor: pointer;
      font-family: 'Orbitron', sans-serif;
      font-size: 0.8rem;
    }
    .pending {
      color: #00f3ff;
    }
    .complete {
      color: #00ff88;
      font-weight: bold;
    }
  `]
})
export class QuestItemComponent {
  @Input() quest!: any;
  @Output() complete = new EventEmitter<string>();
}
