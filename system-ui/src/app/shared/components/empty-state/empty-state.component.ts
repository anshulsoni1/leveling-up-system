import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-empty-state',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="empty-state-container">
      <div class="empty-icon">{{ icon }}</div>
      <h3 class="empty-title">{{ title }}</h3>
      <p class="empty-subtitle">{{ subtitle }}</p>
      <button *ngIf="ctaLabel" class="cta-btn" (click)="ctaClick.emit()">{{ ctaLabel }}</button>
    </div>
  `,
  styles: [`
    .empty-state-container {
      display: flex; flex-direction: column; align-items: center; justify-content: center;
      padding: 3rem 2rem; text-align: center;
      border: 1px dashed rgba(0, 200, 255, 0.15); border-radius: 8px;
      background: rgba(0, 200, 255, 0.02);
      animation: fadeUp 0.5s ease;
    }
    .empty-icon {
      font-size: 2.5rem; margin-bottom: 1rem;
      filter: drop-shadow(0 0 10px rgba(0, 200, 255, 0.4));
      animation: float 3s ease-in-out infinite;
    }
    .empty-title {
      font-family: 'Orbitron', sans-serif; font-size: 1rem;
      color: rgba(0, 200, 255, 0.8); letter-spacing: 2px; margin: 0 0 0.5rem;
      text-shadow: 0 0 10px rgba(0, 200, 255, 0.3);
    }
    .empty-subtitle {
      font-family: 'Rajdhani', sans-serif; font-size: 0.9rem;
      color: rgba(180, 200, 220, 0.5); letter-spacing: 1px; margin: 0 0 1.5rem;
    }
    .cta-btn {
      background: transparent; border: 1px solid rgba(0, 200, 255, 0.3);
      color: #00c8ff; padding: 0.6rem 1.5rem; border-radius: 6px;
      font-family: 'Rajdhani', sans-serif; font-size: 0.85rem; font-weight: 600;
      letter-spacing: 1.5px; cursor: pointer; transition: all 0.3s ease;
    }
    .cta-btn:hover {
      background: rgba(0, 200, 255, 0.1); border-color: rgba(0, 200, 255, 0.5);
      box-shadow: 0 0 15px rgba(0, 200, 255, 0.15);
      transform: translateY(-2px);
    }
    @keyframes fadeUp {
      from { opacity: 0; transform: translateY(20px); }
      to { opacity: 1; transform: translateY(0); }
    }
    @keyframes float {
      0%, 100% { transform: translateY(0); }
      50% { transform: translateY(-8px); }
    }
  `]
})
export class EmptyStateComponent {
  @Input() icon: string = '◇';
  @Input() title: string = 'NO DATA AVAILABLE';
  @Input() subtitle: string = 'Start your journey';
  @Input() ctaLabel: string = '';
  @Output() ctaClick = new EventEmitter<void>();
}