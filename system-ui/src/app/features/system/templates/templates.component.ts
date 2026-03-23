import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-templates',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="templates-container">
      <div class="panel-header">
        <h1 class="panel-title">TEMPLATES</h1>
      </div>
      <div class="hud-panel templates-content">
        <p class="placeholder-text">Quick start templates will appear here</p>
      </div>
    </div>
  `,
  styles: [`
    .templates-container {
      display: flex;
      flex-direction: column;
      gap: 2rem;
      width: 100%;
      max-width: 1200px;
      margin: 0 auto;
      animation: slideUp 0.6s ease-out;
    }

    @keyframes slideUp {
      from { opacity: 0; transform: translateY(20px); }
      to { opacity: 1; transform: translateY(0); }
    }

    .panel-header {
      margin-bottom: 0.5rem;
    }

    .panel-title {
      font-family: 'Orbitron', sans-serif;
      font-size: 2rem;
      color: #00eaff;
      letter-spacing: 3px;
      text-shadow: 0 0 10px rgba(0, 234, 255, 0.4);
      margin: 0;
      text-transform: uppercase;
    }

    .templates-content {
      padding: 3rem;
      text-align: center;
      background: rgba(5, 15, 30, 0.6);
      border: 1px solid rgba(0, 234, 255, 0.1);
      backdrop-filter: blur(10px);
      border-radius: 8px;
    }

    .placeholder-text {
      font-family: 'Rajdhani', sans-serif;
      font-size: 1.2rem;
      color: rgba(180, 200, 220, 0.6);
      letter-spacing: 2px;
      text-transform: uppercase;
    }
  `]
})
export class TemplatesComponent {}
