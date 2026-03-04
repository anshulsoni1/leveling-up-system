import { Component, inject, signal, OnInit } from '@angular/core';
import { UserService } from '../../../core/services/user.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SystemStateService, QuestType, QuestDifficulty } from '../../../shared/services/system-state.service';
import { QuestItemComponent } from '../components/quest-item/quest-item.component';
import { QuestCreatePanelComponent } from '../components/quest-create-panel/quest-create-panel.component';

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
    QuestCreatePanelComponent
  ],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss'
})
export class SystemDashboard implements OnInit {
  private stateService = inject(SystemStateService);
  private userService = inject(UserService);

  quests = this.stateService.quests;
  ngOnInit() {
    this.userService.getMe().subscribe((res: any) => {
      if (res) {
        this.stateService.setStateFromApi(res);
      }
    });
  }
  showCreatePanel = signal(false);

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
}
