import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../../../core/services/auth.service';
import { UserService } from '../../../../core/services/user.service';
import { RankEngineService, HunterRank } from '../../../../core/services/rank-engine.service';

@Component({
  selector: 'app-system-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <nav class="sidebar" [class.collapsed]="collapsed()">
      <!-- Holographic Overlay / Scanline -->
      <div class="hologram-overlay"></div>
      <div class="scanline"></div>

      <button class="toggle-btn" (click)="collapsed.set(!collapsed())" [title]="collapsed() ? 'Expand System' : 'Collapse System'">
        <div class="toggle-icon" [class.rotated]="collapsed()">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </div>
      </button>

      <!-- Brand / Header Section -->
      <div class="sidebar-header" [class.is-collapsed]="collapsed()">
        <div class="brand-container">
          <div class="brand-glitch" data-text="SYSTEM">SYSTEM</div>
          <div class="system-status">
            <span class="status-dot"></span>
            <span class="status-text" *ngIf="!collapsed()">ONLINE</span>
          </div>
        </div>

        <!-- Hunter Bio Card -->
        <div class="hunter-bio" *ngIf="!collapsed()">
          <div class="rank-container">
            <span class="rank-label">RANK</span>
            <span class="rank-value" [attr.data-rank]="userRank()">{{ userRank() }}</span>
          </div>
          <div class="user-info">
            <span class="user-name">{{ userName() }}</span>
            <div class="level-indicator">
              <div class="level-bar" [style.width.%]="levelProgress()"></div>
            </div>
          </div>
        </div>
      </div>

      <!-- Navigation Section -->
      <div class="nav-scroll-area">
        <div class="nav-links">
          <span class="nav-category" *ngIf="!collapsed()">CORE INTERFACE</span>
          
          <a routerLink="/system" routerLinkActive="active" [routerLinkActiveOptions]="{exact: true}" class="nav-item">
            <div class="nav-icon-wrapper">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                <polyline points="9 22 9 12 15 12 15 22" />
              </svg>
            </div>
            <span class="nav-label" *ngIf="!collapsed()">DASHBOARD</span>
            <div class="active-indicator"></div>
          </a>

          <a routerLink="/system/tasks" routerLinkActive="active" class="nav-item">
            <div class="nav-icon-wrapper">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M9 11l3 3L22 4" />
                <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
              </svg>
            </div>
            <span class="nav-label" *ngIf="!collapsed()">TASKS</span>
            <div class="active-indicator"></div>
          </a>

          <a routerLink="/system/templates" routerLinkActive="active" class="nav-item">
            <div class="nav-icon-wrapper">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                <line x1="9" y1="3" x2="9" y2="21" />
              </svg>
            </div>
            <span class="nav-label" *ngIf="!collapsed()">TEMPLATES</span>
            <div class="active-indicator"></div>
          </a>

          <div class="nav-divider"></div>
          <span class="nav-category" *ngIf="!collapsed()">ANALYSIS & LOGS</span>

          <a routerLink="/system/analytics" routerLinkActive="active" class="nav-item">
            <div class="nav-icon-wrapper">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M18 20V10" /><path d="M12 20V4" /><path d="M6 20V14" />
              </svg>
            </div>
            <span class="nav-label" *ngIf="!collapsed()">ANALYTICS</span>
            <div class="active-indicator"></div>
          </a>

          <a routerLink="/system/journal" routerLinkActive="active" class="nav-item">
            <div class="nav-icon-wrapper">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
              </svg>
            </div>
            <span class="nav-label" *ngIf="!collapsed()">JOURNAL</span>
            <div class="active-indicator"></div>
          </a>

          <div class="nav-divider"></div>
          <span class="nav-category" *ngIf="!collapsed()">HUNTER MODULES</span>

          <a routerLink="/system/modules" routerLinkActive="active" class="nav-item">
            <div class="nav-icon-wrapper">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" />
                <rect x="14" y="14" width="7" height="7" /><rect x="3" y="14" width="7" height="7" />
              </svg>
            </div>
            <span class="nav-label" *ngIf="!collapsed()">ALL MODULES</span>
            <div class="active-indicator"></div>
          </a>

          <a routerLink="/system/books" routerLinkActive="active" class="nav-item">
            <div class="nav-icon-wrapper">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
                <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
              </svg>
            </div>
            <span class="nav-label" *ngIf="!collapsed()">BOOKS</span>
            <div class="active-indicator"></div>
          </a>

          <a routerLink="/system/dsa" routerLinkActive="active" class="nav-item">
            <div class="nav-icon-wrapper">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
              </svg>
            </div>
            <span class="nav-label" *ngIf="!collapsed()">DSA</span>
            <div class="active-indicator"></div>
          </a>

          <a routerLink="/system/skills" routerLinkActive="active" class="nav-item">
            <div class="nav-icon-wrapper">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
              </svg>
            </div>
            <span class="nav-label" *ngIf="!collapsed()">SKILLS</span>
            <div class="active-indicator"></div>
          </a>
        </div>
      </div>

      <!-- Sidebar Footer -->
      <div class="sidebar-footer">
        <a routerLink="/system/profile" routerLinkActive="active" class="nav-item profile-link" [title]="'Hunter Profile'">
          <div class="nav-icon-wrapper">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
          </div>
          <span class="nav-label" *ngIf="!collapsed()">SETTINGS</span>
          <div class="active-indicator"></div>
        </a>
        
        <button class="nav-item logout-btn" (click)="logout()" title="Terminate Connection">
          <div class="nav-icon-wrapper">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
          </div>
          <span class="nav-label" *ngIf="!collapsed()">LOGOUT</span>
        </button>
      </div>
    </nav>
  `,
  styles: [`
    :host { 
      display: block; 
      height: 100vh; 
      position: fixed; 
      left: 0; 
      top: 0; 
      z-index: 1000;
      font-family: 'Rajdhani', sans-serif;
    }

    .sidebar {
      width: 260px; 
      height: 100vh;
      background: linear-gradient(180deg, rgba(4, 7, 13, 0.98) 0%, rgba(2, 5, 10, 0.99) 100%);
      border-right: 1px solid rgba(0, 234, 255, 0.15);
      backdrop-filter: blur(25px);
      display: flex; 
      flex-direction: column; 
      position: relative;
      transition: width 0.4s cubic-bezier(0.19, 1, 0.22, 1);
      box-shadow: 5px 0 30px rgba(0, 0, 0, 0.5), 1px 0 0 rgba(0, 234, 255, 0.05);
      overflow: hidden;
    }

    .sidebar.collapsed { width: 72px; }

    /* Holographic Effects */
    .hologram-overlay {
      position: absolute;
      top: 0; left: 0; right: 0; bottom: 0;
      background: 
        radial-gradient(ellipse at 15% 20%, rgba(0, 234, 255, 0.04) 0%, transparent 50%),
        radial-gradient(ellipse at 85% 80%, rgba(47, 123, 255, 0.02) 0%, transparent 50%);
      pointer-events: none;
      z-index: 0;
    }

    .scanline {
      position: absolute;
      top: 0; left: 0; right: 0;
      height: 2px;
      background: linear-gradient(90deg, transparent 5%, rgba(0, 234, 255, 0.08) 30%, rgba(0, 234, 255, 0.15) 50%, rgba(0, 234, 255, 0.08) 70%, transparent 95%);
      animation: scan-move 5s linear infinite;
      z-index: 1;
      opacity: 0.6;
    }

    @keyframes scan-move {
      0% { top: -2%; }
      100% { top: 102%; }
    }

    /* Toggle Button */
    .toggle-btn {
      position: absolute;
      right: -12px;
      top: 32px;
      width: 24px;
      height: 24px;
      background: rgba(0, 234, 255, 0.9);
      border: none;
      border-radius: 4px;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      color: #04070d;
      z-index: 10;
      box-shadow: 0 0 12px rgba(0, 234, 255, 0.5), 0 0 4px rgba(0, 234, 255, 0.3);
      transition: all 0.3s ease;
    }
    
    .toggle-btn:hover {
      transform: scale(1.15);
      box-shadow: 0 0 20px rgba(0, 234, 255, 0.8), 0 0 6px rgba(0, 234, 255, 0.5);
    }

    .toggle-icon { 
      transition: transform 0.4s cubic-bezier(0.19, 1, 0.22, 1); 
      width: 14px; 
      height: 14px; 
    }
    .toggle-icon.rotated { transform: rotate(180deg); }

    /* Header & Branding */
    .sidebar-header {
      padding: 2rem 1.25rem 1.25rem;
      z-index: 2;
      border-bottom: 1px solid rgba(0, 234, 255, 0.06);
    }
    
    .sidebar-header.is-collapsed {
      padding: 2.5rem 0.5rem 1.5rem;
      display: flex;
      flex-direction: column;
      align-items: center;
    }

    .brand-container {
      margin-bottom: 0.25rem;
      position: relative;
    }

    .brand-glitch {
      font-family: 'Orbitron', sans-serif;
      font-size: 1.3rem;
      font-weight: 800;
      letter-spacing: 5px;
      color: #00eaff;
      text-shadow: 0 0 10px rgba(0, 234, 255, 0.4), 0 0 30px rgba(0, 234, 255, 0.15);
      position: relative;
      animation: text-flicker 8s infinite;
    }

    @keyframes text-flicker {
      0%, 19.999%, 22%, 62.999%, 64%, 64.999%, 70%, 100% { opacity: 1; }
      20%, 21.999%, 63%, 63.999%, 65%, 69.999% { opacity: 0.85; }
    }

    .sidebar.collapsed .brand-glitch {
      font-size: 0.7rem;
      letter-spacing: 1px;
    }

    .system-status {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      margin-top: 0.4rem;
    }

    .status-dot {
      width: 6px;
      height: 6px;
      background: #00eaff;
      border-radius: 50%;
      box-shadow: 0 0 8px rgba(0, 234, 255, 0.8);
      animation: pulse-dot 2.5s ease-in-out infinite;
    }

    @keyframes pulse-dot {
      0%, 100% { opacity: 1; box-shadow: 0 0 8px rgba(0, 234, 255, 0.8); }
      50% { opacity: 0.5; box-shadow: 0 0 14px rgba(0, 234, 255, 1); }
    }

    .status-text {
      font-size: 0.6rem;
      font-weight: 700;
      color: rgba(0, 234, 255, 0.5);
      letter-spacing: 2px;
      font-family: 'Rajdhani', sans-serif;
    }

    /* Hunter Bio Card */
    .hunter-bio {
      background: linear-gradient(135deg, rgba(0, 234, 255, 0.04) 0%, rgba(47, 123, 255, 0.02) 100%);
      border: 1px solid rgba(0, 234, 255, 0.08);
      border-radius: 8px;
      padding: 0.85rem 1rem;
      display: flex;
      flex-direction: column;
      gap: 0.6rem;
      margin-top: 1rem;
      position: relative;
      overflow: hidden;
    }

    .hunter-bio::before {
      content: '';
      position: absolute;
      top: 0; left: 0; right: 0;
      height: 1px;
      background: linear-gradient(90deg, transparent, rgba(0, 234, 255, 0.3), transparent);
    }

    .rank-container {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .rank-label {
      font-size: 0.6rem;
      color: rgba(159, 183, 214, 0.5);
      font-weight: 700;
      letter-spacing: 2px;
      font-family: 'Orbitron', sans-serif;
    }

    .rank-value {
      font-family: 'Orbitron', sans-serif;
      font-size: 1.3rem;
      font-weight: 900;
      color: #00eaff;
      text-shadow: 0 0 12px rgba(0, 234, 255, 0.6), 0 0 25px rgba(0, 234, 255, 0.2);
      letter-spacing: 2px;
    }

    .rank-value[data-rank="S"],
    .rank-value[data-rank="SS"],
    .rank-value[data-rank="Shadow Monarch"] {
      color: #ffd700;
      text-shadow: 0 0 12px rgba(255, 215, 0, 0.6), 0 0 25px rgba(255, 215, 0, 0.2);
    }

    .rank-value[data-rank="A"] {
      color: #ff6b35;
      text-shadow: 0 0 12px rgba(255, 107, 53, 0.6);
    }

    .user-info { display: flex; flex-direction: column; gap: 4px; }

    .user-name {
      font-size: 0.8rem;
      font-weight: 600;
      color: rgba(233, 246, 255, 0.85);
      letter-spacing: 1px;
      display: block;
    }

    .level-indicator {
      height: 2px;
      background: rgba(255, 255, 255, 0.04);
      border-radius: 1px;
      overflow: hidden;
    }

    .level-bar {
      height: 100%;
      background: linear-gradient(90deg, #00eaff, #2f7bff);
      box-shadow: 0 0 6px rgba(0, 234, 255, 0.5);
      border-radius: 1px;
      transition: width 1s ease;
    }

    /* Navigation */
    .nav-scroll-area {
      flex: 1;
      padding: 1rem 0.6rem;
      overflow-y: auto;
      z-index: 2;
    }

    .nav-links {
      display: flex;
      flex-direction: column;
      gap: 2px;
    }

    .nav-category {
      font-size: 0.55rem;
      font-weight: 800;
      color: rgba(159, 183, 214, 0.25);
      letter-spacing: 2px;
      padding: 1.2rem 0.85rem 0.4rem;
      text-transform: uppercase;
      font-family: 'Orbitron', sans-serif;
    }

    .nav-item {
      display: flex;
      align-items: center;
      padding: 0.7rem 0.85rem;
      color: rgba(159, 183, 214, 0.65);
      text-decoration: none;
      border-radius: 6px;
      transition: all 0.25s cubic-bezier(0.19, 1, 0.22, 1);
      position: relative;
      gap: 0.85rem;
      cursor: pointer;
      border: none;
      background: transparent;
      font-family: 'Rajdhani', sans-serif;
      font-size: 0.82rem;
      font-weight: 600;
      letter-spacing: 1.2px;
    }

    .sidebar.collapsed .nav-item {
      justify-content: center;
      padding: 0.7rem 0;
    }

    .nav-icon-wrapper {
      width: 20px;
      height: 20px;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
      transition: all 0.25s ease;
    }

    .nav-icon-wrapper svg {
      width: 100%;
      height: 100%;
      stroke-width: 1.5px;
    }

    .nav-label {
      white-space: nowrap;
      line-height: 1;
      display: flex;
      align-items: center;
      transition: color 0.25s ease;
    }

    .active-indicator {
      position: absolute;
      left: 0;
      top: 50%;
      transform: translateY(-50%);
      width: 3px;
      height: 0;
      background: #00eaff;
      box-shadow: 0 0 10px rgba(0, 234, 255, 0.8), 0 0 4px rgba(0, 234, 255, 0.4);
      transition: height 0.3s cubic-bezier(0.19, 1, 0.22, 1);
      border-radius: 0 2px 2px 0;
    }

    /* Hover State */
    .nav-item:hover {
      background: rgba(0, 234, 255, 0.04);
      color: rgba(0, 234, 255, 0.9);
    }

    .nav-item:hover .nav-icon-wrapper {
      transform: translateX(2px) scale(1.1);
      filter: drop-shadow(0 0 4px rgba(0, 234, 255, 0.35));
    }

    .nav-item:hover .active-indicator {
      height: 30%;
      background: rgba(0, 234, 255, 0.4);
      box-shadow: 0 0 6px rgba(0, 234, 255, 0.3);
    }

    /* Active State */
    .nav-item.active {
      background: linear-gradient(90deg, rgba(0, 234, 255, 0.08) 0%, transparent 100%);
      color: #00eaff;
    }

    .nav-item.active .active-indicator {
      height: 60%;
    }

    .nav-item.active .nav-icon-wrapper {
      filter: drop-shadow(0 0 6px rgba(0, 234, 255, 0.6));
    }
    
    .nav-item.active .nav-label {
      text-shadow: 0 0 8px rgba(0, 234, 255, 0.3);
    }

    .nav-divider {
      height: 1px;
      background: linear-gradient(90deg, rgba(0, 234, 255, 0.08), transparent);
      margin: 0.75rem 0.85rem;
    }

    /* Footer */
    .sidebar-footer {
      padding: 0.75rem 0.6rem 1.5rem;
      border-top: 1px solid rgba(0, 234, 255, 0.05);
      z-index: 2;
      display: flex;
      flex-direction: column;
      gap: 2px;
    }

    .logout-btn {
      width: 100%;
      color: rgba(255, 80, 80, 0.55);
    }

    .logout-btn:hover {
      background: rgba(255, 68, 68, 0.06);
      color: rgba(255, 68, 68, 0.9);
    }

    .logout-btn:hover .nav-icon-wrapper {
      filter: drop-shadow(0 0 4px rgba(255, 68, 68, 0.4));
    }

    /* Mobile */
    @media (max-width: 768px) {
      .sidebar { width: 72px; }
      .nav-label, .nav-category, .hunter-bio, .status-text { display: none !important; }
      .nav-item { justify-content: center; padding: 0.7rem 0; }
      .sidebar-header { padding: 2.5rem 0.5rem 1.5rem; display: flex; flex-direction: column; align-items: center; }
      .brand-glitch { font-size: 0.7rem; letter-spacing: 1px; }
    }
  `]
})
export class SystemSidebarComponent implements OnInit {
  private authService = inject(AuthService);
  private userService = inject(UserService);
  private rankService = inject(RankEngineService);
  private router = inject(Router);
  
  collapsed = signal(false);
  
  userName = signal('HUNTER');
  userRank = signal<HunterRank>('E');
  userXP = signal(0);
  levelProgress = signal(75);

  ngOnInit() {
    this.refreshUserData();
  }

  refreshUserData() {
    this.userService.getMe().subscribe({
      next: (user) => {
        this.userName.set(user.displayName?.toUpperCase() || 'HUNTER');
        this.userXP.set(user.stats?.totalXp || 0);
        
        // Calculate rank based on XP
        const rank = this.rankService.getRank(user.stats?.totalXp || 0, 100);
        this.userRank.set(rank);

        // Calculate level progress (XP within current rank tier)
        const xp = user.stats?.totalXp || 0;
        const thresholds = [0, 200, 500, 1000, 2000, 4000, 7000, 10000];
        let currentThreshold = 0;
        let nextThreshold = 200;
        for (let i = 0; i < thresholds.length - 1; i++) {
          if (xp >= thresholds[i]) {
            currentThreshold = thresholds[i];
            nextThreshold = thresholds[i + 1];
          }
        }
        const progress = Math.min(100, ((xp - currentThreshold) / (nextThreshold - currentThreshold)) * 100);
        this.levelProgress.set(Math.round(progress));
      },
      error: () => {
        this.userName.set('FALLEN HUNTER');
      }
    });
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/']);
  }
}
