import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SystemStateService } from '../../../shared/services/system-state.service';
import { BossService } from '../../../core/services/boss.service';
import { XpEngineService } from '../../../core/services/xp-engine.service';

@Component({
  selector: 'app-hunter-status-panel',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="hunter-status-card" [ngClass]="{'danger-glow': isDanger(), 'boss-glow': isBoss()}">
      <div class="status-header">
        <div class="rank-badge">
          <span class="rank-letter">{{ state.rank() }}</span>
          <span class="rank-label">CLASS</span>
        </div>
        
        <div class="info-block">
          <h2>LEVEL {{ state.level() }}</h2>
          <div class="status-msg" [ngClass]="{'text-danger': isDanger(), 'text-boss': isBoss(), 'text-stable': !isDanger() && !isBoss()}">
             {{ getStatusMessage() }}
          </div>
        </div>
      </div>

      <div class="discipline-section">
        <div class="d-header">
           <span>DISCIPLINE SCORE</span>
           <span>{{ disciplineScore }} / 100</span>
        </div>
        <div class="d-track">
           <div class="d-fill" [style.width.%]="disciplineScore" [ngClass]="{'fill-danger': isDanger()}"></div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .hunter-status-card {
       background: rgba(10, 15, 25, 0.85);
       border: 1px solid var(--system-cyan);
       border-radius: 8px;
       padding: 20px;
       box-shadow: 0 0 15px rgba(0, 234, 255, 0.1);
       margin-bottom: 24px;
       transition: all 0.3s ease;
    }
    .danger-glow {
       border-color: #ff3333;
       box-shadow: 0 0 20px rgba(255,50,50,0.3) inset, 0 8px 16px rgba(0,0,0,0.4);
       background: rgba(40,5,5,0.85);
    }
    .boss-glow {
       border-color: #ffaa00;
       box-shadow: 0 0 20px rgba(255,170,0,0.2) inset;
    }
    .status-header {
       display: flex;
       align-items: center;
       gap: 20px;
       margin-bottom: 20px;
    }
    .rank-badge {
       display: flex;
       flex-direction: column;
       align-items: center;
       justify-content: center;
       width: 80px;
       height: 80px;
       background: linear-gradient(135deg, rgba(0,234,255,0.1), rgba(0,100,255,0.2));
       border: 2px solid var(--system-cyan);
       border-radius: 50%;
       box-shadow: 0 0 15px var(--system-cyan) inset;
    }
    .danger-glow .rank-badge { border-color: #ff3333; box-shadow: 0 0 15px #ff3333 inset; }
    .boss-glow .rank-badge { border-color: #ffaa00; box-shadow: 0 0 15px #ffaa00 inset; }
    
    .rank-letter {
       font-size: 2.5rem;
       font-weight: 800;
       color: #fff;
       text-shadow: 0 0 10px rgba(255,255,255,0.8);
       line-height: 1;
    }
    .rank-label {
       font-size: 0.7rem;
       letter-spacing: 2px;
       color: #aaa;
       margin-top: 4px;
    }
    .info-block h2 {
       margin: 0 0 8px 0;
       font-size: 1.8rem;
       color: #fff;
       letter-spacing: 1px;
    }
    .status-msg {
       font-size: 1.1rem;
       font-weight: 600;
       letter-spacing: 1px;
       text-transform: uppercase;
    }
    .text-danger { color: #ff4444; animation: blink 1.5s infinite; }
    .text-boss { color: #ffaa00; }
    .text-stable { color: #00eaff; }
    
    @keyframes blink { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }
    
    .discipline-section {
       width: 100%;
    }
    .d-header {
       display: flex;
       justify-content: space-between;
       color: #aaa;
       font-size: 0.85rem;
       font-weight: bold;
       letter-spacing: 1.5px;
       margin-bottom: 8px;
    }
    .d-track {
       height: 12px;
       background: rgba(0,0,0,0.6);
       border-radius: 6px;
       overflow: hidden;
       border: 1px solid rgba(255,255,255,0.1);
    }
    .d-fill {
       height: 100%;
       background: linear-gradient(90deg, #0088ff, #00eaff);
       box-shadow: 0 0 10px #00eaff;
       transition: width 1s ease;
    }
    .fill-danger {
       background: linear-gradient(90deg, #aa0000, #ff3333);
       box-shadow: 0 0 10px #ff3333;
    }
  `]
})
export class HunterStatusPanelComponent {
  state = inject(SystemStateService);
  bossService = inject(BossService);
  xpEngine = inject(XpEngineService);

  disciplineScore = 85; 

  isDanger() {
    return this.xpEngine.isDangerMode();
  }

  isBoss() {
    return this.bossService.boss() != null;
  }

  getStatusMessage() {
    if (this.isDanger()) return '⚠ Hunter Status: Weakening';
    if (this.isBoss()) return '⚔ Boss Threat Detected';
    return 'Status: Stable';
  }
}
