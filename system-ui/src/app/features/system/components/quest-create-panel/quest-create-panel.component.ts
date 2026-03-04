import { Component, Output, EventEmitter, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { QuestType, QuestDifficulty } from '../../../../shared/services/system-state.service';

@Component({
  selector: 'app-quest-create-panel',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="create-panel hud-panel blur-bg hud-border">
      <h3 class="panel-title">NEW SYSTEM QUEST</h3>
      <div class="form-group">
        <label class="system-label">Quest Title</label>
        <input type="text" [(ngModel)]="title" placeholder="Enter objective..." class="hud-input">
      </div>
      
      <div class="form-row">
        <div class="form-group flex-1">
          <label class="system-label">Type</label>
          <select [(ngModel)]="type" (ngModelChange)="type.set($event)" class="hud-input">
            <option value="workout">Workout (STR)</option>
            <option value="study">Study (INT)</option>
            <option value="habit">Habit (DIS)</option>
            <option value="challenge">Challenge (CON)</option>
          </select>
        </div>
        
        <div class="form-group flex-1">
          <label class="system-label">Difficulty</label>
          <select [(ngModel)]="difficulty" (ngModelChange)="difficulty.set($event)" class="hud-input">
            <option value="easy">Easy (10 XP)</option>
            <option value="medium">Medium (20 XP)</option>
            <option value="hard">Hard (40 XP)</option>
          </select>
        </div>
      </div>

      <div class="action-buttons">
        <button (click)="close.emit()" class="btn-cancel glow-hover">CANCEL</button>
        <button (click)="submit()" [disabled]="!title()" class="btn-submit glow-hover">INITIALIZE</button>
      </div>
    </div>
  `,
  styles: [`
    .create-panel {
      padding: 1.5rem;
      max-width: 500px;
      margin: 0 auto;
    }
    .form-group {
      margin-bottom: 1rem;
    }
    .form-row {
      display: flex;
      gap: 1rem;
      margin-bottom: 1rem;
    }
    .flex-1 { flex: 1; }
    .hud-input {
      width: 100%;
      background: rgba(0, 0, 0, 0.4);
      border: 1px solid rgba(0, 243, 255, 0.3);
      color: #e0e0e0;
      padding: 0.75rem;
      font-family: 'Inter', sans-serif;
      outline: none;
      box-sizing: border-box;
    }
    .hud-input:focus {
      border-color: #00f3ff;
      box-shadow: 0 0 10px rgba(0, 243, 255, 0.1);
    }
    .action-buttons {
      display: flex;
      justify-content: flex-end;
      gap: 1rem;
      margin-top: 1.5rem;
    }
    .btn-submit, .btn-cancel {
      padding: 0.75rem 1.5rem;
      font-family: 'Orbitron', sans-serif;
      cursor: pointer;
      font-size: 0.8rem;
    }
    .btn-submit {
      background: #00f3ff;
      color: #000;
      border: none;
    }
    .btn-submit:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
    .btn-cancel {
      background: transparent;
      color: rgba(0, 243, 255, 0.5);
      border: 1px solid rgba(0, 243, 255, 0.3);
    }
  `]
})
export class QuestCreatePanelComponent {
  title = signal('');
  type = signal<QuestType>('workout');
  difficulty = signal<QuestDifficulty>('easy');

  @Output() create = new EventEmitter<{title: string, type: QuestType, difficulty: QuestDifficulty}>();
  @Output() close = new EventEmitter<void>();

  submit() {
    if (this.title()) {
      this.create.emit({
        title: this.title(),
        type: this.type(),
        difficulty: this.difficulty()
      });
      this.title.set('');
    }
  }
}
