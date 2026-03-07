import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AchievementService } from './achievement.service';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DsaService {
  private apiUrl = 'https://leveling-up-system-1.onrender.com/api/dsa';

  constructor(private http: HttpClient, private achievementService: AchievementService) {}

  getDSA(): Observable<any> {
    return this.http.get(this.apiUrl);
  }

  updateDSA(data: any): Observable<any> {
    return this.http.patch(this.apiUrl, data).pipe(tap(() => this.achievementService.checkAchievements().subscribe()));
  }

  addCategory(name: string): Observable<any> {
    return this.http.post(this.apiUrl + '/category', { name });
  }

  addTopic(categoryName: string, topicName: string): Observable<any> {
    return this.http.post(this.apiUrl + '/topic', { categoryName, topicName });
  }
}