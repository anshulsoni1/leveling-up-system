import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ModuleService {
  private apiUrl = 'https://leveling-up-system-1.onrender.com/api';

  constructor(private http: HttpClient) {}

  getModules(): Observable<any> {
    return this.http.get(`${this.apiUrl}/modules`);
  }

  createModule(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/modules`, data);
  }

  deleteModule(moduleId: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/modules/${moduleId}`);
  }

  logActivity(moduleId: string, value: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/module-logs/${moduleId}`, { value });
  }

  getModuleLogs(moduleId: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/module-logs/${moduleId}`);
  }
}
