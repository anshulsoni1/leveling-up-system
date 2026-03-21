import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoaderService } from '../../services/loader.service';

@Component({
  selector: 'app-loader',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="loader-overlay" *ngIf="loaderService.loading()">
      <div class="spinner-container">
        <div class="spinner-ring"></div>
        <div class="spinner-ring inner"></div>
        <span class="spinner-text">LOADING</span>
      </div>
    </div>
  `,
  styles: [`
    .loader-overlay {
      position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
      background: rgba(2, 6, 18, 0.75);
      backdrop-filter: blur(4px);
      z-index: 9999;
      display: flex; align-items: center; justify-content: center;
      animation: overlayIn 0.2s ease;
    }
    .spinner-container {
      position: relative;
      width: 80px; height: 80px;
      display: flex; align-items: center; justify-content: center;
    }
    .spinner-ring {
      position: absolute; width: 80px; height: 80px;
      border: 3px solid transparent;
      border-top-color: #00c8ff;
      border-right-color: rgba(0, 200, 255, 0.3);
      border-radius: 50%;
      animation: spin 1s linear infinite;
      box-shadow: 0 0 15px rgba(0, 200, 255, 0.3);
    }
    .spinner-ring.inner {
      width: 55px; height: 55px;
      border-top-color: rgba(0, 200, 255, 0.6);
      border-right-color: transparent;
      border-left-color: rgba(0, 200, 255, 0.2);
      animation: spin 0.7s linear infinite reverse;
    }
    .spinner-text {
      font-family: 'Orbitron', sans-serif;
      font-size: 0.5rem;
      color: rgba(0, 200, 255, 0.7);
      letter-spacing: 3px;
      text-shadow: 0 0 8px rgba(0, 200, 255, 0.4);
      animation: pulse 1.5s ease-in-out infinite;
    }
    @keyframes spin { to { transform: rotate(360deg); } }
    @keyframes pulse {
      0%, 100% { opacity: 0.5; }
      50% { opacity: 1; }
    }
    @keyframes overlayIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }
  `]
})
export class LoaderComponent {
  loaderService = inject(LoaderService);
}