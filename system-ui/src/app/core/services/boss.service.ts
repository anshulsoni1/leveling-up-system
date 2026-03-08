import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UserService } from './user.service';
import { environment } from '../../../environments/environment';

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
  private apiUrl = environment.apiUrl + '/boss';

  constructor(private http: HttpClient, private userService: UserService) {}

  checkAndSpawnBoss(inactiveDays: number) {
    this.http.get<BossData | null>(`${this.apiUrl}/current?inactiveDays=${inactiveDays}`)
      .subscribe({
        next: (data) => {
          if (data && data.active) {
            this.boss.set(data);
          } else {
            this.boss.set(null);
          }
        },
        error: (err) => console.error('Failed to fetch Boss State', err)
      });
  }

  dealDamage(amount: number) {
    // Only local simulation for now since backend damage route wasn't explicitly requested yet
    // Kept to avoid breaking module-page.component.ts calls
    const current = this.boss();
    if (!current || !current.active) return;
    
    current.hp -= amount;
    if (current.hp <= 0) {
       this.boss.set(null);
       this.userService.updateXP(100).subscribe();
    } else {
       this.boss.set({...current});
    }
  }
}
