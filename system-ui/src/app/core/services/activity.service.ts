import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AchievementService } from './achievement.service';
import { Observable, BehaviorSubject, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ActivityService {
  private apiUrl = 'https://solo-leveling-system-mkkd.onrender.com/api/activity';

  // We can cache this to prevent aggressive querying if needed!
  private activitiesCache = new BehaviorSubject<any>(null);
  activities$ = this.activitiesCache.asObservable();

  constructor(private http: HttpClient, private achievementService: AchievementService) {}

  getActivity(): Observable<any> {
    return this.http.get(this.apiUrl).pipe(
      tap(res => this.activitiesCache.next(res))
    );
  }

  logActivity(): Observable<any> {
    return this.http.post(this.apiUrl + '/log', {}).pipe(tap(() => this.achievementService.checkAchievements().subscribe()));
  }
}