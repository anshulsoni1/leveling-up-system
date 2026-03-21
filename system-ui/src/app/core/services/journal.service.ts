import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface JournalEntry {
  _id?: string;
  content: string;
  createdAt: Date | string;
}

@Injectable({
  providedIn: 'root'
})
export class JournalService {
  private apiUrl = 'https://leveling-up-system-1.onrender.com/api/journal';

  constructor(private http: HttpClient) {}

  getEntries(): Observable<JournalEntry[]> {
    return this.http.get<JournalEntry[]>(this.apiUrl);
  }

  addEntry(content: string): Observable<JournalEntry> {
    return this.http.post<JournalEntry>(this.apiUrl, { content });
  }
}
