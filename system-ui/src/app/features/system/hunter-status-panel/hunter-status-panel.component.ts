import { Component, inject, computed, signal, AfterViewInit, DestroyRef } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { ToastService } from '../../../shared/services/toast.service';
import { SystemStateService } from '../../../shared/services/system-state.service';
import { BossService } from '../../../core/services/boss.service';
import { XpEngineService } from '../../../core/services/xp-engine.service';
import { XpProgressRingComponent } from './xp-progress-ring.component';

@Component({
  selector: 'app-hunter-status-panel',
  standalone: true,
  imports: [CommonModule, XpProgressRingComponent],
  template: `
    <div class="hunter-status-card holographic-panel" [ngClass]="statusState + '-state'">
      <!-- Moving Particle Layer -->
      <div class="particle-field">
        <div class="particle" style="left: 10%; animation-delay: 0s;"></div>
        <div class="particle" style="left: 30%; animation-delay: 1.5s;"></div>
        <div class="particle" style="left: 55%; animation-delay: 0.5s;"></div>
        <div class="particle" style="left: 80%; animation-delay: 2.2s;"></div>
        <div class="particle" style="left: 15%; animation-delay: 3s;"></div>
        <div class="particle" style="left: 45%; animation-delay: 0.8s;"></div>
      </div>

      <!-- Animated Energy Background SVG -->
      <svg class="energy-background" viewBox="0 0 800 300" preserveAspectRatio="none">
        <path d="M-50,150 L100,80 L250,220 L400,100 L550,260 L700,40 L850,150" class="energy-path" style="stroke-dasharray: 100 200;"></path>
        <path d="M-50,250 L150,280 L300,50 L450,250 L650,100 L850,250" class="energy-path" style="stroke-dasharray: 150 250;"></path>
        <path d="M-50,40 L200,150 L400,30 L600,180 L850,80" class="energy-path" style="stroke-dasharray: 50 150;"></path>
      </svg>

      <!-- Tactical Content Hub -->
      <div class="hud-content">
        <div class="hud-main-layout">
          <!-- LEFT COLUMN: Hunter Info -->
          <div class="info-column">
            <div class="hud-top-row">
              <div class="rank-badge-tactical">
                <span class="rank-letter">{{ state.rank() }}</span>
                <span class="rank-label">CLASS</span>
              </div>
              <app-xp-progress-ring
                [level]="state.level()"
                [currentXp]="state.xp()"
                [maxXp]="state.maxXp()">
              </app-xp-progress-ring>
              <div class="info-primary">
                <div class="status-indicator">
                  <span class="status-text">{{ getStatusMessage() }}</span>
                </div>
              </div>
            </div>
            <button class="logout-btn-tactical" (click)="logout()">LOGOUT</button>
          </div>

          <!-- RIGHT COLUMN: System Core Radar Chart -->
          <div class="system-core-container">
            <div class="core-title">SYSTEM CORE</div>
            <div class="radar-wrapper" [class.radar-active]="radarReady()" [class.radar-surge]="radarSurgeActive()">
              <svg class="radar-svg" viewBox="0 0 300 300">
                <!-- Definitions: Glow Filters & Gradients -->
                <defs>
                  <filter id="radarGlow" x="-50%" y="-50%" width="200%" height="200%">
                    <feGaussianBlur in="SourceGraphic" stdDeviation="4" result="blur" />
                    <feComposite in="SourceGraphic" in2="blur" operator="over" />
                  </filter>
                  <filter id="coreGlow" x="-50%" y="-50%" width="200%" height="200%">
                    <feGaussianBlur in="SourceGraphic" stdDeviation="6" result="blur" />
                    <feComposite in="SourceGraphic" in2="blur" operator="over" />
                  </filter>
                  <filter id="vertexGlow" x="-50%" y="-50%" width="200%" height="200%">
                    <feGaussianBlur in="SourceGraphic" stdDeviation="3" result="blur" />
                    <feComposite in="SourceGraphic" in2="blur" operator="over" />
                  </filter>
                  <radialGradient id="energyFill" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stop-color="rgba(0, 234, 255, 0.25)" />
                    <stop offset="100%" stop-color="rgba(47, 123, 255, 0.08)" />
                  </radialGradient>
                  <radialGradient id="corePulseGrad" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stop-color="#00eaff" stop-opacity="0.9" />
                    <stop offset="50%" stop-color="#2f7bff" stop-opacity="0.4" />
                    <stop offset="100%" stop-color="transparent" stop-opacity="0" />
                  </radialGradient>
                  <clipPath id="polygonClip">
                    <polygon [attr.points]="radarPoints()" />
                  </clipPath>
                </defs>

                <!-- Rotating Scanner Ring -->
                <circle cx="150" cy="150" r="130" class="scanner-ring" />

                <!-- Concentric Guide Rings -->
                <circle cx="150" cy="150" r="30" class="ring-guide" />
                <circle cx="150" cy="150" r="60" class="ring-guide" />
                <circle cx="150" cy="150" r="90" class="ring-guide" />
                <circle cx="150" cy="150" r="120" class="ring-guide" />

                <!-- Axis Lines -->
                <line *ngFor="let axis of axes" [attr.x1]="150" [attr.y1]="150"
                  [attr.x2]="axis.outerX" [attr.y2]="axis.outerY" class="axis-line" />

                <!-- Energy Flow Layer (clipped to polygon) -->
                <g clip-path="url(#polygonClip)">
                  <rect x="0" y="0" width="300" height="300" fill="url(#energyFill)" />
                  <line x1="0" y1="0" x2="300" y2="300" class="energy-flow-line ef-1" />
                  <line x1="300" y1="0" x2="0" y2="300" class="energy-flow-line ef-2" />
                  <line x1="150" y1="0" x2="150" y2="300" class="energy-flow-line ef-3" />
                  <line x1="0" y1="150" x2="300" y2="150" class="energy-flow-line ef-4" />
                </g>

                <!-- Main Radar Polygon -->
                <polygon [attr.points]="radarPoints()" class="radar-polygon" filter="url(#radarGlow)" />
                <polygon [attr.points]="radarPoints()" class="radar-polygon-edge" />

                <!-- Scanline Sweep -->
                <rect x="148" y="20" width="4" height="260" class="radar-scanline" />

                <!-- Vertex Dots + Hover Zones -->
                <g *ngFor="let v of vertexData(); let i = index">
                  <circle [attr.cx]="v.x" [attr.cy]="v.y" r="5" class="stat-vertex"
                    [class.vertex-hovered]="hoveredStat() === i" filter="url(#vertexGlow)"
                    (mouseenter)="hoveredStat.set(i)" (mouseleave)="hoveredStat.set(-1)" />
                  <circle [attr.cx]="v.x" [attr.cy]="v.y" r="18" fill="transparent"
                    (mouseenter)="hoveredStat.set(i)" (mouseleave)="hoveredStat.set(-1)" style="cursor: pointer;" />
                </g>

                <!-- Pulsing Central Core Node -->
                <circle cx="150" cy="150" r="14" class="core-pulse-ring" />
                <circle cx="150" cy="150" r="6" class="core-node" filter="url(#coreGlow)" />
                <circle cx="150" cy="150" r="2.5" class="core-dot" />

                <!-- Axis Labels -->
                <text *ngFor="let axis of axes; let i = index"
                  [attr.x]="axis.labelX" [attr.y]="axis.labelY"
                  class="vertex-label" [class.label-hovered]="hoveredStat() === i"
                  text-anchor="middle" dominant-baseline="middle">
                  {{ axis.label }}
                </text>
              </svg>

              <!-- Hover Tooltip -->
              <div class="radar-tooltip" *ngIf="hoveredStat() >= 0"
                [style.left.px]="tooltipPos().x" [style.top.px]="tooltipPos().y">
                <span class="tooltip-label">{{ statNames[hoveredStat()] }}</span>
                <span class="tooltip-value">{{ statValues()[hoveredStat()] }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: block;
      margin-bottom: 40px;
      font-family: 'Rajdhani', sans-serif;
      background: transparent !important;
    }

    .hunter-status-card {
      isolation: isolate;
      position: relative;
      padding: 32px 40px;
      min-height: 250px;
      border-radius: 8px;
      overflow: visible !important; /* Allow tooltip to escape card bounds */
    }
    .hunter-status-card::before, .hunter-status-card::after {
      content: "";
      position: absolute;
      inset: 0;
      pointer-events: none;
      z-index: 20;
    }
    .hunter-status-card::before {
      border-top: 1px solid rgba(0, 234, 255, 0.6);
      border-bottom: 1px solid rgba(0, 234, 255, 0.6);
      margin: 0 10%;
    }
    .hunter-status-card::after {
      border-right: 1px solid rgba(0, 234, 255, 0.6);
      border-left: 1px solid rgba(0, 234, 255, 0.6);
      margin: 5% 0;
    }

    .hud-content {
      position: relative;
      z-index: 25; /* Above card pseudo-elements (z-index: 20) */
      background: transparent;
    }

    /* Clip decorative layers to card bounds while allowing tooltip to escape */
    .hunter-status-card > .particle-field,
    .hunter-status-card > .energy-background {
      overflow: hidden;
      border-radius: 8px;
    }

    /* ===== MAIN TWO-COLUMN LAYOUT ===== */
    .hud-main-layout {
      display: flex;
      align-items: stretch;
      gap: 40px;
    }
    .info-column {
      flex: 1;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      min-width: 0;
    }
    .hud-top-row {
      display: flex;
      align-items: center;
      gap: 24px;
      margin-bottom: 24px;
    }
    .info-primary { flex: 1; }
    .rank-badge-tactical {
      width: 90px;
      height: 90px;
      border: 1px solid #00eaff;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      background: rgba(0, 234, 255, 0.05);
      flex-shrink: 0;
    }
    .rank-label {
      font-size: 0.65rem;
      letter-spacing: 2px;
      color: rgba(255,255,255,0.7);
    }
    .rank-letter {
      font-size: 2.8rem;
      font-weight: 900;
      color: #fff;
      text-shadow: 0 0 15px #00eaff;
    }
    /* Level display and XP info now handled by XpProgressRingComponent */
    .status-indicator {
      display: flex;
      align-items: center;
      gap: 10px;
      color: #00eaff;
      font-weight: 800;
      letter-spacing: 2px;
      text-transform: uppercase;
      font-size: 1rem;
    }
    .logout-btn-tactical {
      background: transparent;
      border: 1px solid #00eaff;
      color: #00eaff;
      padding: 8px 18px;
      font-weight: 900;
      letter-spacing: 2px;
      cursor: pointer;
      transition: all 0.3s;
      align-self: flex-start;
      font-family: 'Rajdhani', sans-serif;
      font-size: 0.85rem;
    }
    .logout-btn-tactical:hover {
      background: rgba(0, 234, 255, 0.1);
      box-shadow: 0 0 15px #00eaff;
    }

    /* ===== SYSTEM CORE RADAR CHART ===== */
    .system-core-container {
      flex-shrink: 0;
      width: 280px;
      display: flex;
      flex-direction: column;
      align-items: center;
      position: relative;
    }
    .core-title {
      font-family: 'Orbitron', sans-serif;
      font-size: 0.65rem;
      font-weight: 800;
      letter-spacing: 4px;
      color: rgba(0, 234, 255, 0.45);
      margin-bottom: 8px;
      text-align: center;
    }
    .radar-wrapper {
      position: relative;
      width: 280px;
      height: 280px;
    }
    .radar-svg {
      width: 100%;
      height: 100%;
      overflow: visible;
    }

    /* Guide Rings */
    .ring-guide {
      fill: none;
      stroke: rgba(0, 234, 255, 0.08);
      stroke-width: 0.8;
    }
    /* Axis Lines */
    .axis-line {
      stroke: rgba(0, 234, 255, 0.12);
      stroke-width: 0.8;
      stroke-dasharray: 4 3;
    }
    /* Scanner Ring */
    .scanner-ring {
      fill: none;
      stroke: rgba(0, 234, 255, 0.1);
      stroke-width: 1;
      stroke-dasharray: 12 8 4 8;
      animation: rotateScan 20s linear infinite;
      transform-origin: 150px 150px;
    }
    @keyframes rotateScan {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }

    /* Energy Flow Lines (inside polygon clip) */
    .energy-flow-line {
      stroke: rgba(0, 234, 255, 0.06);
      stroke-width: 1;
      stroke-dasharray: 6 12;
    }
    .ef-1 { animation: energyDash 4s linear infinite; }
    .ef-2 { animation: energyDash 5s linear infinite reverse; }
    .ef-3 { animation: energyDash 3.5s linear infinite; }
    .ef-4 { animation: energyDash 4.5s linear infinite reverse; }
    @keyframes energyDash {
      from { stroke-dashoffset: 0; }
      to { stroke-dashoffset: 36; }
    }

    /* Radar Polygon */
    .radar-polygon {
      fill: url(#energyFill);
      stroke: none;
      opacity: 0;
      transition: opacity 0.6s ease;
    }
    .radar-polygon-edge {
      fill: none;
      stroke: #00eaff;
      stroke-width: 1.5;
      stroke-linejoin: round;
      opacity: 0;
      filter: drop-shadow(0 0 4px rgba(0, 234, 255, 0.6));
      transition: opacity 0.6s ease;
      animation: edgePulse 3s ease-in-out infinite;
    }
    .radar-active .radar-polygon { opacity: 1; }
    .radar-active .radar-polygon-edge { opacity: 1; }
    @keyframes edgePulse {
      0%, 100% { stroke-opacity: 0.8; filter: drop-shadow(0 0 4px rgba(0, 234, 255, 0.6)); }
      50% { stroke-opacity: 1; filter: drop-shadow(0 0 8px rgba(0, 234, 255, 0.9)); }
    }

    /* Stat Vertices */
    .stat-vertex {
      fill: #00eaff;
      opacity: 0.8;
      transition: all 0.3s ease;
    }
    .stat-vertex.vertex-hovered {
      fill: #fff;
      opacity: 1;
    }

    /* Core Node */
    .core-pulse-ring {
      fill: none;
      stroke: rgba(0, 234, 255, 0.3);
      stroke-width: 1.5;
      animation: corePulse 2.5s ease-in-out infinite;
    }
    .core-node {
      fill: #00eaff;
      opacity: 0.9;
      animation: coreGlow 2.5s ease-in-out infinite;
    }
    .core-dot { fill: #ffffff; }
    @keyframes corePulse {
      0%, 100% { stroke-opacity: 0.3; stroke: rgba(0, 234, 255, 0.3); }
      50% { stroke-opacity: 0.6; stroke: rgba(0, 234, 255, 0.6); }
    }
    @keyframes coreGlow {
      0%, 100% { opacity: 0.7; }
      50% { opacity: 1; }
    }

    /* Vertex Labels */
    .vertex-label {
      font-family: 'Orbitron', sans-serif;
      font-size: 9px;
      font-weight: 700;
      fill: rgba(0, 234, 255, 0.5);
      letter-spacing: 2px;
      transition: all 0.3s ease;
    }
    .vertex-label.label-hovered {
      fill: #00eaff;
      font-size: 10px;
      filter: drop-shadow(0 0 4px rgba(0, 234, 255, 0.6));
    }

    /* Scanline Sweep */
    .radar-scanline {
      fill: rgba(0, 234, 255, 0.06);
      animation: scanSweep 5s linear infinite;
      transform-origin: 150px 150px;
    }
    @keyframes scanSweep {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }

    /* Tooltip */
    .radar-tooltip {
      position: absolute;
      background: rgba(2, 8, 20, 0.92);
      border: 1px solid rgba(0, 234, 255, 0.5);
      border-radius: 4px;
      padding: 6px 12px;
      pointer-events: none;
      transform: translate(-50%, -120%);
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 2px;
      box-shadow: 0 0 12px rgba(0, 234, 255, 0.25);
      backdrop-filter: blur(8px);
      z-index: 30;
    }
    .tooltip-label {
      font-family: 'Orbitron', sans-serif;
      font-size: 0.55rem;
      font-weight: 700;
      color: rgba(0, 234, 255, 0.7);
      letter-spacing: 2px;
    }
    .tooltip-value {
      font-family: 'Rajdhani', sans-serif;
      font-size: 1.3rem;
      font-weight: 900;
      color: #fff;
      text-shadow: 0 0 8px rgba(0, 234, 255, 0.5);
    }

    /* Responsive */
    @media (max-width: 900px) {
      .hud-main-layout { flex-direction: column; align-items: center; }
      .system-core-container { width: 240px; }
      .radar-wrapper { width: 240px; height: 240px; }
    }
    @media (max-width: 600px) {
      .system-core-container { width: 200px; }
      .radar-wrapper { width: 200px; height: 200px; }
      .hunter-status-card { padding: 24px 20px; }
      .hud-top-row {
        flex-direction: column;
        align-items: center;
        text-align: center;
      }
    }
  `]
})
export class HunterStatusPanelComponent implements AfterViewInit {
  state = inject(SystemStateService);
  bossService = inject(BossService);
  xpEngine = inject(XpEngineService);
  authService = inject(AuthService);
  toastService = inject(ToastService);
  router = inject(Router);

