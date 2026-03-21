import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AchievementService } from './achievement.service';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = 'https://leveling-up-system-1.onrender.com/api/user';

  constructor(private http: HttpClient, private achievementService: AchievementService) {}

  getMe(): Observable<any> {
    return this.http.get(this.apiUrl + '/me');
  }

  updateProfile(data: { displayName?: string; avatarUrl?: string }): Observable<any> {
    return this.http.patch(this.apiUrl, data);
  }

  updateXP(delta: number): Observable<any> {
    return this.http.patch(this.apiUrl + '/xp', { delta }).pipe(tap(() => this.achievementService.checkAchievements().subscribe()));
  }

  updateState(data: { xp?: number; level?: number; quests?: any[] }): Observable<any> {
    return this.http.patch(this.apiUrl + '/state', data).pipe(tap(() => this.achievementService.checkAchievements().subscribe()));
  }

  updateQuests(quests: any[]): Observable<any> {
    return this.http.patch(this.apiUrl + '/quests', { quests });
  }
}