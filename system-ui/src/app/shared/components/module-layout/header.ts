import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-module-header',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="hud-panel module-header">
      <div class="header-main">
        <h1 class="module-title glow-text">{{ title | uppercase }}</h1>
        <div class="header-stats-container">
          <div class="streak-badge">
            <span class="system-label">STREAK</span>
            <span class="system-value glow-text">{{ streak }}</span>
            <span class="system-label">BEST</span>
            <span class="system-value system-dim">{{ bestStreak }}</span>
          </div>
          <div class="basic-stat-badge" *ngIf="statLabel">
            <span class="system-label">{{ statLabel | uppercase }}</span>
            <span class="system-value glow-text">{{ statValue }}</span>
          </div>
        </div>
      </div>
      <div class="header-accent"></div>
    </div>
  `,
  styles: [`
    @use '../../styles/system-theme' as *;
    .module-header {
      width: 100%;
      padding: 1.5rem 2rem;
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
      position: relative;
      overflow: hidden;
    }
    .header-main {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .module-title {
      font-family: 'Orbitron', sans-serif;
      font-size: 2rem;
      color: $neon-cyan;
      margin: 0;
      letter-spacing: 4px;
    }
    .header-stats-container {
      display: flex;
      gap: 2rem;
      align-items: flex-start;
    }
    .streak-badge {
      display: grid;
      grid-template-columns: auto auto;
      column-gap: 0.75rem;
      row-gap: 0.2rem;
      align-items: center;
      justify-items: end;
    }
    .basic-stat-badge {
      display: flex;
      flex-direction: column;
      align-items: flex-end;
      gap: 0.2rem;
      border-left: 1px solid rgba($neon-cyan, 0.2);
      padding-left: 1.5rem;
    }
    .system-label {
      font-size: 0.65rem;
      letter-spacing: 1px;
      opacity: 0.6;
    }
    .system-value {
      font-family: 'Rajdhani', sans-serif;
      font-size: 1.25rem;
      font-weight: 700;
      line-height: 1;
    }
    .system-dim {
      color: rgba(255, 255, 255, 0.5);
    }
    .header-accent {
      position: absolute;
      bottom: 0;
      left: 0;
      width: 100%;
      height: 2px;
      background: linear-gradient(90deg, transparent, $neon-cyan, transparent);
      box-shadow: $glow-soft;
    }
    @media (max-width: 768px) {
      .module-header { padding: 1rem; }
      .header-main { flex-direction: column; align-items: flex-start; gap: 1rem; }
      .module-title { font-size: 1.3rem; letter-spacing: 2px; }
      .header-stats-container { width: 100%; justify-content: space-between; }
      .basic-stat-badge { padding-left: 1rem; }
      .system-value { font-size: 1rem; }
    }
  `]
})
export class ModuleHeaderComponent {
  @Input() title: string = '';
  @Input() streak: number = 0;
  @Input() bestStreak: number = 0;
  @Input() statLabel: string = '';
  @Input() statValue: number = 0;
}
