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
        <span class="stat-value">{{ value }} <span class="stat-max" *ngIf="max">/ {{ max }}</span></span>
      </div>
      <div class="stat-track">
        <div class="stat-fill" [style.width.%]="percentage"></div>
      </div>
    </div>
  `,
  styles: [`
    .stat-container {
      width: 100%;
      margin-bottom: 10px;
    }
    .stat-header {
      display: flex;
      justify-content: space-between;
      color: #aaa;
      font-size: 0.8rem;
      font-weight: bold;
      letter-spacing: 1.5px;
      margin-bottom: 6px;
    }
    .stat-label {
      color: var(--system-cyan, #00eaff);
      text-shadow: 0 0 5px rgba(0, 234, 255, 0.4);
    }
    .stat-value {
      color: #fff;
    }
    .stat-max {
      color: #666;
    }
    .stat-track {
      height: 10px;
      background: rgba(0, 0, 0, 0.7);
      border-radius: 4px;
      overflow: hidden;
      border: 1px solid rgba(0, 234, 255, 0.2);
    }
    .stat-fill {
      height: 100%;
      background: linear-gradient(90deg, #0064ff, #00eaff);
      box-shadow: 0 0 10px #00eaff;
      border-radius: 2px;
      transition: width 1s cubic-bezier(0.4, 0, 0.2, 1), background 0.3s ease, box-shadow 0.3s ease;
    }
  `]
})
export class StatBarComponent {
  @Input() label: string = '';
  @Input() value: number = 0;
  @Input() max?: number;

  get percentage(): number {
    if (!this.max) {
      // If no max, simulate an asymptotic curve approaching 100
      return Math.min(100, (this.value / (this.value + 50)) * 100);
    }
    return Math.min(100, Math.max(0, (this.value / this.max) * 100));
  }
}
