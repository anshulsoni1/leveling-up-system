import { Component, inject, computed, signal, AfterViewInit, DestroyRef, ViewChild, ElementRef, OnDestroy, NgZone } from '@angular/core';
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
  <div class="hunter-status-card holographic-panel" [ngClass]="statusState + '-state'" (mousemove)="onPanelMouseMove($event)" (mouseleave)="onPanelMouseLeave()">
    <!-- Deep Background Layers (z-index below holo-bg-layer) -->
    <div class="deep-bg-layer">

      <!-- Layer 1: Orbital Rings (behind radar) -->
      <div class="orbital-rings">
        <div class="orbit-scene">
          <svg viewBox="0 0 440 300" class="orbital-svg">
            <ellipse cx="220" cy="150" rx="120" ry="80" class="orbit-ring orbit-1"/>
            <ellipse cx="220" cy="150" rx="165" ry="110" class="orbit-ring orbit-2"/>
            <ellipse cx="220" cy="150" rx="210" ry="140" class="orbit-ring orbit-3"/>
          </svg>
        </div>
      </div>

      <!-- Layer 3: Depth Horizon Line (bottom of panel) -->
      <div class="depth-horizon">
        <svg viewBox="0 0 800 300" preserveAspectRatio="none" class="horizon-svg">
          <defs>
            <radialGradient id="horizonFade" cx="50%" cy="100%" r="70%" fx="50%" fy="100%">
              <stop offset="0%" stop-color="white" stop-opacity="1"/>
              <stop offset="100%" stop-color="white" stop-opacity="0"/>
            </radialGradient>
            <mask id="horizonMask">
              <rect x="0" y="0" width="800" height="300" fill="url(#horizonFade)"/>
            </mask>
          </defs>
          <g mask="url(#horizonMask)">
        <line x1="400" y1="300" x2="-28" y2="180" stroke="rgba(0,234,255,0.18)" stroke-width="0.5"/>
        <line x1="400" y1="300" x2="166" y2="180" stroke="rgba(0,234,255,0.18)" stroke-width="0.5"/>
        <line x1="400" y1="300" x2="279" y2="180" stroke="rgba(0,234,255,0.18)" stroke-width="0.5"/>
        <line x1="400" y1="300" x2="358" y2="180" stroke="rgba(0,234,255,0.18)" stroke-width="0.5"/>
        <line x1="400" y1="300" x2="442" y2="180" stroke="rgba(0,234,255,0.18)" stroke-width="0.5"/>
        <line x1="400" y1="300" x2="521" y2="180" stroke="rgba(0,234,255,0.18)" stroke-width="0.5"/>
        <line x1="400" y1="300" x2="634" y2="180" stroke="rgba(0,234,255,0.18)" stroke-width="0.5"/>
        <line x1="400" y1="300" x2="828" y2="180" stroke="rgba(0,234,255,0.18)" stroke-width="0.5"/>
        <line x1="23" y1="290" x2="777" y2="290" stroke="rgba(0,234,255,0.18)" stroke-width="0.5"/>
        <line x1="70" y1="270" x2="730" y2="270" stroke="rgba(0,234,255,0.18)" stroke-width="0.5"/>
        <line x1="128" y1="245" x2="672" y2="245" stroke="rgba(0,234,255,0.18)" stroke-width="0.5"/>
        <line x1="198" y1="215" x2="602" y2="215" stroke="rgba(0,234,255,0.18)" stroke-width="0.5"/>
        <line x1="245" y1="195" x2="555" y2="195" stroke="rgba(0,234,255,0.18)" stroke-width="0.5"/>
          </g>
        </svg>
      </div>

      <!-- Layer 4: Hexagonal Cell Grid (left panel only) -->
      <div class="hex-cell-grid">
        <svg viewBox="0 0 160 320" preserveAspectRatio="none" class="hex-svg">
          <polygon points="23.7,5.0 23.7,15.0 15.0,20.0 6.3,15.0 6.3,5.0 15.0,0.0" fill="none" stroke="rgba(0,234,255,0.14)" stroke-width="0.5"/>
          <polygon points="38.7,13.7 38.7,23.7 30.0,28.7 21.3,23.7 21.3,13.7 30.0,8.7" fill="none" stroke="rgba(0,234,255,0.14)" stroke-width="0.5"/>
          <polygon points="53.7,5.0 53.7,15.0 45.0,20.0 36.3,15.0 36.3,5.0 45.0,0.0" fill="none" stroke="rgba(0,234,255,0.14)" stroke-width="0.5"/>
          <polygon points="68.7,13.7 68.7,23.7 60.0,28.7 51.3,23.7 51.3,13.7 60.0,8.7" fill="none" stroke="rgba(0,234,255,0.14)" stroke-width="0.5"/>
          <polygon points="83.7,5.0 83.7,15.0 75.0,20.0 66.3,15.0 66.3,5.0 75.0,0.0" fill="none" stroke="rgba(0,234,255,0.14)" stroke-width="0.5"/>
          <polygon points="98.7,13.7 98.7,23.7 90.0,28.7 81.3,23.7 81.3,13.7 90.0,8.7" fill="none" stroke="rgba(0,234,255,0.14)" stroke-width="0.5"/>
          <polygon points="113.7,5.0 113.7,15.0 105.0,20.0 96.3,15.0 96.3,5.0 105.0,0.0" fill="none" stroke="rgba(0,234,255,0.14)" stroke-width="0.5"/>
          <polygon points="128.7,13.7 128.7,23.7 120.0,28.7 111.3,23.7 111.3,13.7 120.0,8.7" fill="none" stroke="rgba(0,234,255,0.14)" stroke-width="0.5"/>
          <polygon points="143.7,5.0 143.7,15.0 135.0,20.0 126.3,15.0 126.3,5.0 135.0,0.0" fill="none" stroke="rgba(0,234,255,0.14)" stroke-width="0.5"/>
          <polygon points="158.7,13.7 158.7,23.7 150.0,28.7 141.3,23.7 141.3,13.7 150.0,8.7" fill="none" stroke="rgba(0,234,255,0.14)" stroke-width="0.5"/>
          <polygon points="23.7,22.3 23.7,32.3 15.0,37.3 6.3,32.3 6.3,22.3 15.0,17.3" fill="none" stroke="rgba(0,234,255,0.14)" stroke-width="0.5"/>
          <polygon points="38.7,31.0 38.7,41.0 30.0,46.0 21.3,41.0 21.3,31.0 30.0,26.0" fill="none" stroke="rgba(0,234,255,0.14)" stroke-width="0.5"/>
          <polygon points="53.7,22.3 53.7,32.3 45.0,37.3 36.3,32.3 36.3,22.3 45.0,17.3" fill="none" stroke="rgba(0,234,255,0.14)" stroke-width="0.5"/>
          <polygon points="68.7,31.0 68.7,41.0 60.0,46.0 51.3,41.0 51.3,31.0 60.0,26.0" fill="none" stroke="rgba(0,234,255,0.14)" stroke-width="0.5"/>
          <polygon points="83.7,22.3 83.7,32.3 75.0,37.3 66.3,32.3 66.3,22.3 75.0,17.3" fill="none" stroke="rgba(0,234,255,0.14)" stroke-width="0.5"/>
          <polygon points="98.7,31.0 98.7,41.0 90.0,46.0 81.3,41.0 81.3,31.0 90.0,26.0" fill="none" stroke="rgba(0,234,255,0.14)" stroke-width="0.5"/>
          <polygon points="113.7,22.3 113.7,32.3 105.0,37.3 96.3,32.3 96.3,22.3 105.0,17.3" fill="none" stroke="rgba(0,234,255,0.14)" stroke-width="0.5"/>
          <polygon points="128.7,31.0 128.7,41.0 120.0,46.0 111.3,41.0 111.3,31.0 120.0,26.0" fill="none" stroke="rgba(0,234,255,0.14)" stroke-width="0.5"/>
          <polygon points="143.7,22.3 143.7,32.3 135.0,37.3 126.3,32.3 126.3,22.3 135.0,17.3" fill="none" stroke="rgba(0,234,255,0.14)" stroke-width="0.5"/>
          <polygon points="158.7,31.0 158.7,41.0 150.0,46.0 141.3,41.0 141.3,31.0 150.0,26.0" fill="none" stroke="rgba(0,234,255,0.14)" stroke-width="0.5"/>
          <polygon points="23.7,39.6 23.7,49.6 15.0,54.6 6.3,49.6 6.3,39.6 15.0,34.6" fill="none" stroke="rgba(0,234,255,0.14)" stroke-width="0.5"/>
          <polygon points="38.7,48.3 38.7,58.3 30.0,63.3 21.3,58.3 21.3,48.3 30.0,43.3" fill="none" stroke="rgba(0,234,255,0.14)" stroke-width="0.5"/>
          <polygon points="53.7,39.6 53.7,49.6 45.0,54.6 36.3,49.6 36.3,39.6 45.0,34.6" fill="none" stroke="rgba(0,234,255,0.14)" stroke-width="0.5"/>
          <polygon points="68.7,48.3 68.7,58.3 60.0,63.3 51.3,58.3 51.3,48.3 60.0,43.3" fill="none" stroke="rgba(0,234,255,0.14)" stroke-width="0.5"/>
          <polygon points="83.7,39.6 83.7,49.6 75.0,54.6 66.3,49.6 66.3,39.6 75.0,34.6" fill="none" stroke="rgba(0,234,255,0.14)" stroke-width="0.5"/>
          <polygon points="98.7,48.3 98.7,58.3 90.0,63.3 81.3,58.3 81.3,48.3 90.0,43.3" fill="none" stroke="rgba(0,234,255,0.14)" stroke-width="0.5"/>
          <polygon points="113.7,39.6 113.7,49.6 105.0,54.6 96.3,49.6 96.3,39.6 105.0,34.6" fill="none" stroke="rgba(0,234,255,0.14)" stroke-width="0.5"/>
          <polygon points="128.7,48.3 128.7,58.3 120.0,63.3 111.3,58.3 111.3,48.3 120.0,43.3" fill="none" stroke="rgba(0,234,255,0.14)" stroke-width="0.5"/>
          <polygon points="143.7,39.6 143.7,49.6 135.0,54.6 126.3,49.6 126.3,39.6 135.0,34.6" fill="none" stroke="rgba(0,234,255,0.14)" stroke-width="0.5"/>
          <polygon points="158.7,48.3 158.7,58.3 150.0,63.3 141.3,58.3 141.3,48.3 150.0,43.3" fill="none" stroke="rgba(0,234,255,0.14)" stroke-width="0.5"/>
          <polygon points="23.7,57.0 23.7,67.0 15.0,72.0 6.3,67.0 6.3,57.0 15.0,52.0" fill="none" stroke="rgba(0,234,255,0.14)" stroke-width="0.5"/>
          <polygon points="38.7,65.6 38.7,75.6 30.0,80.6 21.3,75.6 21.3,65.6 30.0,60.6" fill="none" stroke="rgba(0,234,255,0.14)" stroke-width="0.5"/>
          <polygon points="53.7,57.0 53.7,67.0 45.0,72.0 36.3,67.0 36.3,57.0 45.0,52.0" fill="none" stroke="rgba(0,234,255,0.14)" stroke-width="0.5"/>
          <polygon points="68.7,65.6 68.7,75.6 60.0,80.6 51.3,75.6 51.3,65.6 60.0,60.6" fill="none" stroke="rgba(0,234,255,0.14)" stroke-width="0.5"/>
          <polygon points="83.7,57.0 83.7,67.0 75.0,72.0 66.3,67.0 66.3,57.0 75.0,52.0" fill="none" stroke="rgba(0,234,255,0.14)" stroke-width="0.5"/>
          <polygon points="98.7,65.6 98.7,75.6 90.0,80.6 81.3,75.6 81.3,65.6 90.0,60.6" fill="none" stroke="rgba(0,234,255,0.14)" stroke-width="0.5"/>
          <polygon points="113.7,57.0 113.7,67.0 105.0,72.0 96.3,67.0 96.3,57.0 105.0,52.0" fill="none" stroke="rgba(0,234,255,0.14)" stroke-width="0.5"/>
          <polygon points="128.7,65.6 128.7,75.6 120.0,80.6 111.3,75.6 111.3,65.6 120.0,60.6" fill="none" stroke="rgba(0,234,255,0.14)" stroke-width="0.5"/>
          <polygon points="143.7,57.0 143.7,67.0 135.0,72.0 126.3,67.0 126.3,57.0 135.0,52.0" fill="none" stroke="rgba(0,234,255,0.14)" stroke-width="0.5"/>
          <polygon points="158.7,65.6 158.7,75.6 150.0,80.6 141.3,75.6 141.3,65.6 150.0,60.6" fill="none" stroke="rgba(0,234,255,0.14)" stroke-width="0.5"/>
          <polygon points="23.7,74.3 23.7,84.3 15.0,89.3 6.3,84.3 6.3,74.3 15.0,69.3" fill="none" stroke="rgba(0,234,255,0.14)" stroke-width="0.5"/>
          <polygon points="38.7,82.9 38.7,92.9 30.0,97.9 21.3,92.9 21.3,82.9 30.0,77.9" fill="none" stroke="rgba(0,234,255,0.14)" stroke-width="0.5"/>
          <polygon points="53.7,74.3 53.7,84.3 45.0,89.3 36.3,84.3 36.3,74.3 45.0,69.3" fill="none" stroke="rgba(0,234,255,0.14)" stroke-width="0.5"/>
          <polygon points="68.7,82.9 68.7,92.9 60.0,97.9 51.3,92.9 51.3,82.9 60.0,77.9" fill="none" stroke="rgba(0,234,255,0.14)" stroke-width="0.5"/>
          <polygon points="83.7,74.3 83.7,84.3 75.0,89.3 66.3,84.3 66.3,74.3 75.0,69.3" fill="none" stroke="rgba(0,234,255,0.14)" stroke-width="0.5"/>
          <polygon points="98.7,82.9 98.7,92.9 90.0,97.9 81.3,92.9 81.3,82.9 90.0,77.9" fill="none" stroke="rgba(0,234,255,0.14)" stroke-width="0.5"/>
          <polygon points="113.7,74.3 113.7,84.3 105.0,89.3 96.3,84.3 96.3,74.3 105.0,69.3" fill="none" stroke="rgba(0,234,255,0.14)" stroke-width="0.5"/>
          <polygon points="128.7,82.9 128.7,92.9 120.0,97.9 111.3,92.9 111.3,82.9 120.0,77.9" fill="none" stroke="rgba(0,234,255,0.14)" stroke-width="0.5"/>
          <polygon points="143.7,74.3 143.7,84.3 135.0,89.3 126.3,84.3 126.3,74.3 135.0,69.3" fill="none" stroke="rgba(0,234,255,0.14)" stroke-width="0.5"/>
          <polygon points="158.7,82.9 158.7,92.9 150.0,97.9 141.3,92.9 141.3,82.9 150.0,77.9" fill="none" stroke="rgba(0,234,255,0.14)" stroke-width="0.5"/>
          <polygon points="23.7,91.6 23.7,101.6 15.0,106.6 6.3,101.6 6.3,91.6 15.0,86.6" fill="none" stroke="rgba(0,234,255,0.14)" stroke-width="0.5"/>
          <polygon points="38.7,100.3 38.7,110.3 30.0,115.3 21.3,110.3 21.3,100.3 30.0,95.3" fill="none" stroke="rgba(0,234,255,0.14)" stroke-width="0.5"/>
          <polygon points="53.7,91.6 53.7,101.6 45.0,106.6 36.3,101.6 36.3,91.6 45.0,86.6" fill="none" stroke="rgba(0,234,255,0.14)" stroke-width="0.5"/>
          <polygon points="68.7,100.3 68.7,110.3 60.0,115.3 51.3,110.3 51.3,100.3 60.0,95.3" fill="none" stroke="rgba(0,234,255,0.14)" stroke-width="0.5"/>
          <polygon points="83.7,91.6 83.7,101.6 75.0,106.6 66.3,101.6 66.3,91.6 75.0,86.6" fill="none" stroke="rgba(0,234,255,0.14)" stroke-width="0.5"/>
          <polygon points="98.7,100.3 98.7,110.3 90.0,115.3 81.3,110.3 81.3,100.3 90.0,95.3" fill="none" stroke="rgba(0,234,255,0.14)" stroke-width="0.5"/>
          <polygon points="113.7,91.6 113.7,101.6 105.0,106.6 96.3,101.6 96.3,91.6 105.0,86.6" fill="none" stroke="rgba(0,234,255,0.14)" stroke-width="0.5"/>
          <polygon points="128.7,100.3 128.7,110.3 120.0,115.3 111.3,110.3 111.3,100.3 120.0,95.3" fill="none" stroke="rgba(0,234,255,0.14)" stroke-width="0.5"/>
          <polygon points="143.7,91.6 143.7,101.6 135.0,106.6 126.3,101.6 126.3,91.6 135.0,86.6" fill="none" stroke="rgba(0,234,255,0.14)" stroke-width="0.5"/>
          <polygon points="158.7,100.3 158.7,110.3 150.0,115.3 141.3,110.3 141.3,100.3 150.0,95.3" fill="none" stroke="rgba(0,234,255,0.14)" stroke-width="0.5"/>
          <polygon points="23.7,108.9 23.7,118.9 15.0,123.9 6.3,118.9 6.3,108.9 15.0,103.9" fill="none" stroke="rgba(0,234,255,0.14)" stroke-width="0.5"/>
          <polygon points="38.7,117.6 38.7,127.6 30.0,132.6 21.3,127.6 21.3,117.6 30.0,112.6" fill="none" stroke="rgba(0,234,255,0.14)" stroke-width="0.5"/>
          <polygon points="53.7,108.9 53.7,118.9 45.0,123.9 36.3,118.9 36.3,108.9 45.0,103.9" fill="none" stroke="rgba(0,234,255,0.14)" stroke-width="0.5"/>
          <polygon points="68.7,117.6 68.7,127.6 60.0,132.6 51.3,127.6 51.3,117.6 60.0,112.6" fill="none" stroke="rgba(0,234,255,0.14)" stroke-width="0.5"/>
          <polygon points="83.7,108.9 83.7,118.9 75.0,123.9 66.3,118.9 66.3,108.9 75.0,103.9" fill="none" stroke="rgba(0,234,255,0.14)" stroke-width="0.5"/>
          <polygon points="98.7,117.6 98.7,127.6 90.0,132.6 81.3,127.6 81.3,117.6 90.0,112.6" fill="none" stroke="rgba(0,234,255,0.14)" stroke-width="0.5"/>
          <polygon points="113.7,108.9 113.7,118.9 105.0,123.9 96.3,118.9 96.3,108.9 105.0,103.9" fill="none" stroke="rgba(0,234,255,0.14)" stroke-width="0.5"/>
          <polygon points="128.7,117.6 128.7,127.6 120.0,132.6 111.3,127.6 111.3,117.6 120.0,112.6" fill="none" stroke="rgba(0,234,255,0.14)" stroke-width="0.5"/>
          <polygon points="143.7,108.9 143.7,118.9 135.0,123.9 126.3,118.9 126.3,108.9 135.0,103.9" fill="none" stroke="rgba(0,234,255,0.14)" stroke-width="0.5"/>
          <polygon points="158.7,117.6 158.7,127.6 150.0,132.6 141.3,127.6 141.3,117.6 150.0,112.6" fill="none" stroke="rgba(0,234,255,0.14)" stroke-width="0.5"/>
          <polygon points="23.7,126.2 23.7,136.2 15.0,141.2 6.3,136.2 6.3,126.2 15.0,121.2" fill="none" stroke="rgba(0,234,255,0.14)" stroke-width="0.5"/>
          <polygon points="38.7,134.9 38.7,144.9 30.0,149.9 21.3,144.9 21.3,134.9 30.0,129.9" fill="none" stroke="rgba(0,234,255,0.14)" stroke-width="0.5"/>
          <polygon points="53.7,126.2 53.7,136.2 45.0,141.2 36.3,136.2 36.3,126.2 45.0,121.2" fill="none" stroke="rgba(0,234,255,0.14)" stroke-width="0.5"/>
          <polygon points="68.7,134.9 68.7,144.9 60.0,149.9 51.3,144.9 51.3,134.9 60.0,129.9" fill="none" stroke="rgba(0,234,255,0.14)" stroke-width="0.5"/>
          <polygon points="83.7,126.2 83.7,136.2 75.0,141.2 66.3,136.2 66.3,126.2 75.0,121.2" fill="none" stroke="rgba(0,234,255,0.14)" stroke-width="0.5"/>
          <polygon points="98.7,134.9 98.7,144.9 90.0,149.9 81.3,144.9 81.3,134.9 90.0,129.9" fill="none" stroke="rgba(0,234,255,0.14)" stroke-width="0.5"/>
          <polygon points="113.7,126.2 113.7,136.2 105.0,141.2 96.3,136.2 96.3,126.2 105.0,121.2" fill="none" stroke="rgba(0,234,255,0.14)" stroke-width="0.5"/>
          <polygon points="128.7,134.9 128.7,144.9 120.0,149.9 111.3,144.9 111.3,134.9 120.0,129.9" fill="none" stroke="rgba(0,234,255,0.14)" stroke-width="0.5"/>
          <polygon points="143.7,126.2 143.7,136.2 135.0,141.2 126.3,136.2 126.3,126.2 135.0,121.2" fill="none" stroke="rgba(0,234,255,0.14)" stroke-width="0.5"/>
          <polygon points="158.7,134.9 158.7,144.9 150.0,149.9 141.3,144.9 141.3,134.9 150.0,129.9" fill="none" stroke="rgba(0,234,255,0.14)" stroke-width="0.5"/>
          <polygon points="23.7,143.6 23.7,153.6 15.0,158.6 6.3,153.6 6.3,143.6 15.0,138.6" fill="none" stroke="rgba(0,234,255,0.14)" stroke-width="0.5"/>
          <polygon points="38.7,152.2 38.7,162.2 30.0,167.2 21.3,162.2 21.3,152.2 30.0,147.2" fill="none" stroke="rgba(0,234,255,0.14)" stroke-width="0.5"/>
          <polygon points="53.7,143.6 53.7,153.6 45.0,158.6 36.3,153.6 36.3,143.6 45.0,138.6" fill="none" stroke="rgba(0,234,255,0.14)" stroke-width="0.5"/>
          <polygon points="68.7,152.2 68.7,162.2 60.0,167.2 51.3,162.2 51.3,152.2 60.0,147.2" fill="none" stroke="rgba(0,234,255,0.14)" stroke-width="0.5"/>
          <polygon points="83.7,143.6 83.7,153.6 75.0,158.6 66.3,153.6 66.3,143.6 75.0,138.6" fill="none" stroke="rgba(0,234,255,0.14)" stroke-width="0.5"/>
          <polygon points="98.7,152.2 98.7,162.2 90.0,167.2 81.3,162.2 81.3,152.2 90.0,147.2" fill="none" stroke="rgba(0,234,255,0.14)" stroke-width="0.5"/>
          <polygon points="113.7,143.6 113.7,153.6 105.0,158.6 96.3,153.6 96.3,143.6 105.0,138.6" fill="none" stroke="rgba(0,234,255,0.14)" stroke-width="0.5"/>
          <polygon points="128.7,152.2 128.7,162.2 120.0,167.2 111.3,162.2 111.3,152.2 120.0,147.2" fill="none" stroke="rgba(0,234,255,0.14)" stroke-width="0.5"/>
          <polygon points="143.7,143.6 143.7,153.6 135.0,158.6 126.3,153.6 126.3,143.6 135.0,138.6" fill="none" stroke="rgba(0,234,255,0.14)" stroke-width="0.5"/>
          <polygon points="158.7,152.2 158.7,162.2 150.0,167.2 141.3,162.2 141.3,152.2 150.0,147.2" fill="none" stroke="rgba(0,234,255,0.14)" stroke-width="0.5"/>
          <polygon points="23.7,160.9 23.7,170.9 15.0,175.9 6.3,170.9 6.3,160.9 15.0,155.9" fill="none" stroke="rgba(0,234,255,0.14)" stroke-width="0.5"/>
          <polygon points="38.7,169.5 38.7,179.5 30.0,184.5 21.3,179.5 21.3,169.5 30.0,164.5" fill="none" stroke="rgba(0,234,255,0.14)" stroke-width="0.5"/>
          <polygon points="53.7,160.9 53.7,170.9 45.0,175.9 36.3,170.9 36.3,160.9 45.0,155.9" fill="none" stroke="rgba(0,234,255,0.14)" stroke-width="0.5"/>
          <polygon points="68.7,169.5 68.7,179.5 60.0,184.5 51.3,179.5 51.3,169.5 60.0,164.5" fill="none" stroke="rgba(0,234,255,0.14)" stroke-width="0.5"/>
          <polygon points="83.7,160.9 83.7,170.9 75.0,175.9 66.3,170.9 66.3,160.9 75.0,155.9" fill="none" stroke="rgba(0,234,255,0.14)" stroke-width="0.5"/>
          <polygon points="98.7,169.5 98.7,179.5 90.0,184.5 81.3,179.5 81.3,169.5 90.0,164.5" fill="none" stroke="rgba(0,234,255,0.14)" stroke-width="0.5"/>
          <polygon points="113.7,160.9 113.7,170.9 105.0,175.9 96.3,170.9 96.3,160.9 105.0,155.9" fill="none" stroke="rgba(0,234,255,0.14)" stroke-width="0.5"/>
          <polygon points="128.7,169.5 128.7,179.5 120.0,184.5 111.3,179.5 111.3,169.5 120.0,164.5" fill="none" stroke="rgba(0,234,255,0.14)" stroke-width="0.5"/>
          <polygon points="143.7,160.9 143.7,170.9 135.0,175.9 126.3,170.9 126.3,160.9 135.0,155.9" fill="none" stroke="rgba(0,234,255,0.14)" stroke-width="0.5"/>
          <polygon points="158.7,169.5 158.7,179.5 150.0,184.5 141.3,179.5 141.3,169.5 150.0,164.5" fill="none" stroke="rgba(0,234,255,0.14)" stroke-width="0.5"/>
          <polygon points="23.7,178.2 23.7,188.2 15.0,193.2 6.3,188.2 6.3,178.2 15.0,173.2" fill="none" stroke="rgba(0,234,255,0.14)" stroke-width="0.5"/>
          <polygon points="38.7,186.9 38.7,196.9 30.0,201.9 21.3,196.9 21.3,186.9 30.0,181.9" fill="none" stroke="rgba(0,234,255,0.14)" stroke-width="0.5"/>
          <polygon points="53.7,178.2 53.7,188.2 45.0,193.2 36.3,188.2 36.3,178.2 45.0,173.2" fill="none" stroke="rgba(0,234,255,0.14)" stroke-width="0.5"/>
          <polygon points="68.7,186.9 68.7,196.9 60.0,201.9 51.3,196.9 51.3,186.9 60.0,181.9" fill="none" stroke="rgba(0,234,255,0.14)" stroke-width="0.5"/>
          <polygon points="83.7,178.2 83.7,188.2 75.0,193.2 66.3,188.2 66.3,178.2 75.0,173.2" fill="none" stroke="rgba(0,234,255,0.14)" stroke-width="0.5"/>
          <polygon points="98.7,186.9 98.7,196.9 90.0,201.9 81.3,196.9 81.3,186.9 90.0,181.9" fill="none" stroke="rgba(0,234,255,0.14)" stroke-width="0.5"/>
          <polygon points="113.7,178.2 113.7,188.2 105.0,193.2 96.3,188.2 96.3,178.2 105.0,173.2" fill="none" stroke="rgba(0,234,255,0.14)" stroke-width="0.5"/>
          <polygon points="128.7,186.9 128.7,196.9 120.0,201.9 111.3,196.9 111.3,186.9 120.0,181.9" fill="none" stroke="rgba(0,234,255,0.14)" stroke-width="0.5"/>
          <polygon points="143.7,178.2 143.7,188.2 135.0,193.2 126.3,188.2 126.3,178.2 135.0,173.2" fill="none" stroke="rgba(0,234,255,0.14)" stroke-width="0.5"/>
          <polygon points="158.7,186.9 158.7,196.9 150.0,201.9 141.3,196.9 141.3,186.9 150.0,181.9" fill="none" stroke="rgba(0,234,255,0.14)" stroke-width="0.5"/>
          <polygon points="23.7,195.5 23.7,205.5 15.0,210.5 6.3,205.5 6.3,195.5 15.0,190.5" fill="none" stroke="rgba(0,234,255,0.14)" stroke-width="0.5"/>
          <polygon points="38.7,204.2 38.7,214.2 30.0,219.2 21.3,214.2 21.3,204.2 30.0,199.2" fill="none" stroke="rgba(0,234,255,0.14)" stroke-width="0.5"/>
          <polygon points="53.7,195.5 53.7,205.5 45.0,210.5 36.3,205.5 36.3,195.5 45.0,190.5" fill="none" stroke="rgba(0,234,255,0.14)" stroke-width="0.5"/>
          <polygon points="68.7,204.2 68.7,214.2 60.0,219.2 51.3,214.2 51.3,204.2 60.0,199.2" fill="none" stroke="rgba(0,234,255,0.14)" stroke-width="0.5"/>
          <polygon points="83.7,195.5 83.7,205.5 75.0,210.5 66.3,205.5 66.3,195.5 75.0,190.5" fill="none" stroke="rgba(0,234,255,0.14)" stroke-width="0.5"/>
          <polygon points="98.7,204.2 98.7,214.2 90.0,219.2 81.3,214.2 81.3,204.2 90.0,199.2" fill="none" stroke="rgba(0,234,255,0.14)" stroke-width="0.5"/>
          <polygon points="113.7,195.5 113.7,205.5 105.0,210.5 96.3,205.5 96.3,195.5 105.0,190.5" fill="none" stroke="rgba(0,234,255,0.14)" stroke-width="0.5"/>
          <polygon points="128.7,204.2 128.7,214.2 120.0,219.2 111.3,214.2 111.3,204.2 120.0,199.2" fill="none" stroke="rgba(0,234,255,0.14)" stroke-width="0.5"/>
          <polygon points="143.7,195.5 143.7,205.5 135.0,210.5 126.3,205.5 126.3,195.5 135.0,190.5" fill="none" stroke="rgba(0,234,255,0.14)" stroke-width="0.5"/>
          <polygon points="158.7,204.2 158.7,214.2 150.0,219.2 141.3,214.2 141.3,204.2 150.0,199.2" fill="none" stroke="rgba(0,234,255,0.14)" stroke-width="0.5"/>
          <polygon points="23.7,212.8 23.7,222.8 15.0,227.8 6.3,222.8 6.3,212.8 15.0,207.8" fill="none" stroke="rgba(0,234,255,0.14)" stroke-width="0.5"/>
          <polygon points="38.7,221.5 38.7,231.5 30.0,236.5 21.3,231.5 21.3,221.5 30.0,216.5" fill="none" stroke="rgba(0,234,255,0.14)" stroke-width="0.5"/>
          <polygon points="53.7,212.8 53.7,222.8 45.0,227.8 36.3,222.8 36.3,212.8 45.0,207.8" fill="none" stroke="rgba(0,234,255,0.14)" stroke-width="0.5"/>
          <polygon points="68.7,221.5 68.7,231.5 60.0,236.5 51.3,231.5 51.3,221.5 60.0,216.5" fill="none" stroke="rgba(0,234,255,0.14)" stroke-width="0.5"/>
          <polygon points="83.7,212.8 83.7,222.8 75.0,227.8 66.3,222.8 66.3,212.8 75.0,207.8" fill="none" stroke="rgba(0,234,255,0.14)" stroke-width="0.5"/>
          <polygon points="98.7,221.5 98.7,231.5 90.0,236.5 81.3,231.5 81.3,221.5 90.0,216.5" fill="none" stroke="rgba(0,234,255,0.14)" stroke-width="0.5"/>
          <polygon points="113.7,212.8 113.7,222.8 105.0,227.8 96.3,222.8 96.3,212.8 105.0,207.8" fill="none" stroke="rgba(0,234,255,0.14)" stroke-width="0.5"/>
          <polygon points="128.7,221.5 128.7,231.5 120.0,236.5 111.3,231.5 111.3,221.5 120.0,216.5" fill="none" stroke="rgba(0,234,255,0.14)" stroke-width="0.5"/>
          <polygon points="143.7,212.8 143.7,222.8 135.0,227.8 126.3,222.8 126.3,212.8 135.0,207.8" fill="none" stroke="rgba(0,234,255,0.14)" stroke-width="0.5"/>
          <polygon points="158.7,221.5 158.7,231.5 150.0,236.5 141.3,231.5 141.3,221.5 150.0,216.5" fill="none" stroke="rgba(0,234,255,0.14)" stroke-width="0.5"/>
          <polygon points="23.7,230.2 23.7,240.2 15.0,245.2 6.3,240.2 6.3,230.2 15.0,225.2" fill="none" stroke="rgba(0,234,255,0.14)" stroke-width="0.5"/>
          <polygon points="38.7,238.8 38.7,248.8 30.0,253.8 21.3,248.8 21.3,238.8 30.0,233.8" fill="none" stroke="rgba(0,234,255,0.14)" stroke-width="0.5"/>
          <polygon points="53.7,230.2 53.7,240.2 45.0,245.2 36.3,240.2 36.3,230.2 45.0,225.2" fill="none" stroke="rgba(0,234,255,0.14)" stroke-width="0.5"/>
          <polygon points="68.7,238.8 68.7,248.8 60.0,253.8 51.3,248.8 51.3,238.8 60.0,233.8" fill="none" stroke="rgba(0,234,255,0.14)" stroke-width="0.5"/>
          <polygon points="83.7,230.2 83.7,240.2 75.0,245.2 66.3,240.2 66.3,230.2 75.0,225.2" fill="none" stroke="rgba(0,234,255,0.14)" stroke-width="0.5"/>
          <polygon points="98.7,238.8 98.7,248.8 90.0,253.8 81.3,248.8 81.3,238.8 90.0,233.8" fill="none" stroke="rgba(0,234,255,0.14)" stroke-width="0.5"/>
          <polygon points="113.7,230.2 113.7,240.2 105.0,245.2 96.3,240.2 96.3,230.2 105.0,225.2" fill="none" stroke="rgba(0,234,255,0.14)" stroke-width="0.5"/>
          <polygon points="128.7,238.8 128.7,248.8 120.0,253.8 111.3,248.8 111.3,238.8 120.0,233.8" fill="none" stroke="rgba(0,234,255,0.14)" stroke-width="0.5"/>
          <polygon points="143.7,230.2 143.7,240.2 135.0,245.2 126.3,240.2 126.3,230.2 135.0,225.2" fill="none" stroke="rgba(0,234,255,0.14)" stroke-width="0.5"/>
          <polygon points="158.7,238.8 158.7,248.8 150.0,253.8 141.3,248.8 141.3,238.8 150.0,233.8" fill="none" stroke="rgba(0,234,255,0.14)" stroke-width="0.5"/>
          <polygon points="23.7,247.5 23.7,257.5 15.0,262.5 6.3,257.5 6.3,247.5 15.0,242.5" fill="none" stroke="rgba(0,234,255,0.14)" stroke-width="0.5"/>
          <polygon points="38.7,256.1 38.7,266.1 30.0,271.1 21.3,266.1 21.3,256.1 30.0,251.1" fill="none" stroke="rgba(0,234,255,0.14)" stroke-width="0.5"/>
          <polygon points="53.7,247.5 53.7,257.5 45.0,262.5 36.3,257.5 36.3,247.5 45.0,242.5" fill="none" stroke="rgba(0,234,255,0.14)" stroke-width="0.5"/>
          <polygon points="68.7,256.1 68.7,266.1 60.0,271.1 51.3,266.1 51.3,256.1 60.0,251.1" fill="none" stroke="rgba(0,234,255,0.14)" stroke-width="0.5"/>
          <polygon points="83.7,247.5 83.7,257.5 75.0,262.5 66.3,257.5 66.3,247.5 75.0,242.5" fill="none" stroke="rgba(0,234,255,0.14)" stroke-width="0.5"/>
          <polygon points="98.7,256.1 98.7,266.1 90.0,271.1 81.3,266.1 81.3,256.1 90.0,251.1" fill="none" stroke="rgba(0,234,255,0.14)" stroke-width="0.5"/>
          <polygon points="113.7,247.5 113.7,257.5 105.0,262.5 96.3,257.5 96.3,247.5 105.0,242.5" fill="none" stroke="rgba(0,234,255,0.14)" stroke-width="0.5"/>
          <polygon points="128.7,256.1 128.7,266.1 120.0,271.1 111.3,266.1 111.3,256.1 120.0,251.1" fill="none" stroke="rgba(0,234,255,0.14)" stroke-width="0.5"/>
          <polygon points="143.7,247.5 143.7,257.5 135.0,262.5 126.3,257.5 126.3,247.5 135.0,242.5" fill="none" stroke="rgba(0,234,255,0.14)" stroke-width="0.5"/>
          <polygon points="158.7,256.1 158.7,266.1 150.0,271.1 141.3,266.1 141.3,256.1 150.0,251.1" fill="none" stroke="rgba(0,234,255,0.14)" stroke-width="0.5"/>
          <polygon points="23.7,264.8 23.7,274.8 15.0,279.8 6.3,274.8 6.3,264.8 15.0,259.8" fill="none" stroke="rgba(0,234,255,0.14)" stroke-width="0.5"/>
          <polygon points="38.7,273.5 38.7,283.5 30.0,288.5 21.3,283.5 21.3,273.5 30.0,268.5" fill="none" stroke="rgba(0,234,255,0.14)" stroke-width="0.5"/>
          <polygon points="53.7,264.8 53.7,274.8 45.0,279.8 36.3,274.8 36.3,264.8 45.0,259.8" fill="none" stroke="rgba(0,234,255,0.14)" stroke-width="0.5"/>
          <polygon points="68.7,273.5 68.7,283.5 60.0,288.5 51.3,283.5 51.3,273.5 60.0,268.5" fill="none" stroke="rgba(0,234,255,0.14)" stroke-width="0.5"/>
          <polygon points="83.7,264.8 83.7,274.8 75.0,279.8 66.3,274.8 66.3,264.8 75.0,259.8" fill="none" stroke="rgba(0,234,255,0.14)" stroke-width="0.5"/>
          <polygon points="98.7,273.5 98.7,283.5 90.0,288.5 81.3,283.5 81.3,273.5 90.0,268.5" fill="none" stroke="rgba(0,234,255,0.14)" stroke-width="0.5"/>
          <polygon points="113.7,264.8 113.7,274.8 105.0,279.8 96.3,274.8 96.3,264.8 105.0,259.8" fill="none" stroke="rgba(0,234,255,0.14)" stroke-width="0.5"/>
          <polygon points="128.7,273.5 128.7,283.5 120.0,288.5 111.3,283.5 111.3,273.5 120.0,268.5" fill="none" stroke="rgba(0,234,255,0.14)" stroke-width="0.5"/>
          <polygon points="143.7,264.8 143.7,274.8 135.0,279.8 126.3,274.8 126.3,264.8 135.0,259.8" fill="none" stroke="rgba(0,234,255,0.14)" stroke-width="0.5"/>
          <polygon points="158.7,273.5 158.7,283.5 150.0,288.5 141.3,283.5 141.3,273.5 150.0,268.5" fill="none" stroke="rgba(0,234,255,0.14)" stroke-width="0.5"/>
          <polygon points="23.7,282.1 23.7,292.1 15.0,297.1 6.3,292.1 6.3,282.1 15.0,277.1" fill="none" stroke="rgba(0,234,255,0.14)" stroke-width="0.5"/>
          <polygon points="38.7,290.8 38.7,300.8 30.0,305.8 21.3,300.8 21.3,290.8 30.0,285.8" fill="none" stroke="rgba(0,234,255,0.14)" stroke-width="0.5"/>
          <polygon points="53.7,282.1 53.7,292.1 45.0,297.1 36.3,292.1 36.3,282.1 45.0,277.1" fill="none" stroke="rgba(0,234,255,0.14)" stroke-width="0.5"/>
          <polygon points="68.7,290.8 68.7,300.8 60.0,305.8 51.3,300.8 51.3,290.8 60.0,285.8" fill="none" stroke="rgba(0,234,255,0.14)" stroke-width="0.5"/>
          <polygon points="83.7,282.1 83.7,292.1 75.0,297.1 66.3,292.1 66.3,282.1 75.0,277.1" fill="none" stroke="rgba(0,234,255,0.14)" stroke-width="0.5"/>
          <polygon points="98.7,290.8 98.7,300.8 90.0,305.8 81.3,300.8 81.3,290.8 90.0,285.8" fill="none" stroke="rgba(0,234,255,0.14)" stroke-width="0.5"/>
          <polygon points="113.7,282.1 113.7,292.1 105.0,297.1 96.3,292.1 96.3,282.1 105.0,277.1" fill="none" stroke="rgba(0,234,255,0.14)" stroke-width="0.5"/>
          <polygon points="128.7,290.8 128.7,300.8 120.0,305.8 111.3,300.8 111.3,290.8 120.0,285.8" fill="none" stroke="rgba(0,234,255,0.14)" stroke-width="0.5"/>
          <polygon points="143.7,282.1 143.7,292.1 135.0,297.1 126.3,292.1 126.3,282.1 135.0,277.1" fill="none" stroke="rgba(0,234,255,0.14)" stroke-width="0.5"/>
          <polygon points="158.7,290.8 158.7,300.8 150.0,305.8 141.3,300.8 141.3,290.8 150.0,285.8" fill="none" stroke="rgba(0,234,255,0.14)" stroke-width="0.5"/>
          <polygon points="23.7,299.4 23.7,309.4 15.0,314.4 6.3,309.4 6.3,299.4 15.0,294.4" fill="none" stroke="rgba(0,234,255,0.14)" stroke-width="0.5"/>
          <polygon points="38.7,308.1 38.7,318.1 30.0,323.1 21.3,318.1 21.3,308.1 30.0,303.1" fill="none" stroke="rgba(0,234,255,0.14)" stroke-width="0.5"/>
          <polygon points="53.7,299.4 53.7,309.4 45.0,314.4 36.3,309.4 36.3,299.4 45.0,294.4" fill="none" stroke="rgba(0,234,255,0.14)" stroke-width="0.5"/>
          <polygon points="68.7,308.1 68.7,318.1 60.0,323.1 51.3,318.1 51.3,308.1 60.0,303.1" fill="none" stroke="rgba(0,234,255,0.14)" stroke-width="0.5"/>
          <polygon points="83.7,299.4 83.7,309.4 75.0,314.4 66.3,309.4 66.3,299.4 75.0,294.4" fill="none" stroke="rgba(0,234,255,0.14)" stroke-width="0.5"/>
          <polygon points="98.7,308.1 98.7,318.1 90.0,323.1 81.3,318.1 81.3,308.1 90.0,303.1" fill="none" stroke="rgba(0,234,255,0.14)" stroke-width="0.5"/>
          <polygon points="113.7,299.4 113.7,309.4 105.0,314.4 96.3,309.4 96.3,299.4 105.0,294.4" fill="none" stroke="rgba(0,234,255,0.14)" stroke-width="0.5"/>
          <polygon points="128.7,308.1 128.7,318.1 120.0,323.1 111.3,318.1 111.3,308.1 120.0,303.1" fill="none" stroke="rgba(0,234,255,0.14)" stroke-width="0.5"/>
          <polygon points="143.7,299.4 143.7,309.4 135.0,314.4 126.3,309.4 126.3,299.4 135.0,294.4" fill="none" stroke="rgba(0,234,255,0.14)" stroke-width="0.5"/>
          <polygon points="158.7,308.1 158.7,318.1 150.0,323.1 141.3,318.1 141.3,308.1 150.0,303.1" fill="none" stroke="rgba(0,234,255,0.14)" stroke-width="0.5"/>
        </svg>
      </div>

    </div>

    <!-- Holographic UI Background Layers -->
    <div class="holo-bg-layer">
      <!-- 1. Glass Base -->
      <div class="glass-base"></div>

      <!-- 2a. Primary Holographic Grid -->
      <div class="holo-grid"></div>
      <!-- 2b. Diagonal Depth Grid -->
      <div class="holo-grid-diagonal"></div>

      <!-- Deep Vignette -->
      <div class="deep-vignette"></div>

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

      <!-- 5. Interactive Particle Field -->
      <canvas #particleCanvas class="particle-canvas"></canvas>

      <!-- 6. Radar Support Glow -->
      <div class="radar-ambient-glow"></div>
      <!-- Large off-center light source behind radar -->
      <div class="radar-light-source"></div>

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
          <radialGradient id="vertexPointGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stop-color="#00ffff" stop-opacity="0.8"/>
            <stop offset="100%" stop-color="#00ffff" stop-opacity="0"/>
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
        <polygon [attr.points]="radarPoints()" class="radar-polygon" filter="url(#radarGlow)" style="filter: drop-shadow(0 0 6px rgba(0,255,255,0.8));" />
        <polygon [attr.points]="radarPoints()" class="radar-polygon-edge" />

        <!-- Scanline Sweep -->
        <rect x="148" y="20" width="4" height="260" class="radar-scanline" />

        <!-- Vertex Dots + Hover Zones -->
        <g *ngFor="let v of vertexData(); let i = index">
          <circle [attr.cx]="v.x" [attr.cy]="v.y" r="4" class="stat-vertex"
          [class.vertex-hovered]="hoveredStat() === i" filter="url(#vertexGlow)"
          (mouseenter)="hoveredStat.set(i)" (mouseleave)="hoveredStat.set(-1)" />
          <circle [attr.cx]="v.x" [attr.cy]="v.y" r="18" fill="transparent"
          (mouseenter)="hoveredStat.set(i)" (mouseleave)="hoveredStat.set(-1)" style="cursor: pointer;" />
        </g>

        <!-- Vertex Point Glows -->
        <circle *ngFor="let v of vertexData()" [attr.cx]="v.x" [attr.cy]="v.y" r="10"
          fill="url(#vertexPointGlow)" class="vertex-point-glow" pointer-events="none"/>

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
export class HunterStatusPanelComponent implements AfterViewInit, OnDestroy {
  state = inject(SystemStateService);
  bossService = inject(BossService);
  xpEngine = inject(XpEngineService);
  authService = inject(AuthService);
  toastService = inject(ToastService);
  router = inject(Router);

