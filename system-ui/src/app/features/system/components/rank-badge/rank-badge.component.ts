import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Rank } from '../../../../shared/services/system-state.service';

@Component({
  selector: 'app-rank-badge',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="rank-badge" [class]="rank">
      <div class="rank-letter">{{ rank }}</div>
      <div class="rank-glow"></div>
    </div>
  `,
  styles: [`
    .rank-badge {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 40px;
      height: 40px;
      border: 2px solid #00f3ff;
      border-radius: 4px;
      position: relative;
      background: rgba(0, 243, 255, 0.1);
      font-family: 'Orbitron', sans-serif;
      font-weight: bold;
      font-size: 1.5rem;
      color: #00f3ff;
      text-shadow: 0 0 10px rgba(0, 243, 255, 0.5);
      transition: all 0.3s ease;
    }

    .rank-letter {
      position: relative;
      z-index: 2;
    }

    .rank-glow {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      box-shadow: inset 0 0 15px rgba(0, 243, 255, 0.3), 0 0 10px rgba(0, 243, 255, 0.2);
    }

    /* Rank Specific Colors */
    .E { border-color: #808080; color: #808080; background: rgba(128, 128, 128, 0.1); }
    .E .rank-glow { box-shadow: inset 0 0 10px rgba(128, 128, 128, 0.2); }

    .D { border-color: #00ff88; color: #00ff88; background: rgba(0, 255, 136, 0.1); }
    .D .rank-glow { box-shadow: inset 0 0 10px rgba(0, 255, 136, 0.2); }

    .C { border-color: #00f3ff; color: #00f3ff; background: rgba(0, 243, 255, 0.1); }

    .B { border-color: #ffcc00; color: #ffcc00; background: rgba(255, 204, 0, 0.1); }
    .B .rank-glow { box-shadow: inset 0 0 10px rgba(255, 204, 0, 0.2); }

    .A { border-color: #ff3333; color: #ff3333; background: rgba(255, 51, 51, 0.1); }
    .A .rank-glow { box-shadow: inset 0 0 10px rgba(255, 51, 51, 0.2); }

    .S { 
      border-color: #ff00ff; 
      color: #ff00ff; 
      background: rgba(255, 0, 255, 0.1); 
      animation: s-rank-pulse 2s infinite alternate;
    }
    .S .rank-glow { box-shadow: inset 0 0 15px rgba(255, 0, 255, 0.3), 0 0 15px rgba(255, 0, 255, 0.4); }

    @keyframes s-rank-pulse {
      from { box-shadow: inset 0 0 15px rgba(255, 0, 255, 0.3), 0 0 10px rgba(255, 0, 255, 0.2); }
      to { box-shadow: inset 0 0 25px rgba(255, 0, 255, 0.5), 0 0 20px rgba(255, 0, 255, 0.6); transform: scale(1.05); }
    }
  `]
})
export class RankBadgeComponent {
  @Input() rank: Rank = 'E';
}
