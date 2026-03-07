import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class JournalService {
  private apiUrl = 'https://leveling-up-system-1.onrender.com/api/journal';

  constructor(private http: HttpClient) {}

  getJournal(moduleName: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/${moduleName}`);
  }

  addEntry(moduleName: string, text: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/${moduleName}`, { text });
  }

  deleteEntry(moduleName: string, id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${moduleName}/${id}`);
  }
}