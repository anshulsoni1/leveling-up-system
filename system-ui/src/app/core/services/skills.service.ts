import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AchievementService } from './achievement.service';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SkillsService {
  private apiUrl = 'https://leveling-up-system-1.onrender.com/api/skills';

  constructor(private http: HttpClient, private achievementService: AchievementService) {}

  getSkills(): Observable<any> {
    return this.http.get(this.apiUrl);
  }

  updateSkills(data: any): Observable<any> {
    return this.http.patch(this.apiUrl, data).pipe(tap(() => this.achievementService.checkAchievements().subscribe()));
  }

  addSkill(name: string): Observable<any> {
    return this.http.post(this.apiUrl + '/add', { name });
  }

  addLog(skillName: string, text: string): Observable<any> {
    return this.http.post(this.apiUrl + '/log', { skillName, text });
  }
}