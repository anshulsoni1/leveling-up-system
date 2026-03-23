import { Component, inject, signal, OnInit } from '@angular/core';
import { UserService } from '../../../core/services/user.service';
import { ModuleService } from '../../../core/services/module.service';
import { XpEngineService } from '../../../core/services/xp-engine.service';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { SystemStateService, QuestType, QuestDifficulty } from '../../../shared/services/system-state.service';
import { ActivityService } from '../../../core/services/activity.service';
import { ToastService } from '../../../shared/services/toast.service';
import { SoundService } from '../../../core/services/sound.service';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import { QuestItemComponent } from '../components/quest-item/quest-item.component';
import { QuestCreatePanelComponent } from '../components/quest-create-panel/quest-create-panel.component';
import { DailyQuestsComponent } from '../daily-quests/daily-quests.component';
import { BossPanelComponent } from '../boss-panel/boss-panel.component';
import { HunterStatusPanelComponent } from '../hunter-status-panel/hunter-status-panel.component';
import { QuestPanelComponent } from '../quest-panel/quest-panel.component';
import { EmptyStateComponent } from '../../../shared/components/empty-state/empty-state.component';
import { BossService } from '../../../core/services/boss.service';
import { AchievementService } from '../../../core/services/achievement.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    QuestItemComponent,
    QuestCreatePanelComponent,
    DailyQuestsComponent,
    BossPanelComponent,
    HunterStatusPanelComponent,
    QuestPanelComponent,
  EmptyStateComponent
  ],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss'
})
export class SystemDashboard implements OnInit {
  private stateService = inject(SystemStateService);
  private bossService = inject(BossService);
  private achievementService = inject(AchievementService);
  private userService = inject(UserService);
  private activityService = inject(ActivityService);
  private toastService = inject(ToastService);
  private soundService = inject(SoundService);
  private router = inject(Router);

  xpEngine = inject(XpEngineService);

  quests = this.stateService.quests;
  streakWarning = signal<boolean>(false);

  ngOnInit() {
    this.userService.getMe().subscribe((res: any) => {
      if (res) {
        this.stateService.setStateFromApi(res);

        const msPerDay = 1000 * 60 * 60 * 24;
        const inactiveDays = res.lastActiveDate ? Math.floor((Date.now() - new Date(res.lastActiveDate).getTime()) / msPerDay) : 0;
        this.bossService.checkAndSpawnBoss(inactiveDays);
        this.xpEngine.checkDangerMode(inactiveDays);
      }
    });

    // Check achievements on dashboard load
    this.achievementService.checkAchievements().subscribe();
  }
  showCreatePanel = signal(false);

  toggleCreatePanel() {
    this.router.navigate(['/system/tasks']);
  }

  addQuest(event: {title: string, type: QuestType, difficulty: QuestDifficulty}) {
    this.stateService.addQuest(event.title, event.type, event.difficulty);
    this.showCreatePanel.set(false);
  }

  completeQuest(id: unknown) {
    if (typeof id === 'string') {
      this.soundService.playSound('success');
      this.stateService.toggleQuest(id);
    }
  }
}
