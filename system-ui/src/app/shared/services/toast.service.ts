import { Injectable, inject } from '@angular/core';
import { SoundService } from '../../core/services/sound.service';
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
  private soundService = inject(SoundService);

  show(message: string, type: ToastType) {
    if (type === 'warning') this.soundService.playSound('alert');
    if (type === 'level') this.soundService.playSound('levelup');
    const id = crypto.randomUUID();
    this.toastSubject.next({ id, message, type });
  }
}