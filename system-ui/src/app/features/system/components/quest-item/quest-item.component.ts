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
          <span class="system-dim">REWARD: {{ quest.xp }} XP</span>
        </div>
      </div>
      <div class="quest-actions">
        <button *ngIf="!quest.completed" (click)="complete.emit(quest.id)" class="quest-status pending glow-hover">
          COMPLETE
        </button>
        <div *ngIf="quest.completed" class="quest-completed-container" title="Quest Completed">
          <div class="energy-node-done"></div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .quest-card {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1rem 1.25rem;
      margin-bottom: 0.8rem;
      background: rgba(0, 234, 255, 0.02);
      border-left: 3px solid transparent;
      transition: all 0.4s cubic-bezier(0.165, 0.84, 0.44, 1);
      position: relative;
      overflow: hidden;
    }

    .quest-card:hover:not(.completed) {
      background: rgba(0, 234, 255, 0.05);
      border-left: 3px solid #00eaff !important;
      box-shadow: -4px 0 15px rgba(0, 234, 255, 0.3), inset 0 0 10px rgba(0, 234, 255, 0.05);
      transform: translateX(4px);
    }

    .quest-card.completed {
      opacity: 0.5;
      border-color: rgba(0, 234, 255, 0.05);
      background: rgba(0, 0, 0, 0.15);
      pointer-events: none;
    }

    .quest-header {
      display: flex;
      gap: 0.75rem;
      align-items: center;
      margin-bottom: 0.4rem;
    }

    .difficulty-tag {
      font-family: 'Courier New', monospace;
      font-size: 0.65rem;
      font-weight: 700;
      padding: 2px 10px;
      border-radius: 20px;
      border: 1px solid currentColor;
      text-transform: uppercase;
      letter-spacing: 1px;
    }

    .easy { color: #00ff88; border-color: rgba(0, 255, 136, 0.4); text-shadow: 0 0 8px rgba(0, 255, 136, 0.3); }
    .medium { color: #ffcc00; border-color: rgba(255, 204, 0, 0.4); text-shadow: 0 0 8px rgba(255, 204, 0, 0.3); }
    .hard { color: #ff3333; border-color: rgba(255, 51, 51, 0.4); text-shadow: 0 0 8px rgba(255, 51, 51, 0.3); }

    .quest-title {
      font-size: 1.15rem;
      color: #e9f6ff;
      letter-spacing: 1px;
      margin-bottom: 0.2rem;
    }

    .quest-footer {
      font-family: 'Rajdhani', sans-serif;
      font-weight: 600;
      font-size: 0.8rem;
    }

    .quest-actions {
      display: flex;
      align-items: center;
      padding-left: 1rem;
    }

    button.quest-status {
      background: transparent;
      border: 1px solid #00eaff;
      color: #00eaff;
      padding: 0.6rem 1.4rem;
      cursor: pointer;
      font-family: 'Orbitron', sans-serif;
      font-size: 0.75rem;
      letter-spacing: 1.5px;
      transition: all 0.3s ease;

      &:hover {
        background: rgba(0, 234, 255, 0.1);
        box-shadow: 0 0 15px rgba(0, 234, 255, 0.4);
      }
    }

    .quest-completed-container {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 40px;
      height: 40px;
    }

    .energy-node-done {
      width: 14px;
      height: 14px;
      background: #00eaff;
      border-radius: 50%;
      box-shadow: 0 0 10px #00eaff;
      position: relative;
      
      &::after {
        content: '';
        position: absolute;
        inset: -4px;
        border: 1px solid #00eaff;
        border-radius: 50%;
        opacity: 0.6;
        animation: pulse-node 2s infinite;
      }
    }

    @keyframes pulse-node {
      0% { transform: scale(1); opacity: 0.6; }
      50% { transform: scale(1.5); opacity: 0; }
      100% { transform: scale(1); opacity: 0.6; }
    }
  `]
})
export class QuestItemComponent {
  @Input() quest!: any;
  @Output() complete = new EventEmitter<string>();
}
