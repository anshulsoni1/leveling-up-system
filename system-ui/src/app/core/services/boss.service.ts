import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ToastService } from '../../shared/services/toast.service';
import { UserService } from './user.service';

export interface BossData {
  _id: string;
  name: string;
  hp: number;
  maxHp: number;
  damagePerDay: number;
  active: boolean;
  spawnDate: string;
}

@Injectable({
  providedIn: 'root'
})
export class BossService {
  boss = signal<BossData | null>(null);
  private apiUrl = 'https://leveling-up-system-1.onrender.com/api/boss';

  constructor(private http: HttpClient, private userService: UserService, private toastService: ToastService) {}

  checkAndSpawnBoss(inactiveDays: number) {
    this.http.get<BossData | null>(`${this.apiUrl}/current?inactiveDays=${inactiveDays}`)
      .subscribe({
        next: (data) => {
          if (data && data.active) {
            this.boss.set(data);
          } else {
            this.boss.set(null);
       this.toastService.show('BOSS DEFEATED', 'warning');
          }
        },
        error: (err) => console.error('Failed to fetch Boss State', err)
      });
  }

  dealDamage(amount: number) {
    return this.http.post<{hp: number, defeated: boolean}>(`${this.apiUrl}/damage`, { damage: amount });
  }
}