import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class QuestSystemService {
  private http = inject(HttpClient);
  private apiUrl = 'https://leveling-up-system-1.onrender.com/api/quests';

  getDailyQuests() {
    return this.http.get<{quests: any[]}>(this.apiUrl + '/daily');
  }

  completeQuest(id: string) {
    return this.http.post<{quest: any, totalXP: number}>(this.apiUrl + '/complete/' + id, {});
  }
}
