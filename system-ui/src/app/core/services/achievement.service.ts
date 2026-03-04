import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, Subject, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AchievementService {
  private apiUrl = 'https://solo-leveling-system-mkkd.onrender.com/api/achievements';
  
  private achievementsCache = new BehaviorSubject<any[]>([]);
  achievements$ = this.achievementsCache.asObservable();
  
  // Global event emitter for the Toast Notification system
  private unlockEvent = new Subject<any[]>();
  unlocks$ = this.unlockEvent.asObservable();

  constructor(private http: HttpClient) {}

  getAchievements(): Observable<any> {
     return this.http.get<{achievements: any[]}>(this.apiUrl).pipe(
       tap(res => {
          if (res && res.achievements) {
             this.achievementsCache.next(res.achievements);
          }
       })
     );
  }

  checkAchievements(): Observable<any> {
     return this.http.post<{achievements: any[], newUnlocks: boolean}>(this.apiUrl + '/check', {}).pipe(
        tap(res => {
           if (res && res.achievements) {
               // Isolate the newly added ones by checking length delta against cache or rely on response flag
               // If newUnlocks is true, let's find the difference
               if (res.newUnlocks) {
                   const oldList = this.achievementsCache.value;
                   const newItems = res.achievements.filter(a => !oldList.some(o => o.key === a.key));
                   if (newItems.length > 0) {
                      this.unlockEvent.next(newItems);
                   }
               }
               this.achievementsCache.next(res.achievements);
           }
        })
     );
  }
}