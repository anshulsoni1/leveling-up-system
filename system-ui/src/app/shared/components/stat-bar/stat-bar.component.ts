import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-stat-bar',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="stat-container">
      <div class="stat-header">
        <span class="stat-label">{{ label | uppercase }}</span>
        <span class="stat-value">
          <span class="current-val">{{ value }}</span>
          <span class="stat-max" *ngIf="max"> / {{ max }}</span>
        </span>
      </div>
      <div class="stat-track">
        <div class="stat-fill" [style.width.%]="percentage"></div>
      </div>
    </div>
  `,
  styles: [`
    .stat-container {
      width: 100%;
      margin-bottom: 4px;
    }
    .stat-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
      margin-bottom: 6px;
    }
    .stat-label {
      font-family: 'Rajdhani', sans-serif;
      font-size: 0.75rem;
      font-weight: 700;
      color: var(--system-cyan, #00eaff);
      letter-spacing: 1.5px;
      text-shadow: 0 0 8px rgba(0, 234, 255, 0.3);
    }
    .stat-value {
      font-family: 'Rajdhani', sans-serif;
      font-size: 0.85rem;
      font-weight: 600;
      letter-spacing: 1px;
    }
    .current-val {
      color: #fff;
      text-shadow: 0 0 5px rgba(255, 255, 255, 0.3);
    }
    .stat-max {
      color: rgba(255, 255, 255, 0.35);
      font-size: 0.75rem;
    }
    .stat-track {
      height: 8px;
      background: rgba(0, 20, 30, 0.6);
      border-radius: 4px;
      overflow: hidden;
      border: 1px solid rgba(0, 234, 255, 0.15);
      position: relative;
    }
    .stat-fill {
      height: 100%;
      background: linear-gradient(90deg, #0055ff, #00eaff);
      box-shadow: 0 0 12px rgba(0, 234, 255, 0.5);
      border-radius: 4px;
      transition: width 0.8s cubic-bezier(0.4, 0, 0.2, 1);
      transform-origin: left;
      animation: fillProgress 1s ease-out;
    }

    @keyframes fillProgress {
      from { transform: scaleX(0); }
      to { transform: scaleX(1); }
    }
  `]
})
export class StatBarComponent {
  @Input() label: string = '';
  @Input() value: number = 0;
  @Input() max?: number;

  get percentage(): number {
    if (!this.max) {
      return Math.min(100, (this.value / (this.value + 50)) * 100);
    }
    return Math.min(100, Math.max(0, (this.value / this.max) * 100));
  }
}
