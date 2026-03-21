import { Component, inject, signal, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SystemStateService } from '../../../shared/services/system-state.service';
import { UserService } from '../../../core/services/user.service';
import { RankBadgeComponent } from '../components/rank-badge/rank-badge.component';
import { LevelUpOverlayComponent } from '../components/levelup-overlay/levelup-overlay.component';
import { SystemSidebarComponent } from '../components/system-sidebar/system-sidebar.component';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ToastService } from '../../../shared/services/toast.service';

@Component({
  selector: 'app-system',
  standalone: true,
  imports: [
    CommonModule, 
    RouterModule,
    RankBadgeComponent,
    LevelUpOverlayComponent,
    SystemSidebarComponent
  ],
  templateUrl: './system.html',
  styleUrl: './system.scss',
})
export class System implements OnInit {
  private stateService = inject(SystemStateService);
  private userService = inject(UserService);
  private http = inject(HttpClient);
  private toastService = inject(ToastService);

  systemOnline = signal(false);

  // Expose state (Signals)
  userName = this.stateService.userName;
  level = this.stateService.level;
  rank = this.stateService.rank;

  // UI state
  levelUpData = signal<{previous: number, current: number, rank: any} | null>(null);

  ngOnInit() {
    // Health Check
    this.http.get('https://leveling-up-system-1.onrender.com/api/health').subscribe({
      next: () => this.systemOnline.set(true),
      error: () => {
        this.systemOnline.set(false);
        this.toastService.show('SYSTEM OFFLINE', 'warning');
      }
    });

    this.userService.getMe().subscribe({
      next: (user) => {
        if (user) {
          this.stateService.setStateFromApi(user);
        }
      },
      error: (err) => console.error('App init: failed to fetch user state', err)
    });
  }

  constructor() {
    this.stateService.levelUp$.pipe(
      takeUntilDestroyed()
    ).subscribe(data => {
      this.levelUpData.set(data);
    });
  }
}