  hoveredStat = signal(-1);
  radarReady = signal(false);

  readonly statNames = ['STRENGTH', 'INTELLIGENCE', 'DISCIPLINE', 'CONSISTENCY'];
  private readonly statKeys = ['strength', 'intelligence', 'discipline', 'consistency'] as const;

  private readonly cx = 150;
  private readonly cy = 150;
  private readonly maxR = 120;

  readonly axes = [
    { angle: -90,  label: 'STR', outerX: 150, outerY: 30,  labelX: 150, labelY: 12  },
    { angle: 0,    label: 'INT', outerX: 270, outerY: 150, labelX: 290, labelY: 150 },
    { angle: 90,   label: 'DSC', outerX: 150, outerY: 270, labelX: 150, labelY: 292 },
    { angle: 180,  label: 'CON', outerX: 30,  outerY: 150, labelX: 10,  labelY: 150 }
  ];

  statValues = computed(() => {
    const a = this.state.attributes();
    return [a.strength, a.intelligence, a.discipline, a.consistency];
  });

  vertexData = computed(() => {
    const vals = this.statValues();
    return vals.map((val, i) => {
      const coords = this.getVertexPos(val, i);
      return { x: coords.x, y: coords.y, value: val };
    });
  });

  radarPoints = computed(() => {
    if (!this.radarReady()) {
      return this.statValues().map(() => `${this.cx},${this.cy}`).join(' ');
    }
    return this.vertexData().map(v => `${v.x},${v.y}`).join(' ');
  });

  tooltipPos = computed(() => {
    const idx = this.hoveredStat();
    if (idx < 0) return { x: 0, y: 0 };
    const v = this.vertexData()[idx];
    const scale = 280 / 300;
    return { x: v.x * scale, y: v.y * scale };
  });

  ngAfterViewInit() {
    setTimeout(() => this.radarReady.set(true), 150);
  }

  private getVertexPos(value: number, axisIndex: number): { x: number; y: number } {
    const angleDeg = this.axes[axisIndex].angle;
    const angleRad = (angleDeg * Math.PI) / 180;
    const r = (Math.min(100, Math.max(0, value)) / 100) * this.maxR;
    return {
      x: Math.round((this.cx + r * Math.cos(angleRad)) * 100) / 100,
      y: Math.round((this.cy + r * Math.sin(angleRad)) * 100) / 100
    };
  }

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
      case 'boss': return 'SUPPRESSION MODE: ACTIVE';
      case 'danger': return 'STABILITY: CRITICAL';
      case 'stable': default: return 'STATUS: OPERATIONAL';
    }
  }
}
