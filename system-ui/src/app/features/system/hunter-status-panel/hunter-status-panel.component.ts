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
    <!-- Holographic UI Background Layers -->
    <div class="holo-bg-layer">
    <!-- 1. Glass Base -->
    <div class="glass-base"></div>
    
    <!-- 2. Holographic Grid -->
    <div class="holo-grid"></div>
    
    <!-- 3. Energy Flow Trails -->
    <div class="ambient-energy-flow">
      <svg viewBox="0 0 800 300" preserveAspectRatio="none">
      <path d="M -50 150 C 150 50, 250 250, 450 150 S 700 250, 850 150" class="flow-path path-alpha"></path>
      <path d="M -50 200 C 200 280, 500 100, 850 200" class="flow-path path-beta"></path>
      </svg>
    </div>

    <!-- 4. Light Refraction Layer -->
    <div class="refraction-bands">
      <div class="band band-alpha"></div>
      <div class="band band-beta"></div>
    </div>

    <!-- 5. Particle Mist -->
    <div class="particle-mist">
      <div class="mist-orb" style="left: 10%; top: 20%; animation-delay: 0s;"></div>
      <div class="mist-orb" style="left: 60%; top: 70%; animation-delay: -7s; width: 250px; height: 250px;"></div>
      <div class="mist-orb" style="left: 35%; top: 60%; animation-delay: -3s; width: 180px; height: 180px;"></div>
    </div>

    <!-- 6. Radar Support Glow -->
    <div class="radar-ambient-glow"></div>

    <!-- 7. Scan Pulse -->
    <div class="scan-pulse"></div>

    <!-- 8. Edge Illumination -->
    <div class="edge-rim-light"></div>
    </div>

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
  styleUrls: ['./hunter-status-panel.component.scss']
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
  radarSurgeActive = signal(false);
  destroyRef = inject(DestroyRef);

  readonly statNames = ['STRENGTH', 'INTELLIGENCE', 'DISCIPLINE', 'CONSISTENCY'];
  private readonly statKeys = ['strength', 'intelligence', 'discipline', 'consistency'] as const;

  private readonly cx = 150;
  private readonly cy = 150;
  private readonly maxR = 120;

  readonly axes = [
  { angle: -90,  label: 'STR', outerX: 150, outerY: 30,  labelX: 150, labelY: 12  },
  { angle: 0,  label: 'INT', outerX: 270, outerY: 150, labelX: 290, labelY: 150 },
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
  this.state.levelUp$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => {
    this.radarSurgeActive.set(true);
    setTimeout(() => this.radarSurgeActive.set(false), 800);
  });
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
