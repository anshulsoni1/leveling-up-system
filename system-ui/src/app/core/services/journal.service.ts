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

  getJournal(moduleName: string): Observable<any> {
    return this.http.get(this.apiUrl + '/' + moduleName);
  }

  addEntry(contentOrModule: string, text?: string): Observable<JournalEntry> {
    if (text !== undefined) {
      return this.http.post<JournalEntry>(this.apiUrl + '/' + contentOrModule, { text });
    }
    return this.http.post<JournalEntry>(this.apiUrl, { content: contentOrModule });
  }

  deleteEntry(moduleName: string, entryId: string): Observable<any> {
    return this.http.delete(this.apiUrl + '/' + moduleName + '/' + entryId);
  }
}
