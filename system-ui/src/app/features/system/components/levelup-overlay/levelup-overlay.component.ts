import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RankBadgeComponent } from '../rank-badge/rank-badge.component';
import { Rank } from '../../../../shared/services/system-state.service';

@Component({
  selector: 'app-levelup-overlay',
  standalone: true,
  imports: [CommonModule, RankBadgeComponent],
  template: `
    <div class="levelup-overlay blur-bg" *ngIf="visible">
      <div class="panel-container hud-panel glow-strong">
        <h1 class="level-up-text">LEVEL UP</h1>
        
        <div class="transition-container">
          <div class="stat-change">
            <span class="label">LEVEL</span>
            <span class="value prev">{{ previousLevel }}</span>
            <span class="arrow">➜</span>
            <span class="value current">{{ currentLevel }}</span>
          </div>
          
          <div class="rank-display">
            <span class="label">CURRENT RANK</span>
            <app-rank-badge [rank]="rank"></app-rank-badge>
          </div>
        </div>
        
        <div class="system-message">SYSTEM PARAMETERS UPDATED</div>
      </div>
    </div>
  `,
  styles: [`
    .levelup-overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
      animation: fade-in 0.5s ease-out forwards;
    }

    .panel-container {
      background: rgba(0, 0, 0, 0.85);
      padding: 3rem;
      text-align: center;
      border: 2px solid #00f3ff;
      transform: scale(0.8);
      animation: scale-up 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
    }

    .level-up-text {
      color: #00f3ff;
      font-family: 'Orbitron', sans-serif;
      font-size: 3rem;
      margin: 0 0 2rem 0;
      letter-spacing: 0.5rem;
      text-shadow: 0 0 20px rgba(0, 243, 255, 0.8);
    }

    .transition-container {
      display: flex;
      flex-direction: column;
      gap: 2rem;
      margin-bottom: 2rem;
    }

    .stat-change {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 1.5rem;
      font-family: 'Orbitron', sans-serif;
    }

    .label {
      color: rgba(0, 243, 255, 0.5);
      font-size: 0.8rem;
    }

    .value {
      font-size: 2rem;
      font-weight: bold;
    }

    .value.prev { color: rgba(255, 255, 255, 0.4); }
    .value.current { color: #00f3ff; text-shadow: 0 0 10px rgba(0, 243, 255, 0.5); }

    .arrow { color: #00f3ff; opacity: 0.5; }

    .rank-display {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 0.5rem;
    }

    .system-message {
      font-family: 'Inter', sans-serif;
      color: rgba(0, 243, 255, 0.6);
      font-size: 0.7rem;
      letter-spacing: 0.2rem;
      margin-top: 1rem;
    }

    @keyframes fade-in {
      from { opacity: 0; background-color: rgba(0, 0, 0, 0); }
      to { opacity: 1; background-color: rgba(0, 0, 0, 0.5); }
    }

    @keyframes scale-up {
      to { transform: scale(1); }
    }

    .glow-strong {
      box-shadow: 0 0 50px rgba(0, 243, 255, 0.2), inset 0 0 30px rgba(0, 243, 255, 0.1);
    }
  `]
})
export class LevelUpOverlayComponent implements OnInit {
  @Input() previousLevel: number = 0;
  @Input() currentLevel: number = 0;
  @Input() rank: Rank = 'E';
  @Input() duration: number = 2000;
  @Output() close = new EventEmitter<void>();

  visible: boolean = true;

  ngOnInit() {
    setTimeout(() => {
      this.visible = false;
      this.close.emit();
    }, this.duration);
  }
}
