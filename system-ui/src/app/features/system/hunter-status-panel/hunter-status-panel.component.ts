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
    <div class="hunter-status-card" [ngClass]="statusState + '-state'">
      <div class="status-header">
        <div class="rank-badge">
          <span class="rank-letter">{{ state.rank() }}</span>
          <span class="rank-label">CLASS</span>
        </div>
        
        <div class="info-block">
          <h2>LEVEL {{ state.level() }}</h2>
          <div class="status-msg">
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
           <div class="d-fill" [style.width.%]="disciplineScore"></div>
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
       margin-bottom: 24px;
       transition: all 0.3s ease;
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
       transition: all 0.3s ease;
    }
    
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
       transition: color 0.3s ease;
    }
    
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
       transition: width 1s ease, background 0.3s ease, box-shadow 0.3s ease;
    }

    /* STABLE STATE - CYAN */
    .stable-state {
       border-color: var(--system-cyan);
       box-shadow: 0 0 15px rgba(0, 234, 255, 0.1);
    }
    .stable-state .rank-badge {
       border-color: var(--system-cyan);
       box-shadow: 0 0 15px var(--system-cyan) inset;
    }
    .stable-state .status-msg {
       color: var(--system-cyan);
    }

    /* DANGER STATE - RED/ORANGE */
    .danger-state {
       border-color: #ff4400;
       box-shadow: 0 0 20px rgba(255, 68, 0, 0.3) inset, 0 8px 16px rgba(0,0,0,0.4);
       background: rgba(40, 10, 5, 0.85);
       animation: none;
    }
    .danger-state .rank-badge { 
       border-color: #ff4400; 
       box-shadow: 0 0 15px #ff4400 inset; 
    }
    .danger-state .status-msg {
       color: #ff4400;
       animation: blink 1.5s infinite;
    }
    .danger-state .d-fill {
       background: linear-gradient(90deg, #aa0000, #ff4400);
       box-shadow: 0 0 10px #ff4400;
    }

    /* BOSS STATE - PURPLE */
    .boss-state {
       border-color: #aa00ff;
       box-shadow: 0 0 20px rgba(170, 0, 255, 0.3) inset, 0 8px 16px rgba(0,0,0,0.4);
       background: rgba(20, 5, 30, 0.85);
       animation: pulsePurple 3s infinite alternate;
    }
    .boss-state .rank-badge { 
       border-color: #aa00ff; 
       box-shadow: 0 0 15px #aa00ff inset; 
    }
    .boss-state .status-msg {
       color: #d480ff;
       text-shadow: 0 0 5px #aa00ff;
    }
    .boss-state .d-fill {
       background: linear-gradient(90deg, #550088, #aa00ff);
       box-shadow: 0 0 10px #aa00ff;
    }

    @keyframes blink { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }
    @keyframes pulsePurple {
       0% { box-shadow: 0 0 20px rgba(170, 0, 255, 0.2) inset; }
       100% { box-shadow: 0 0 40px rgba(170, 0, 255, 0.5) inset; border-color: #cc44ff; }
    }
  `]
})
export class HunterStatusPanelComponent {
  state = inject(SystemStateService);
  bossService = inject(BossService);
  xpEngine = inject(XpEngineService);

  disciplineScore = 85; 

  get statusState(): 'stable' | 'danger' | 'boss' {
    if (this.bossService.boss() != null) return 'boss';
    if (this.xpEngine.isDangerMode()) return 'danger';
    return 'stable';
  }

  getStatusMessage() {
    switch (this.statusState) {
      case 'boss': return '⚔ Boss Threat Detected';
      case 'danger': return '⚠ Hunter Status: Weakening';
      case 'stable': default: return 'Status: Stable';
    }
  }
}
