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
    <div class="hunter-status-card circuit-module" [ngClass]="statusState + '-state'">
      <!-- GRAPHIC LAYERS -->
      <div class="frame-layer base-texture"></div>
      <div class="frame-layer circuit-bloom"></div>
      <div class="frame-layer circuit-paths"></div>
      <div class="frame-layer joint-nodes"></div>
      <div class="frame-layer motherboard-details"></div>

      <!-- MICRO LIGHTNING SPARKS LAYER -->
      <div class="micro-sparks">
        <span class="spark spark-1"></span>
        <span class="spark spark-2"></span>
        <span class="spark spark-3"></span>
        <span class="spark spark-4"></span>
        <span class="spark spark-5"></span>
        <span class="spark spark-6"></span>
        <span class="spark spark-7"></span>
        <span class="spark spark-8"></span>
      </div>

      <!-- Tactical Content -->
      <div class="hud-content">
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
              <div class="xp-bar">
                <div class="xp-fill" [style.width.%]="(state.xp() / state.maxXp()) * 100"></div>
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
    </div>
  `,
  styles: [`
    :host {
      display: block;
      margin-bottom: 40px;
    }

    .circuit-module {
      position: relative;
      background: rgba(4, 9, 24, 0.98);
      padding: 45px;
      min-height: 250px;
      clip-path: polygon(
        0% 20px, 20px 0%, 
        calc(100% - 20px) 0%, 100% 20px,
        100% calc(100% - 20px), calc(100% - 20px) 100%,
        20px 100%, 0% calc(100% - 20px)
      );
    }

    .frame-layer {
      position: absolute;
      inset: 0;
      pointer-events: none;
    }

    .base-texture {
      background-image: 
        linear-gradient(rgba(0, 150, 255, 0.04) 1px, transparent 1px),
        linear-gradient(90deg, rgba(0, 150, 255, 0.04) 1px, transparent 1px);
      background-size: 25px 25px;
      z-index: 1;
    }

    .base-texture::before {
      content: "";
      position: absolute;
      inset: 0;
      background: repeating-linear-gradient(0deg, transparent, transparent 1px, rgba(0, 30, 80, 0.1) 3px);
    }

    .circuit-paths {
      z-index: 3;
      background-image: url("data:image/svg+xml,%3Csvg width='100%25' height='100%25' viewBox='0 0 800 400' preserveAspectRatio='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M20 60 L80 60 L80 40 L120 40 L120 20 L300 20 M500 20 L680 20 L680 40 L720 40 L720 60 L780 60 M20 340 L120 340 L120 360 L160 360 L160 380 L640 380 L640 360 L680 360 L680 340 L780 340' stroke='%234fd1ff' stroke-width='2' fill='none'/%3E%3Cpath d='M10 80 L10 160 L30 160 L30 240 L10 240 M790 80 L790 160 L770 160 L770 240 L790 240' stroke='rgba(79, 209, 255, 0.6)' stroke-width='1.2' fill='none'/%3E%3Cpath d='M40 30 L50 30 L50 40 M60 20 L60 35' stroke='rgba(255,255,255,0.4)' stroke-width='0.8' fill='none'/%3E%3Crect x='740' y='360' width='20' height='10' fill='rgba(79, 209, 255, 0.2)'/%3E%3Cpath d='M730 375 L760 375' stroke='rgba(79, 209, 255, 0.5)' stroke-width='0.5'/%3E%3C/svg%3E");
      background-repeat: no-repeat;
      background-size: 100% 100%;
    }

    .circuit-bloom {
      z-index: 2;
      background-image: url("data:image/svg+xml,%3Csvg width='100%25' height='100%25' viewBox='0 0 800 400' preserveAspectRatio='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='glow'%3E%3CfeGaussianBlur stdDeviation='3' result='blur'/%3E%3C/filter%3E%3Cpath d='M20 60 L80 60 L80 40 L120 40 L120 20 L300 20 M500 20 L680 20 L680 40 L720 40 L720 60 L780 60 M20 340 L120 340 L120 360 L160 360 L160 380 L640 380 L640 360 L680 360 L680 340 L780 340' stroke='%234fd1ff' stroke-width='5' fill='none' filter='url(%23glow)' opacity='0.3'/%3E%3C/svg%3E");
      background-repeat: no-repeat;
      background-size: 100% 100%;
    }

    .joint-nodes {
      z-index: 4;
      background-image: url("data:image/svg+xml,%3Csvg width='100%25' height='100%25' viewBox='0 0 800 400' preserveAspectRatio='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23fff' opacity='0.9'%3E%3Ccircle cx='80' cy='60' r='2'/%3E%3Ccircle cx='120' cy='40' r='2'/%3E%3Ccircle cx='680' cy='40' r='2'/%3E%3Ccircle cx='720' cy='60' r='2'/%3E%3Ccircle cx='120' cy='340' r='2'/%3E%3Ccircle cx='160' cy='360' r='2'/%3E%3Ccircle cx='640' cy='360' r='2'/%3E%3Ccircle cx='680' cy='340' r='2'/%3E%3C/g%3E%3C/svg%3E");
      background-size: 100% 100%;
    }

    .motherboard-details {
      z-index: 5;
      background-image: url("data:image/svg+xml,%3Csvg width='100%25' height='100%25' viewBox='0 0 800 400' preserveAspectRatio='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cg opacity='0.7'%3E%3Crect x='350' y='15' width='100' height='10' fill='%234fd1ff' opacity='0.1'/%3E%3Cpath d='M355 20 L445 20' stroke='%234fd1ff' stroke-width='0.5'/%3E%3Crect x='380' y='375' width='40' height='5' fill='%234fd1ff' opacity='0.3'/%3E%3C/g%3E%3C/svg%3E");
      background-repeat: no-repeat;
      background-size: 100% 100%;
    }

    /* MICRO LIGHTNING SPARKS */
    .micro-sparks {
      position: absolute;
      inset: 0;
      pointer-events: none;
      z-index: 10;
    }

    .spark {
      position: absolute;
      background: #00f0ff;
      box-shadow: 0 0 6px #00f0ff, 0 0 12px #00f0ff, 0 0 20px #00f0ff;
      opacity: 0;
    }

    /* Top straight edge */
    .spark-1 {
      top: -2px; left: 30%;
      width: 12px; height: 1.5px;
      clip-path: polygon(0 40%, 25% 0, 50% 80%, 75% 10%, 100% 50%, 75% 90%, 50% 20%, 25% 100%);
      animation: flick 3s infinite 0.2s;
    }

    /* Bottom straight edge */
    .spark-2 {
      bottom: -2px; right: 25%;
      width: 15px; height: 1.5px;
      clip-path: polygon(0 60%, 30% 0, 45% 100%, 75% 20%, 100% 60%, 75% 100%, 45% 0, 30% 100%);
      animation: flick 4s infinite 1.5s;
    }

    /* Left straight edge */
    .spark-3 {
      left: -2px; top: 40%;
      height: 10px; width: 1.5px;
      clip-path: polygon(40% 0, 100% 25%, 0 50%, 90% 75%, 50% 100%, 10% 75%, 100% 50%, 0 25%);
      animation: flick 2.5s infinite 2.3s;
    }

    /* Right straight edge */
    .spark-4 {
      right: -2px; bottom: 35%;
      height: 14px; width: 1.5px;
      clip-path: polygon(60% 0, 100% 30%, 20% 50%, 100% 70%, 40% 100%, 0 70%, 80% 50%, 0 30%);
      animation: flick 3.8s infinite 0.7s;
    }

    /* Extra scattered micro sparks */
    .spark-5 {
      top: -2px; right: 35%;
      width: 8px; height: 1px;
      clip-path: polygon(0 50%, 50% 0, 100% 50%, 50% 100%);
      animation: flick 1.8s infinite 3.1s;
    }

    .spark-6 {
      bottom: -2px; left: 40%;
      width: 10px; height: 1px;
      clip-path: polygon(0 30%, 50% 0, 100% 70%, 50% 100%);
      animation: flick 4.2s infinite 0.9s;
    }

    .spark-7 {
      left: -2px; bottom: 25%;
      height: 8px; width: 1px;
      clip-path: polygon(30% 0, 100% 50%, 70% 100%, 0 50%);
      animation: flick 2.9s infinite 4.5s;
    }

    .spark-8 {
      right: -2px; top: 25%;
      height: 12px; width: 1px;
      clip-path: polygon(50% 0, 100% 40%, 30% 60%, 100% 80%, 50% 100%, 0 80%, 70% 60%, 0 40%);
      animation: flick 3.3s infinite 1.8s;
    }

    @keyframes flick {
      0%, 95% { opacity: 0; transform: scale(0.5); }
      96% { opacity: 1; transform: scale(1.3); } /* Bright flash */
      97% { opacity: 0.3; transform: scale(0.9); } /* Dim stutter */
      98% { opacity: 0.9; transform: scale(1.1); } /* Secondary flash */
      99%, 100% { opacity: 0; transform: scale(0.5); }
    }

    /* CONTENT DISPLAY LAYER */
    .hud-content {
      position: relative;
      z-index: 15;
    }

    .logout-btn {
       position: absolute;
       top: 10px;
       right: 10px;
       background: transparent;
       border: 1px solid rgba(0, 234, 255, 0.4);
       color: #00eaff;
       padding: 5px 12px;
       font-size: 0.75rem;
       font-weight: 800;
       letter-spacing: 1.5px;
       cursor: pointer;
       text-transform: uppercase;
       transition: all 0.3s ease;
    }

    .status-header {
      display: flex;
      align-items: center;
      gap: 30px;
      margin-bottom: 30px;
    }

    .rank-badge {
      width: 90px;
      height: 90px;
      border: 3px solid #4fd1ff;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      background: rgba(0, 234, 255, 0.05);
      box-shadow: 0 0 25px rgba(0, 234, 255, 0.2);
    }

    .info-block h2 {
      margin: 0;
      font-size: 2.5rem;
      font-weight: 900;
      color: #fff;
      letter-spacing: 4px;
      text-shadow: 0 0 15px rgba(0, 234, 255, 0.4);
    }

    .xp-fill {
      height: 100%;
      background: linear-gradient(90deg, #00eaff, #007bff);
      box-shadow: 0 0 15px #00eaff;
    }

    .status-msg {
      font-size: 1.1rem;
      font-weight: 900;
      color: #00eaff;
      letter-spacing: 3px;
    }

    .stats-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 25px;
    }

    @media (max-width: 600px) {
      .stats-grid { grid-template-columns: 1fr; }
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
      case 'boss': return '🛡 SUPPRESSION MODE: ACTIVE';
      case 'danger': return '⚡ STABILITY: CRITICAL';
      case 'stable': default: return '💠 STATUS: OPERATIONAL';
    }
  }
}
