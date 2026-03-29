import {
  Component, Input, OnChanges, SimpleChanges, OnInit, OnDestroy,
  signal, computed, ChangeDetectionStrategy
} from '@angular/core';
import { CommonModule } from '@angular/common';

interface XpEvent {
  delta: number;
  time: number;
}

const STORAGE_KEY = 'xp_ring_events';
const EVENT_EXPIRY_MS = 30 * 60 * 1000; // 30 minutes

@Component({
  selector: 'app-xp-progress-ring',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="level-up-screen-pulse" *ngIf="levelUpActive()"></div>
    <div class="xp-ring-container"
         (mouseenter)="isHovered.set(true)"
         (mouseleave)="isHovered.set(false)"
         [class.xp-surge]="surgeActive()"
         [class.level-up-flash]="levelUpActive()"
         [class.milestone-pulse]="milestoneActive()">

      <svg class="xp-ring-svg" viewBox="0 0 200 200">
        <defs>
          <filter id="xpRingGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="3.5" result="blur1" />
            <feGaussianBlur in="SourceGraphic" stdDeviation="1" result="blur2" />
            <feMerge>
              <feMergeNode in="blur1" />
              <feMergeNode in="blur2" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          <filter id="xpSurgeGlow" x="-80%" y="-80%" width="260%" height="260%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="6" result="bloom" />
            <feMerge>
              <feMergeNode in="bloom" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          <filter id="scannerGlow" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="1.5" />
          </filter>

          <filter id="levelUpBloom" x="-100%" y="-100%" width="300%" height="300%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="10" result="megaBloom" />
            <feMerge>
              <feMergeNode in="megaBloom" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          <linearGradient id="arcGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#00eaff" />
            <stop offset="50%" stop-color="#2f7bff" />
            <stop offset="100%" stop-color="#00eaff" />
          </linearGradient>

          <radialGradient id="innerGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stop-color="rgba(0, 234, 255, 0.08)" />
            <stop offset="60%" stop-color="rgba(47, 123, 255, 0.03)" />
            <stop offset="100%" stop-color="transparent" />
          </radialGradient>

          <radialGradient id="milestoneBurst" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stop-color="rgba(0, 234, 255, 0.4)" />
            <stop offset="100%" stop-color="transparent" />
          </radialGradient>
        </defs>

        <circle cx="100" cy="100" r="70" fill="url(#innerGlow)" />

        <circle cx="100" cy="100" r="78"
          fill="none"
          stroke="rgba(0, 234, 255, 0.06)"
          stroke-width="6"
          stroke-linecap="round" />

        <g class="notch-group">
          <line *ngFor="let notch of notches; let i = index"
            [attr.x1]="notch.x1" [attr.y1]="notch.y1"
            [attr.x2]="notch.x2" [attr.y2]="notch.y2"
            [class]="getNotchClass(i)"
            [class.notch-flicker]="isActiveEdgeNotch(i)"
            [class.notch-milestone]="isMilestoneNotch(i)"
            stroke-width="2"
            stroke-linecap="round" />
        </g>

        <circle cx="100" cy="100" r="78"
          class="progress-arc"
          [class.arc-surge]="surgeActive()"
          fill="none"
          stroke="url(#arcGradient)"
          stroke-width="5"
          stroke-linecap="round"
          [attr.stroke-dasharray]="circumference"
          [attr.stroke-dashoffset]="currentDashoffset()"
          [attr.filter]="surgeActive() ? 'url(#xpSurgeGlow)' : 'url(#xpRingGlow)'"
          transform="rotate(-90 100 100)" />

        <circle cx="100" cy="100" r="78"
          class="progress-arc-tip"
          fill="none"
          stroke="#ffffff"
          stroke-width="3"
          stroke-linecap="round"
          [attr.stroke-dasharray]="tipDasharray"
          [attr.stroke-dashoffset]="currentDashoffset()"
          filter="url(#xpRingGlow)"
          transform="rotate(-90 100 100)" />

        <circle cx="100" cy="100" r="88"
          class="scanner-ring-xp"
          fill="none"
          stroke="rgba(0, 234, 255, 0.12)"
          stroke-width="0.8"
          stroke-dasharray="8 6 3 6"
          filter="url(#scannerGlow)" />

        <circle cx="100" cy="100" r="68"
          class="scanner-ring-inner"
          fill="none"
          stroke="rgba(0, 234, 255, 0.06)"
          stroke-width="0.5"
          stroke-dasharray="4 8" />

        <circle *ngFor="let p of particles"
          [attr.cx]="p.cx" [attr.cy]="p.cy" [attr.r]="p.r"
          class="energy-particle"
          [style.animation-delay]="p.delay"
          [style.animation-duration]="p.duration"
          fill="#00eaff" />

        <g *ngIf="levelUpActive()" class="level-up-burst">
          <circle *ngFor="let p of levelUpParticles" [attr.cx]="p.cx" [attr.cy]="p.cy" [style.--tx]="p.tx" [style.--ty]="p.ty" [style.animation-delay]="p.delay" class="burst-particle" fill="#00eaff" [attr.r]="p.r" />
        </g>

        <circle r="2.5" class="energy-streak" fill="#ffffff">
          <animateMotion
            dur="4s"
            repeatCount="indefinite"
            [attr.path]="streakPath"
            rotate="auto" />
        </circle>

        <g *ngFor="let m of milestoneMarkers">
          <circle [attr.cx]="m.x" [attr.cy]="m.y" r="4"
            class="milestone-ring"
            [class.milestone-reached]="m.reached"
            fill="none"
            [attr.stroke]="m.reached ? '#00eaff' : 'rgba(0, 234, 255, 0.15)'"
            stroke-width="1" />
          <circle [attr.cx]="m.x" [attr.cy]="m.y" r="1.5"
            [attr.fill]="m.reached ? '#00eaff' : 'rgba(0, 234, 255, 0.1)'"
            [class.milestone-dot-glow]="m.reached" />
        </g>

        <circle *ngIf="levelUpActive()" cx="100" cy="100" r="92"
          class="level-up-ring"
          fill="none"
          stroke="#ffffff"
          stroke-width="4"
          filter="url(#levelUpBloom)" />

        <text x="100" y="90" text-anchor="middle"
          class="level-label-text">LVL</text>
        <text x="100" y="115" text-anchor="middle"
          class="level-number-text">{{ level }}</text>
      </svg>

      <div class="xp-tooltip" *ngIf="isHovered()">
        <div class="tooltip-scanline"></div>
        <div class="tooltip-content">
          <div class="tooltip-row">
            <span class="tooltip-key">XP</span>
            <span class="tooltip-val holo-text">{{ currentXp }} / {{ maxXp }}</span>
          </div>
          <div class="tooltip-row">
            <span class="tooltip-key">PROGRESS</span>
            <span class="tooltip-val holo-text">{{ progressPercent() }}%</span>
          </div>
          <div class="tooltip-row">
            <span class="tooltip-key">ETA</span>
            <span class="tooltip-val holo-text">{{ etaDisplay() }}</span>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: block;
      flex-shrink: 0;
      overflow: visible;
      position: relative;
      z-index: 1;
    }

    .xp-ring-container {
      position: relative;
      width: 180px;
      height: 180px;
      flex-shrink: 0;
    }

    .xp-ring-svg {
      width: 100%;
      height: 100%;
      overflow: visible;
    }

    .progress-arc {
      transition: stroke-dashoffset 1.2s cubic-bezier(0.22, 1, 0.36, 1);
      animation: arcPulseGlow 3s ease-in-out infinite;
    }
    .progress-arc.arc-surge {
      animation: surgeBurst 0.5s ease-out;
    }
    .progress-arc-tip {
      transition: stroke-dashoffset 1.2s cubic-bezier(0.22, 1, 0.36, 1);
      opacity: 0.7;
    }

    @keyframes arcPulseGlow {
      0%, 100% { filter: url(#xpRingGlow); opacity: 0.9; }
      50% { filter: url(#xpRingGlow); opacity: 1; }
    }

    @keyframes surgeBurst {
      0% { stroke-width: 5; opacity: 1; }
      30% { stroke-width: 9; opacity: 1; }
      100% { stroke-width: 5; opacity: 0.9; }
    }

    .scanner-ring-xp {
      animation: scanRotate 15s linear infinite;
      transform-origin: 100px 100px;
    }
    .scanner-ring-inner {
      animation: scanRotate 22s linear infinite reverse;
      transform-origin: 100px 100px;
    }
    @keyframes scanRotate {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }

    .notch-filled {
      stroke: #00eaff;
      opacity: 0.9;
      filter: drop-shadow(0 0 3px rgba(0, 234, 255, 0.8));
    }
    .notch-upcoming {
      stroke: rgba(0, 234, 255, 0.3);
      opacity: 0.5;
    }
    .notch-locked {
      stroke: rgba(0, 234, 255, 0.08);
      opacity: 0.3;
    }
    .notch-flicker {
      animation: notchFlicker 1.5s ease-in-out infinite;
    }
    @keyframes notchFlicker {
      0%, 100% { opacity: 0.5; }
      25% { opacity: 1; }
      50% { opacity: 0.6; }
      75% { opacity: 0.95; }
    }
    .notch-milestone {
      stroke-width: 3 !important;
    }

    .energy-particle {
      opacity: 0;
      animation: particlePulse 3s ease-in-out infinite;
    }
    @keyframes particlePulse {
      0%, 100% { opacity: 0; transform: scale(0.5); }
      50% { opacity: 0.7; transform: scale(1.2); }
    }

    .energy-streak {
      opacity: 0.9;
      filter: drop-shadow(0 0 4px #00eaff) drop-shadow(0 0 8px rgba(0, 234, 255, 0.5));
    }

    .milestone-ring {
      transition: all 0.4s ease;
    }
    .milestone-ring.milestone-reached {
      filter: drop-shadow(0 0 4px rgba(0, 234, 255, 0.8));
      animation: milestoneGlow 2s ease-in-out infinite;
    }
    .milestone-dot-glow {
      filter: drop-shadow(0 0 3px #00eaff);
    }
    @keyframes milestoneGlow {
      0%, 100% { stroke-opacity: 0.7; }
      50% { stroke-opacity: 1; }
    }

    .milestone-pulse .progress-arc {
      animation: milestoneSurge 0.8s ease-out;
    }
    @keyframes milestoneSurge {
      0% { stroke-width: 5; }
      25% { stroke-width: 10; }
      50% { stroke-width: 6; }
      100% { stroke-width: 5; }
    }

    .level-up-ring {
      animation: levelUpFlash 0.8s ease-out forwards;
    }
    @keyframes levelUpFlash {
      0% { stroke-width: 4; opacity: 1; stroke: #ffffff; }
      40% { stroke-width: 12; opacity: 1; stroke: #00eaff; }
      100% { stroke-width: 0; opacity: 0; stroke: #ffffff; }
    }
    .level-up-flash .progress-arc {
      animation: arcReset 0.8s ease-out;
    }
    @keyframes arcReset {
      0%, 40% { stroke: #ffffff; stroke-width: 8; stroke-dashoffset: 0 !important; }
      100% { stroke: url(#arcGradient); stroke-width: 5; }
    }

    .xp-surge .progress-arc {
      filter: url(#xpSurgeGlow) !important;
    }

    .level-label-text {
      font-family: 'Orbitron', sans-serif;
      font-size: 10px;
      font-weight: 700;
      fill: rgba(0, 234, 255, 0.5);
      letter-spacing: 4px;
    }
    
    .level-up-screen-pulse {
      position: fixed;
      inset: 0;
      background: radial-gradient(circle at center, rgba(0, 234, 255, 0.4) 0%, transparent 70%);
      z-index: 9999;
      pointer-events: none;
      animation: screenPulseFade 1s ease-out forwards;
    }
    @keyframes screenPulseFade {
      0% { opacity: 0.3; }
      100% { opacity: 0; }
    }
    .burst-particle {
      animation: burstOut 1s cubic-bezier(0.1, 0.8, 0.2, 1) forwards;
      opacity: 0;
      transform-origin: center;
    }
    @keyframes burstOut {
      0% { transform: translate(0, 0) scale(0.5); opacity: 1; }
      100% { transform: translate(var(--tx), var(--ty)) scale(1.5); opacity: 0; }
    }
    .level-up-flash .level-number-text {
      animation: levelTextPop 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275);
      transform-origin: 100px 115px;
    }
    @keyframes levelTextPop {
      0% { transform: scale(1); filter: drop-shadow(0 0 8px rgba(0,234,255,0.6)); }
      30% { transform: scale(1.3) translate(0, -2px); filter: drop-shadow(0 0 20px #00eaff); }
      50% { transform: scale(1.3) translate(2px, 0); }
      70% { transform: scale(1.3) translate(-2px, 0); }
      100% { transform: scale(1); filter: drop-shadow(0 0 8px rgba(0,234,255,0.6)); }
    }
.level-number-text {
      font-family: 'Orbitron', sans-serif;
      font-size: 32px;
      font-weight: 900;
      fill: #ffffff;
      filter: drop-shadow(0 0 8px rgba(0, 234, 255, 0.6));
    }

    .xp-tooltip {
      position: absolute;
      top: -70px;
      left: 50%;
      transform: translateX(-50%);
      min-width: 200px;
      background: rgba(2, 8, 20, 0.96);
      border: 1px solid rgba(0, 234, 255, 0.5);
      border-radius: 6px;
      padding: 14px 18px;
      pointer-events: none;
      box-shadow:
        0 0 24px rgba(0, 234, 255, 0.2),
        0 0 8px rgba(0, 234, 255, 0.1),
        inset 0 0 20px rgba(0, 234, 255, 0.04);
      backdrop-filter: blur(16px);
      -webkit-backdrop-filter: blur(16px);
      z-index: 9999;
      overflow: hidden;
      animation: tooltipFadeIn 0.25s ease-out;
      white-space: nowrap;
    }
    @keyframes tooltipFadeIn {
      from { opacity: 0; transform: translateX(-50%) translateY(8px); }
      to { opacity: 1; transform: translateX(-50%) translateY(0); }
    }

    .tooltip-scanline {
      position: absolute;
      inset: 0;
      background: repeating-linear-gradient(
        0deg,
        transparent,
        transparent 2px,
        rgba(0, 234, 255, 0.03) 2px,
        rgba(0, 234, 255, 0.03) 4px
      );
      animation: scanlineScroll 3s linear infinite;
      pointer-events: none;
    }
    @keyframes scanlineScroll {
      from { transform: translateY(0); }
      to { transform: translateY(20px); }
    }

    .tooltip-content {
      position: relative;
      z-index: 1;
      display: flex;
      flex-direction: column;
      gap: 8px;
    }
    .tooltip-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 16px;
    }
    .tooltip-key {
      font-family: 'Orbitron', sans-serif;
      font-size: 0.6rem;
      font-weight: 700;
      color: rgba(0, 234, 255, 0.5);
      letter-spacing: 2px;
    }
    .tooltip-val {
      font-family: 'Rajdhani', sans-serif;
      font-size: 1rem;
      font-weight: 800;
      color: #ffffff;
    }
    .holo-text {
      text-shadow: 0 0 6px rgba(0, 234, 255, 0.4);
      animation: holoShift 4s ease-in-out infinite;
    }
    @keyframes holoShift {
      0%, 100% { color: #ffffff; text-shadow: 0 0 6px rgba(0, 234, 255, 0.4); }
      33% { color: #e0f8ff; text-shadow: 0 0 8px rgba(0, 234, 255, 0.6); }
      66% { color: #d0f0ff; text-shadow: 0 0 6px rgba(47, 123, 255, 0.4); }
    }

    @media (max-width: 900px) {
      .xp-ring-container {
        width: 160px;
        height: 160px;
      }
    }
    @media (max-width: 600px) {
      .xp-ring-container {
        width: 150px;
        height: 150px;
      }
      .xp-tooltip {
        min-width: 170px;
        padding: 10px 14px;
      }
    }
  `]
})
export class XpProgressRingComponent implements OnInit, OnChanges, OnDestroy {
  @Input() level = 1;
  @Input() currentXp = 0;
  @Input() maxXp = 5000;

  private readonly RADIUS = 78;
  readonly circumference = 2 * Math.PI * this.RADIUS;
  readonly tipDasharray = `4 ${this.circumference - 4}`;

  isHovered = signal(false);
  surgeActive = signal(false);
  levelUpActive = signal(false);
  milestoneActive = signal(false);

  private prevXp = 0;
  private prevLevel = 1;
  private initialized = false;
  private animatingLoad = true;

  private xpEvents = signal<XpEvent[]>([]);

  private previousMilestoneIndex = -1;
  private readonly milestoneThresholds = [0.25, 0.50, 0.75, 1.0];

  progressPercent = computed(() => {
    if (this.maxXp <= 0) return 0;
    return Math.round((this.currentXp / this.maxXp) * 100);
  });

  progressFraction = computed(() => {
    if (this.maxXp <= 0) return 0;
    return Math.min(1, this.currentXp / this.maxXp);
  });

  currentDashoffset = computed(() => {
    if (this.animatingLoad) return this.circumference;
    const fraction = this.progressFraction();
    return this.circumference * (1 - fraction);
  });

  etaDisplay = computed(() => {
    const events = this.xpEvents();
    if (events.length < 2) return 'Calculating\u2026';

    const now = Date.now();
    const validEvents = events.filter(e => (now - e.time) < EVENT_EXPIRY_MS);
    if (validEvents.length < 2) return 'Calculating\u2026';

    const totalXp = validEvents.reduce((sum, e) => sum + e.delta, 0);
    const timeSpanMs = validEvents[validEvents.length - 1].time - validEvents[0].time;
    if (timeSpanMs <= 0) return 'Calculating\u2026';

    const xpPerMs = totalXp / timeSpanMs;
    const remaining = this.maxXp - this.currentXp;
    if (remaining <= 0) return 'READY';

    const msNeeded = remaining / xpPerMs;
    const minutes = Math.ceil(msNeeded / 60000);

    if (minutes < 1) return '< 1 min';
    if (minutes < 60) return '~' + minutes + ' min';
    const hrs = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return '~' + hrs + 'h ' + mins + 'm';
  });

  readonly notchCount = 20;
  readonly notches: { x1: number; y1: number; x2: number; y2: number }[] = [];

  readonly particles: { cx: number; cy: number; r: number; delay: string; duration: string }[] = [];

  readonly streakPath: string;

  readonly levelUpParticles: { cx: number; cy: number; r: number; tx: string; ty: string; delay: string }[] = [];

  readonly milestonePositions = [0.25, 0.5, 0.75];
  milestoneMarkers: { x: number; y: number; percent: number; reached: boolean }[] = [];

  private surgeTimeout: any;
  private levelUpTimeout: any;
  private milestoneTimeout: any;

  constructor() {
    const cx = 100, cy = 100;
    const innerR = 72, outerR = 84;
    for (let i = 0; i < this.notchCount; i++) {
      const angle = (i / this.notchCount) * 360 - 90;
      const rad = (angle * Math.PI) / 180;
      this.notches.push({
        x1: cx + innerR * Math.cos(rad),
        y1: cy + innerR * Math.sin(rad),
        x2: cx + outerR * Math.cos(rad),
        y2: cy + outerR * Math.sin(rad),
      });
    }

    const particleR = 78;
    for (let i = 0; i < 8; i++) {
      const angle = (i / 8) * 360 - 90;
      const rad = (angle * Math.PI) / 180;
      this.particles.push({
        cx: cx + particleR * Math.cos(rad),
        cy: cy + particleR * Math.sin(rad),
        r: 1 + Math.random() * 1.5,
        delay: (i * 0.4).toFixed(1) + 's',
        duration: (2.5 + Math.random() * 1.5).toFixed(1) + 's'
      });
    }

    this.streakPath = 'M 100 22 A 78 78 0 1 1 99.99 22';

    for (const pct of this.milestonePositions) {
      const angle = pct * 360 - 90;
      const rad = (angle * Math.PI) / 180;
      this.milestoneMarkers.push({
        x: cx + 78 * Math.cos(rad),
        y: cy + 78 * Math.sin(rad),
        percent: pct,
        reached: false
      });
    }
  }

  ngOnInit() {
    this.loadXpEvents();
    this.prevXp = this.currentXp;
    this.prevLevel = this.level;

    setTimeout(() => {
      this.animatingLoad = false;
      this.initialized = true;
      this.updateMilestoneMarkers();
      this.previousMilestoneIndex = this.getCurrentMilestoneIndex();
    }, 80);
  }

  ngOnChanges(changes: SimpleChanges) {
    if (!this.initialized) return;

    const xpChanged = changes['currentXp'] && !changes['currentXp'].firstChange;
    const levelChanged = changes['level'] && !changes['level'].firstChange;

    if (levelChanged && this.level > this.prevLevel) {
      this.triggerLevelUp();
      this.prevLevel = this.level;
    }

    if (xpChanged) {
      const delta = this.currentXp - this.prevXp;
      if (delta > 0) {
        this.recordXpEvent(delta);
        this.triggerSurge();
        this.checkMilestone();
      }
      this.prevXp = this.currentXp;
    }

    this.updateMilestoneMarkers();
  }

  ngOnDestroy() {
    if (this.surgeTimeout) clearTimeout(this.surgeTimeout);
    if (this.levelUpTimeout) clearTimeout(this.levelUpTimeout);
    if (this.milestoneTimeout) clearTimeout(this.milestoneTimeout);
  }

  getNotchClass(index: number): string {
    const fraction = this.progressFraction();
    const notchFraction = index / this.notchCount;

    if (notchFraction < fraction - 0.01) {
      return 'notch-filled';
    } else if (notchFraction < fraction + 0.1) {
      return 'notch-upcoming';
    } else {
      return 'notch-locked';
    }
  }

  isActiveEdgeNotch(index: number): boolean {
    const fraction = this.progressFraction();
    const notchFraction = index / this.notchCount;
    const prevNotchFraction = (index - 1) / this.notchCount;
    return fraction >= prevNotchFraction && fraction < notchFraction + 0.01 && fraction > 0;
  }

  isMilestoneNotch(index: number): boolean {
    return index === 5 || index === 10 || index === 15;
  }

  private triggerSurge() {
    this.surgeActive.set(true);
    if (this.surgeTimeout) clearTimeout(this.surgeTimeout);
    this.surgeTimeout = setTimeout(() => this.surgeActive.set(false), 600);
  }

  private triggerLevelUp() {
    this.levelUpActive.set(true);
    if (this.levelUpTimeout) clearTimeout(this.levelUpTimeout);
    this.levelUpTimeout = setTimeout(() => this.levelUpActive.set(false), 900);
  }

  private triggerMilestonePulse() {
    this.milestoneActive.set(true);
    if (this.milestoneTimeout) clearTimeout(this.milestoneTimeout);
    this.milestoneTimeout = setTimeout(() => this.milestoneActive.set(false), 800);
  }

  private checkMilestone() {
    const currentIndex = this.getCurrentMilestoneIndex();
    if (currentIndex > this.previousMilestoneIndex) {
      this.triggerMilestonePulse();
      this.previousMilestoneIndex = currentIndex;
    }
  }

  private getCurrentMilestoneIndex(): number {
    const frac = this.progressFraction();
    let idx = -1;
    for (let i = 0; i < this.milestoneThresholds.length; i++) {
      if (frac >= this.milestoneThresholds[i]) idx = i;
    }
    return idx;
  }

  private updateMilestoneMarkers() {
    const frac = this.progressFraction();
    this.milestoneMarkers = this.milestoneMarkers.map(m => ({
      ...m,
      reached: frac >= m.percent
    }));
  }

  private recordXpEvent(delta: number) {
    const now = Date.now();
    const events = [...this.xpEvents()];
    events.push({ delta, time: now });
    const trimmed = events.slice(-5);
    this.xpEvents.set(trimmed);
    this.saveXpEvents(trimmed);
  }

  private saveXpEvents(events: XpEvent[]) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(events));
    } catch (e) { /* localStorage might be full or disabled */ }
  }

  private loadXpEvents() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const parsed: XpEvent[] = JSON.parse(raw);
      const now = Date.now();
      const valid = parsed.filter(e => (now - e.time) < EVENT_EXPIRY_MS);
      this.xpEvents.set(valid);
    } catch (e) { /* Ignore parse errors */ }
  }
}
