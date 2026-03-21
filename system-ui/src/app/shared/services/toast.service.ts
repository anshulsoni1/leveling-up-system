import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

export type ToastType = 'xp' | 'achievement' | 'level' | 'warning';

export interface ToastMessage {
  id: string;
  message: string;
  type: ToastType;
}

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  private toastSubject = new Subject<ToastMessage>();
  toasts$ = this.toastSubject.asObservable();

  show(message: string, type: ToastType) {
    const id = crypto.randomUUID();
    this.toastSubject.next({ id, message, type });
  }
}