  // Particle canvas
  @ViewChild('particleCanvas', { static: false }) particleCanvasRef!: ElementRef<HTMLCanvasElement>;
  private ngZone = inject(NgZone);
  private particles: Array<{x:number,y:number,vx:number,vy:number,baseVx:number,baseVy:number,r:number,alpha:number}> = [];
  private mouseX = -9999;
  private mouseY = -9999;
  private animFrameId = 0;
  private canvasW = 0;
  private canvasH = 0;

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
  this.initParticleField();
  }

  ngOnDestroy() {
    if (this.animFrameId) cancelAnimationFrame(this.animFrameId);
  }

  onPanelMouseMove(e: MouseEvent) {
    const el = (e.currentTarget as HTMLElement);
    const rect = el.getBoundingClientRect();
    this.mouseX = e.clientX - rect.left;
    this.mouseY = e.clientY - rect.top;
  }

  onPanelMouseLeave() {
    this.mouseX = -9999;
    this.mouseY = -9999;
  }

  private initParticleField() {
    const canvas = this.particleCanvasRef?.nativeElement;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      const parent = canvas.parentElement;
      if (!parent) return;
      this.canvasW = parent.clientWidth;
      this.canvasH = parent.clientHeight;
      canvas.width = this.canvasW;
      canvas.height = this.canvasH;
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas.parentElement!);

    // Init 75 particles — sharp white dots, fast drift
    const count = 150;
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 1.2 + Math.random() * 0.8; // 1.2 to 2.0
      const vx = Math.cos(angle) * speed;
      const vy = Math.sin(angle) * speed;
      this.particles.push({
        x: Math.random() * this.canvasW,
        y: Math.random() * this.canvasH,
        vx, vy,
        baseVx: vx,
        baseVy: vy,
        r: 1 + Math.random() * 0.8, // 1 to 1.8
        alpha: 0.45 + Math.random() * 0.3 // 0.45 to 0.75
      });
    }

    this.ngZone.runOutsideAngular(() => {
      const loop = () => {
        this.renderParticles(ctx);
        this.animFrameId = requestAnimationFrame(loop);
      };
      this.animFrameId = requestAnimationFrame(loop);
    });
  }

  private renderParticles(ctx: CanvasRenderingContext2D) {
    const w = this.canvasW;
    const h = this.canvasH;
    if (w === 0 || h === 0) return;

    ctx.clearRect(0, 0, w, h);
    const mx = this.mouseX;
    const my = this.mouseY;
    const detectR = 220;
    const pushMax = 6.0;
    // Decay factor: ~1.5s to bleed off at 60fps => 0.978 per frame
    const decay = 0.989;

    for (const p of this.particles) {
      // Mouse repulsion — snappy scatter
      const dx = p.x - mx;
      const dy = p.y - my;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < detectR && dist > 0) {
        const force = (1 - dist / detectR) * pushMax;
        const nx = dx / dist;
        const ny = dy / dist;
        p.vx += nx * force * 0.18;
        p.vy += ny * force * 0.18;
      }

      // Blend velocity back toward base drift over ~1.5s
      p.vx = p.baseVx + (p.vx - p.baseVx) * decay;
      p.vy = p.baseVy + (p.vy - p.baseVy) * decay;

      // Hard clamp max velocity
      const speed = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
      if (speed > pushMax) {
        p.vx = (p.vx / speed) * pushMax;
        p.vy = (p.vy / speed) * pushMax;
      }

      p.x += p.vx;
      p.y += p.vy;

      // Wrap edges
      if (p.x < -2) p.x = w + 2;
      if (p.x > w + 2) p.x = -2;
      if (p.y < -2) p.y = h + 2;
      if (p.y > h + 2) p.y = -2;

      // Draw sharp solid circle — no gradient, no blur
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(255,255,255,' + p.alpha + ')';
      ctx.fill();
    }
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
