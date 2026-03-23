import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../../../core/services/auth.service';

@Component({
  selector: 'app-system-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <nav class="sidebar" [class.collapsed]="collapsed()">
      <button class="toggle-btn" (click)="collapsed.set(!collapsed())">
        {{ collapsed() ? '▶' : '◀' }}
      </button>
      <div class="sidebar-brand" *ngIf="!collapsed()">
        <span class="brand-icon">⚔</span>
        <span class="brand-text">SYSTEM</span>
      </div>
      <div class="nav-links">
        <a routerLink="/system" routerLinkActive="active" [routerLinkActiveOptions]="{exact: true}" class="nav-item" title="Dashboard">
          <span class="nav-icon">◆</span>
          <span class="nav-label" *ngIf="!collapsed()">DASHBOARD</span>
        </a>
        <a routerLink="/system/tasks" routerLinkActive="active" class="nav-item" title="Tasks">
          <span class="nav-icon">📜</span>
          <span class="nav-label" *ngIf="!collapsed()">TASKS</span>
        </a>
        <a routerLink="/system/templates" routerLinkActive="active" class="nav-item" title="Templates">
          <span class="nav-icon">📋</span>
          <span class="nav-label" *ngIf="!collapsed()">TEMPLATES</span>
        </a>
        <a routerLink="/system/analytics" routerLinkActive="active" class="nav-item" title="Analytics">
          <span class="nav-icon">◈</span>
          <span class="nav-label" *ngIf="!collapsed()">ANALYTICS</span>
        </a>
        <a routerLink="/system/journal" routerLinkActive="active" class="nav-item" title="Journal">
          <span class="nav-icon">◇</span>
          <span class="nav-label" *ngIf="!collapsed()">JOURNAL</span>
        </a>
        <a routerLink="/system/profile" routerLinkActive="active" class="nav-item" title="Profile">
          <span class="nav-icon">◎</span>
          <span class="nav-label" *ngIf="!collapsed()">PROFILE</span>
        </a>
        <div class="nav-divider"></div>
        <span class="nav-section" *ngIf="!collapsed()">MODULES</span>
        <a routerLink="/system/modules" routerLinkActive="active" class="nav-item" title="Modules">
          <span class="nav-icon">⧉</span>
          <span class="nav-label" *ngIf="!collapsed()">ALL MODULES</span>
        </a>
        <a routerLink="/system/books" routerLinkActive="active" class="nav-item" title="Books">
          <span class="nav-icon">📖</span>
          <span class="nav-label" *ngIf="!collapsed()">BOOKS</span>
        </a>
        <a routerLink="/system/dsa" routerLinkActive="active" class="nav-item" title="DSA">
          <span class="nav-icon">⚡</span>
          <span class="nav-label" *ngIf="!collapsed()">DSA</span>
        </a>
        <a routerLink="/system/skills" routerLinkActive="active" class="nav-item" title="Skills">
          <span class="nav-icon">🎯</span>
          <span class="nav-label" *ngIf="!collapsed()">SKILLS</span>
        </a>
      </div>
      <div class="sidebar-footer">
        <button class="nav-item logout-btn" (click)="logout()" title="Logout">
          <span class="nav-icon">⏻</span>
          <span class="nav-label" *ngIf="!collapsed()">LOGOUT</span>
        </button>
      </div>
    </nav>
  `,
  styles: [`
    :host { display: block; height: 100vh; position: fixed; left: 0; top: 0; z-index: 100; }
    .sidebar {
      width: 220px; height: 100vh;
      background: rgba(5, 10, 25, 0.95);
      border-right: 1px solid rgba(0, 200, 255, 0.15);
      backdrop-filter: blur(20px);
      display: flex; flex-direction: column; padding: 1rem 0;
      transition: width 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      box-shadow: 4px 0 20px rgba(0, 150, 255, 0.08);
    }
    .sidebar.collapsed { width: 60px; }
    .sidebar.collapsed .nav-item { justify-content: center; padding: 0.75rem 0; }
    .toggle-btn {
      background: transparent; border: none; color: rgba(0, 200, 255, 0.6);
      cursor: pointer; padding: 0.5rem; text-align: right; font-size: 0.7rem; margin: 0 0.5rem 0.5rem;
    }
    .toggle-btn:hover { color: #00c8ff; }
    .sidebar-brand {
      display: flex; align-items: center; gap: 0.75rem;
      padding: 0.5rem 1.25rem 1.5rem;
      border-bottom: 1px solid rgba(0, 200, 255, 0.1); margin-bottom: 1rem;
    }
    .brand-icon { font-size: 1.4rem; filter: drop-shadow(0 0 6px rgba(0,200,255,0.5)); }
    .brand-text {
      font-family: 'Orbitron', sans-serif; font-size: 1rem; color: #00c8ff;
      letter-spacing: 3px; text-shadow: 0 0 10px rgba(0, 200, 255, 0.4);
    }
    .nav-links { flex: 1; display: flex; flex-direction: column; gap: 4px; padding: 0 0.5rem; overflow-y: auto; }
    .nav-item {
      display: flex; 
      align-items: center; 
      gap: 1rem;
      padding: 0.8rem 1rem; 
      color: rgba(180, 200, 220, 0.7);
      text-decoration: none; 
      font-family: 'Rajdhani', sans-serif;
      font-size: 0.85rem; 
      font-weight: 600; 
      letter-spacing: 1.5px;
      border-radius: 6px; 
      transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
      cursor: pointer; 
      border: 1px solid transparent;
      border-left: 3px solid transparent;
      height: 44px; // Consistent height for center alignment
    }
    
    .nav-icon { 
      font-size: 1.1rem; 
      width: 24px; 
      height: 24px; 
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
      transition: all 0.2s ease; 
    }

    .nav-label { 
      white-space: nowrap; 
      line-height: 1;
      display: flex;
      align-items: center;
    }

    .nav-item:hover { 
      color: #00eaff; 
      background: rgba(0, 234, 255, 0.05); 
      border-left-color: rgba(0, 234, 255, 0.2);
      
      .nav-icon {
        transform: scale(1.1);
        filter: drop-shadow(0 0 5px rgba(0, 234, 255, 0.4));
      }
    }
    
    .nav-item.active {
      color: #00eaff;
      background: linear-gradient(90deg, rgba(0, 234, 255, 0.1) 0%, transparent 100%);
      border-left-color: #00eaff;
      border-radius: 0 6px 6px 0;
      box-shadow: inset 4px 0 10px rgba(0, 234, 255, 0.05);
      text-shadow: 0 0 10px rgba(0, 234, 255, 0.5);
      
      .nav-icon {
        color: #00eaff;
        filter: drop-shadow(0 0 5px rgba(0, 234, 255, 0.8));
        transform: scale(1.05);
      }
    }

    .nav-divider { 
      height: 1px; 
      background: rgba(0, 200, 255, 0.05); 
      margin: 1.25rem 0.5rem 0.5rem; 
    }
    .nav-section {
      padding: 0.25rem 1rem; 
      font-family: 'Orbitron', sans-serif;
      font-size: 0.6rem; 
      color: rgba(0, 200, 255, 0.3); 
      letter-spacing: 2px;
      text-transform: uppercase;
      margin-top: 0.25rem;
    }
    .sidebar-footer { padding: 0.5rem; border-top: 1px solid rgba(0, 200, 255, 0.1); }
    .logout-btn { 
      width: 100%; 
      background: transparent; 
      border: 1px solid transparent; 
      color: rgba(255, 100, 100, 0.6); 
      border-left-width: 0; 
      justify-content: flex-start;
    }
    .logout-btn:hover { color: #ff4444; background: rgba(255, 68, 68, 0.08); border-color: rgba(255, 68, 68, 0.2); }
    
    @media (max-width: 768px) {
      .sidebar { width: 60px; }
      .nav-label, .sidebar-brand, .nav-section { display: none !important; }
      .nav-item { justify-content: center; padding: 0.75rem 0; border-left-width: 0; }
    }
  `]
})
export class SystemSidebarComponent {
  private authService = inject(AuthService);
  private router = inject(Router);
  collapsed = signal(false);

  logout() {
    this.authService.logout();
    this.router.navigate(['/']);
  }
}
