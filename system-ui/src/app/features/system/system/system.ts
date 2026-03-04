import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SystemStateService } from '../../../shared/services/system-state.service';
import { RankBadgeComponent } from '../components/rank-badge/rank-badge.component';
import { LevelUpOverlayComponent } from '../components/levelup-overlay/levelup-overlay.component';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-system',
  standalone: true,
  imports: [
    CommonModule, 
    RouterModule,
    RankBadgeComponent,
    LevelUpOverlayComponent
  ],
  templateUrl: './system.html',
  styleUrl: './system.scss',
})
export class System {
  private stateService = inject(SystemStateService);

  // Expose state (Signals)
  userName = this.stateService.userName;
  level = this.stateService.level;
  rank = this.stateService.rank;

  // UI state
  levelUpData = signal<{previous: number, current: number, rank: any} | null>(null);

  constructor() {
    this.stateService.levelUp$.pipe(
      takeUntilDestroyed()
    ).subscribe(data => {
      this.levelUpData.set(data);
    });
  }
}
