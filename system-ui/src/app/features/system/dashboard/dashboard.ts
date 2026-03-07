import { Component, inject, signal, OnInit } from '@angular/core';
import { UserService } from '../../../core/services/user.service';
import { ModuleService } from '../../../core/services/module.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SystemStateService, QuestType, QuestDifficulty } from '../../../shared/services/system-state.service';
import { QuestItemComponent } from '../components/quest-item/quest-item.component';
import { QuestCreatePanelComponent } from '../components/quest-create-panel/quest-create-panel.component';
import { CreateModuleComponent } from '../create-module/create-module.component';
import { ModuleTemplatesComponent } from '../module-templates/module-templates.component';
import { DailyQuestsComponent } from '../daily-quests/daily-quests.component';

interface ModuleCard {
  id: string;
  name: string;
  description: string;
  streak: number;
  route: string;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    QuestItemComponent,
    QuestCreatePanelComponent,
    CreateModuleComponent,
    ModuleTemplatesComponent,
    DailyQuestsComponent
  ],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss'
})
export class SystemDashboard implements OnInit {
  private stateService = inject(SystemStateService);
  private bossService = inject(BossService);
  private userService = inject(UserService);

  private moduleService = inject(ModuleService);

  quests = this.stateService.quests;
  customModules = signal<any[]>([]);

  ngOnInit() {
    this.userService.getMe().subscribe((res: any) => {
      if (res) {
        this.stateService.setStateFromApi(res);
        
        // Setup Boss spawn check based on last active
        const msPerDay = 1000 * 60 * 60 * 24;
        const inactiveDays = res.lastActiveDate ? Math.floor((Date.now() - new Date(res.lastActiveDate).getTime()) / msPerDay) : 0;
        this.bossService.checkAndSpawnBoss(inactiveDays);
      }
    });

    this.moduleService.getModules().subscribe((res: any) => {
      if (res) {
        this.customModules.set(res);
      }
    });
  }
  showCreatePanel = signal(false);
  showCreateModule = signal(false);

  modules = signal<ModuleCard[]>([
    {
      id: 'books',
      name: 'Book Reading',
      description: 'Absorb knowledge through divine literature and ancient texts.',
      streak: 7, 
      route: '/system/books'
    },
    {
      id: 'dsa',
      name: 'DSA Practice',
      description: 'Master the logic of the abyss. Solve algorithmic challenges.',
      streak: 12,
      route: '/system/dsa'
    },
    {
      id: 'skills',
      name: 'Skill Learning',
      description: 'Acquire new abilities and enhance your cognitive arsenal.',
      streak: 4,
      route: '/system/skills'
    }
  ]);

  toggleCreatePanel() {
    this.showCreatePanel.update(v => !v);
  }

  addQuest(event: {title: string, type: QuestType, difficulty: QuestDifficulty}) {
    this.stateService.addQuest(event.title, event.type, event.difficulty);
    this.showCreatePanel.set(false);
  }

  completeQuest(id: unknown) {
    if (typeof id === 'string') {
      this.stateService.toggleQuest(id);
    }
  }

  createModule() {
    this.showCreateModule.set(true);
  }

  onModuleCreated() {
    this.showCreateModule.set(false);
    this.reloadModules();
  }

  onTemplateCreated() {
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
