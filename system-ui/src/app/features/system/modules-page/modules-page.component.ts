import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ModuleService } from '../../../core/services/module.service';
import { CreateModuleComponent } from '../create-module/create-module.component';

@Component({
  selector: 'app-modules-page',
  standalone: true,
  imports: [CommonModule, RouterModule, CreateModuleComponent],
  template: `
    <div class="modules-page-container">
      <div class="panel-header">
        <h1 class="panel-title">SYSTEM MODULES</h1>
      </div>

      <div class="hud-panel active-modules-section">
        <div class="section-header">
          <h2 class="section-title">ACTIVE MODULES</h2>
          <button class="add-module-btn glow-hover" (click)="createModule()">
            + CREATE NEW MODULE
          </button>
        </div>

        <div class="modules-grid">
          <div *ngFor="let module of customModules()"
               class="hud-panel module-card glow-hover"
               [routerLink]="['/system/module', module._id]">
            <div class="card-glow"></div>
            <div class="module-info">
              <h3 class="module-name">
                <span class="module-icon" style="margin-right: 0.5rem">{{ module.icon }}</span>
                {{ module.name }}
              </h3>
              <p class="module-desc">Category: {{ module.category | uppercase }}</p>
              <div class="module-footer">
                <div class="streak-badge" *ngIf="module.features?.streak">
                  <span class="system-label">STREAK:</span>
                  <span class="system-value glow-text">0</span>
                </div>
                <span class="enter-hint">ENTER >></span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <app-create-module 
      *ngIf="showCreateModule()" 
      (close)="showCreateModule.set(false)" 
      (moduleCreated)="onModuleCreated()">
    </app-create-module>
  `,
  styles: [`
    @use '../../../shared/styles/system-theme' as *;

    .modules-page-container {
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

    .active-modules-section {
      padding: 2rem;
      background: rgba(5, 15, 30, 0.4);
    }

    .section-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 2rem;
      border-bottom: 1px solid rgba(0, 234, 255, 0.1);
      padding-bottom: 1rem;
    }

    .section-title {
      font-family: 'Orbitron', sans-serif;
      font-size: 1.5rem;
      color: #00eaff;
      margin: 0;
      letter-spacing: 2px;
    }

    .add-module-btn {
      background: rgba(0, 234, 255, 0.05);
      border: 1px solid rgba(0, 234, 255, 0.3);
      color: #00eaff;
      padding: 0.6rem 1.2rem;
      font-family: 'Orbitron', sans-serif;
      font-size: 0.85rem;
      cursor: pointer;
      letter-spacing: 1px;
      transition: all 0.3s ease;

      &:hover {
        background: rgba(0, 234, 255, 0.2);
        box-shadow: 0 0 15px rgba(0, 234, 255, 0.3);
        border-color: #00eaff;
      }
    }

    .modules-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
      gap: 2rem;
    }

    .module-card {
      position: relative;
      cursor: pointer;
      padding: 24px;
      min-height: 180px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
      overflow: hidden;
      background: rgba(10, 20, 40, 0.6);
      border: 1px solid rgba(0, 234, 255, 0.1);

      &::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: linear-gradient(135deg, rgba(0, 234, 255, 0.05), transparent);
        z-index: 0;
      }

      &:hover {
        transform: translateY(-8px) scale(1.02);
        border-color: #00eaff;
        box-shadow: 0 0 25px rgba(0, 234, 255, 0.2), inset 0 0 20px rgba(0, 234, 255, 0.05);
        
        .enter-hint {
          opacity: 1;
          transform: translateX(0);
        }

        .card-glow {
          opacity: 0.6;
        }
      }
    }

    .card-glow {
      position: absolute;
      top: -50%;
      left: -50%;
      width: 200%;
      height: 200%;
      background: radial-gradient(circle, rgba(0, 234, 255, 0.1) 0%, transparent 70%);
      opacity: 0;
      transition: opacity 0.4s ease;
      pointer-events: none;
      z-index: 1;
    }

    .module-info {
      position: relative;
      z-index: 2;
      display: flex;
      flex-direction: column;
      height: 100%;
    }

    .module-name {
      font-family: 'Orbitron', sans-serif;
      font-size: 1.4rem;
      color: #00eaff;
      margin-bottom: 0.8rem;
      letter-spacing: 2px;
      text-shadow: 0 0 8px rgba(0, 234, 255, 0.3);
    }

    .module-desc {
      font-size: 0.95rem;
      color: rgba(180, 210, 230, 0.8);
      line-height: 1.4;
      margin-bottom: 1.5rem;
      font-family: 'Rajdhani', sans-serif;
    }

    .module-footer {
      margin-top: auto;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .system-label {
      font-family: 'Orbitron', sans-serif;
      font-size: 0.75rem;
      color: rgba(180, 210, 230, 0.5);
      letter-spacing: 1px;
    }

    .system-value {
      font-family: 'Rajdhani', sans-serif;
      font-weight: 700;
      color: #00eaff;
    }

    .enter-hint {
      font-family: 'Rajdhani', sans-serif;
      font-weight: 700;
      font-size: 0.9rem;
      color: #00eaff;
      opacity: 0;
      transform: translateX(-10px);
      transition: all 0.3s ease;
    }
  `]
})
export class ModulesPageComponent implements OnInit {
  private moduleService = inject(ModuleService);
  
  customModules = signal<any[]>([]);
  showCreateModule = signal(false);

  ngOnInit() {
    this.reloadModules();
  }

  createModule() {
    this.showCreateModule.set(true);
  }

  onModuleCreated() {
    this.showCreateModule.set(false);
    this.reloadModules();
  }

  reloadModules() {
    this.moduleService.getModules().subscribe((res: any) => {
      if (res) {
        this.customModules.set(res);
      }
    });
  }
}
