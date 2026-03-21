import { Injectable, signal, computed, inject } from '@angular/core';
import { ToastService } from './toast.service';
import { Subject } from 'rxjs';
import { UserService } from '../../core/services/user.service';

export type QuestType = 'workout' | 'study' | 'habit' | 'challenge';
export type QuestDifficulty = 'easy' | 'medium' | 'hard';
export type Rank = 'E' | 'D' | 'C' | 'B' | 'A' | 'S';

export interface Quest {
  id: string;
  title: string;
  type: QuestType;
  difficulty: QuestDifficulty;
  xp: number;
  completed: boolean;
  createdAt: number;
}

export interface Attributes {
  strength: number;
  intelligence: number;
  discipline: number;
  consistency: number;
}

export interface SystemState {
  userName: string;
  level: number;
  xp: number;
  maxXp: number;
  attributes: Attributes;
  quests: Quest[];
}

const DIFFICULTY_XP: Record<QuestDifficulty, number> = {
  easy: 10,
  medium: 20,
  hard: 40
};

const TYPE_ATTRIBUTE: Record<QuestType, keyof Attributes> = {
  workout: 'strength',
  study: 'intelligence',
  habit: 'discipline',
  challenge: 'consistency'
};

@Injectable({
  providedIn: 'root',
})
export class SystemStateService {

  updateUserXp(total: number) {
    this.state.update(s => ({ ...s, xp: total }));
  }

  private state = signal<SystemState>({
    userName: 'Shadow Monarch',
    level: 1,
    xp: 0,
    maxXp: 5000,
    attributes: {
      strength: 10,
      intelligence: 10,
      discipline: 10,
      consistency: 10,
    },
    quests: []
  });
  
  private levelUpSubject = new Subject<{previous: number, current: number, rank: Rank}>();
  readonly levelUp$ = this.levelUpSubject.asObservable();

  readonly userName = computed(() => this.state().userName);
  readonly level = computed(() => this.state().level);
  readonly xp = computed(() => this.state().xp);
  readonly maxXp = computed(() => this.state().maxXp);
  readonly attributes = computed(() => this.state().attributes);
  readonly quests = computed(() => this.state().quests);

  readonly rank = computed<Rank>(() => {
    const lvl = Number(this.level());
    if (lvl >= 50) return 'S';
    if (lvl >= 35) return 'A';
    if (lvl >= 20) return 'B';
    if (lvl >= 10) return 'C';
    if (lvl >= 5) return 'D';
    return 'E';
  });

  private toastService = inject(ToastService);
  private userService = inject(UserService);

  constructor() {
  }

  addQuest(title: string, type: QuestType, difficulty: QuestDifficulty) {
    const newQuest: Quest = {
      id: crypto.randomUUID(),
      title,
      type,
      difficulty,
      xp: DIFFICULTY_XP[difficulty],
      completed: false,
      createdAt: Date.now(),
    };

    this.state.update((s) => ({
      ...s,
      quests: [newQuest, ...s.quests],
    }));
  }

  toggleQuest(id: string) {
    const quest = this.state().quests.find(q => q.id === id);
    if (!quest || quest.completed) return;

    this.state.update((s) => {
      const updatedQuests = s.quests.map(q => 
        q.id === id ? { ...q, completed: true } : q
      );

      let newXp = Number(s.xp) + Number(quest.xp);
      let newLevel = Number(s.level);
      let newMaxXp = Number(s.maxXp);
      
      const prevLevel = newLevel;
      const multiplier = 5000; 

      while (newXp >= newMaxXp) {
        newXp -= newMaxXp;
        newLevel++;
        newMaxXp = multiplier * newLevel;
      }

      if (newLevel > prevLevel) {
        setTimeout(() => {
          this.toastService.show('LEVEL UP', 'level');
          this.levelUpSubject.next({
            previous: prevLevel,
            current: newLevel,
            rank: this.getRankForLevel(newLevel)
          });
        });
      }

      this.toastService.show('+XP gained', 'xp');
      const attributeToUpdate = TYPE_ATTRIBUTE[quest.type];
      const newAttributes = {
        ...s.attributes,
        [attributeToUpdate]: Number(s.attributes[attributeToUpdate]) + 1
      };

      return {
        ...s,
        quests: updatedQuests,
        xp: newXp,
        level: newLevel,
        maxXp: newMaxXp,
        attributes: newAttributes
      };
    });
  }

  private getRankForLevel(lvl: number): Rank {
    const l = Number(lvl);
    if (l >= 50) return 'S';
    if (l >= 35) return 'A';
    if (l >= 20) return 'B';
    if (l >= 10) return 'C';
    if (l >= 5) return 'D';
    return 'E';
  }

  deleteQuest(id: string) {
    this.state.update((s) => ({
      ...s,
      quests: s.quests.filter(q => q.id !== id)
    }));
  }

  addXP(amount: number) {
    this.state.update((s) => {
      let newXp = Number(s.xp) + Number(amount);
      let newLevel = Number(s.level);
      let newMaxXp = Number(s.maxXp);
      const prevLevel = newLevel;
      const multiplier = 5000;
      while (newXp >= newMaxXp) {
        newXp -= newMaxXp;
        newLevel++;
        newMaxXp = multiplier * newLevel;
      }
      if (newLevel > prevLevel) {
        setTimeout(() => {
          this.toastService.show('LEVEL UP', 'level');
          this.levelUpSubject.next({ previous: prevLevel, current: newLevel, rank: this.getRankForLevel(newLevel) });
        });
      }
      return { ...s, xp: newXp, level: newLevel, maxXp: newMaxXp };
    });

    this.userService.updateXP(amount).subscribe({
      next: () => console.log('XP persisted to backend'),
      error: (err) => console.error('Failed to sync XP', err)
    });
  }

  setStateFromApi(data: any) {
    this.state.update(s => ({
      ...s,
      xp: data.xp || 0,
      level: data.level || 1,
      quests: data.quests || s.quests,
    }));
  }
}
