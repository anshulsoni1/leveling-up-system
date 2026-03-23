import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StatBarComponent } from '../../../shared/components/stat-bar/stat-bar.component';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { ToastService } from '../../../shared/services/toast.service';
import { SystemStateService } from '../../../shared/services/system-state.service';
import { BossService } from '../../../core/services/boss.service';
import { XpEngineService } from '../../../core/services/xp-engine.service';

@Component({
  selector: 'app-hunter-status-panel',
  standalone: true,
  imports: [CommonModule, StatBarComponent],
  template: `
    <div class="hunter-status-card" [ngClass]="statusState + '-state'">
      <button class="logout-btn" (click)="logout()">LOGOUT</button>
      <div class="status-header">
        <div class="rank-badge">
          <span class="rank-letter">{{ state.rank() }}</span>
          <span class="rank-label">CLASS</span>
        </div>
        
        <div class="info-block">
          <h2>LEVEL {{ state.level() }}</h2>
          
          <div class="xp-container">
            <div class="xp-info">
              <span class="xp-label">XP: {{ state.xp() }} / {{ state.maxXp() }}</span>
            </div>
            <div class="xp-bar-bg">
              <div class="xp-bar-fill" [style.width.%]="(state.xp() / state.maxXp()) * 100"></div>
            </div>
            <div class="xp-remaining">
              Next Level: {{ state.maxXp() - state.xp() }} XP remaining
            </div>
          </div>

          <div class="status-msg">
             {{ getStatusMessage() }}
          </div>
        </div>
      </div>

      <div class="stats-grid">
        <app-stat-bar label="Strength" [value]="state.attributes().strength" [max]="100"></app-stat-bar>
        <app-stat-bar label="Intelligence" [value]="state.attributes().intelligence" [max]="100"></app-stat-bar>
        <app-stat-bar label="Consistency" [value]="state.attributes().consistency" [max]="100"></app-stat-bar>
        <app-stat-bar label="Discipline" [value]="state.attributes().discipline" [max]="100"></app-stat-bar>
      </div>
    </div>
  `,
  styles: [`
    .hunter-status-card {
       position: relative;
       background: rgba(10, 15, 25, 0.85);
       border: 1px solid var(--system-cyan);
       border-radius: 8px;
       padding: 20px;
       margin-bottom: 24px;
       transition: all 0.3s ease;
    }
    .logout-btn {
       position: absolute;
       top: 15px;
       right: 15px;
       background: transparent;
       border: 1px solid var(--system-cyan);
       color: var(--system-cyan);
       padding: 4px 12px;
       font-size: 0.75rem;
       font-weight: bold;
       letter-spacing: 1.5px;
       border-radius: 4px;
       cursor: pointer;
       transition: all 0.3s ease;
       text-transform: uppercase;
       z-index: 10;
       box-shadow: 0 0 5px rgba(0, 234, 255, 0.2);
    }
    
    .logout-btn:hover {
       background: rgba(0, 234, 255, 0.1);
       box-shadow: 0 0 10px var(--system-cyan);
       text-shadow: 0 0 5px var(--system-cyan);
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
    
    .info-block {
      flex: 1;
    }

    .info-block h2 {
       margin: 0 0 4px 0;
       font-size: 1.8rem;
       color: #fff;
       letter-spacing: 1px;
    }

    .xp-container {
      margin-bottom: 12px;
      width: 100%;
      max-width: 250px;
    }

    .xp-info {
      display: flex;
      justify-content: flex-start;
      margin-bottom: 4px;
    }

    .xp-label {
      font-family: 'Rajdhani', sans-serif;
      font-size: 0.8rem;
      font-weight: 700;
      color: rgba(0, 234, 255, 0.85);
      letter-spacing: 1.5px;
      text-transform: uppercase;
    }

    .xp-bar-bg {
      width: 100%;
      height: 6px;
      background: rgba(0, 234, 255, 0.1);
      border-radius: 3px;
      overflow: hidden;
      border: 1px solid rgba(0, 234, 255, 0.15);
      position: relative;
    }

    .xp-bar-fill {
      height: 100%;
      background: linear-gradient(90deg, #00c8ff, #0064ff);
      box-shadow: 0 0 10px rgba(0, 234, 255, 0.6);
      border-radius: 3px;
      transition: width 0.8s cubic-bezier(0.4, 0, 0.2, 1);
      transform-origin: left;
      animation: fillProgress 1s ease-out;
    }

    @keyframes fillProgress {
      from { transform: scaleX(0); }
      to { transform: scaleX(1); }
    }

    .xp-remaining {
      font-family: 'Rajdhani', sans-serif;
      font-size: 0.7rem;
      color: rgba(180, 210, 230, 0.45);
      margin-top: 4px;
      letter-spacing: 1px;
      text-transform: uppercase;
      font-weight: 500;
      text-align: left;
    }
    
    .status-msg {
       font-size: 0.9rem;
       font-weight: 600;
       letter-spacing: 1px;
       text-transform: uppercase;
       transition: color 0.3s ease;
       opacity: 0.8;
    }
    
    .stats-grid {
       display: grid;
       grid-template-columns: 1fr 1fr;
       gap: 15px;
       width: 100%;
    }
    @media (max-width: 600px) {
       .stats-grid {
          grid-template-columns: 1fr;
       }
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
    .danger-state .xp-bar-fill {
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
    .boss-state .xp-bar-fill {
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
  authService = inject(AuthService);
  toastService = inject(ToastService);
  router = inject(Router);

  disciplineScore = 85;

  logout() {
    this.authService.logout();
    this.toastService.show('System Disconnected', 'warning');
    this.router.navigate(['/']);
  } 

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
