import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AchievementService } from './achievement.service';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BooksService {
  private apiUrl = 'https://leveling-up-system-1.onrender.com/api/books';

  constructor(private http: HttpClient, private achievementService: AchievementService) {}

  getBooks(): Observable<any> {
    return this.http.get(this.apiUrl);
  }

  updateBooks(data: any): Observable<any> {
    return this.http.patch(this.apiUrl, data).pipe(tap(() => this.achievementService.checkAchievements().subscribe()));
  }

  addLog(pages: number): Observable<any> {
    return this.http.post(this.apiUrl + '/log', { pages }).pipe(tap(() => this.achievementService.checkAchievements().subscribe()));
  }
}