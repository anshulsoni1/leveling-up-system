import { Injectable, signal } from '@angular/core';
import { UserService } from './user.service';

export interface BossData {
  id: string;
  name: string;
  hp: number;
  maxHp: number;
  damagePerDay: number;
  isActive: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class BossService {
  boss = signal<BossData | null>(null);

  constructor(private userService: UserService) {
    this.loadBoss();
  }

  private loadBoss() {
    const saved = localStorage.getItem('currentBoss');
    if (saved) {
      this.boss.set(JSON.parse(saved));
    }
  }

  private saveBoss(data: BossData | null) {
    if (data) {
      localStorage.setItem('currentBoss', JSON.stringify(data));
      this.boss.set(data);
    } else {
      localStorage.removeItem('currentBoss');
      this.boss.set(null);
    }
  }

  checkAndSpawnBoss(inactiveDays: number) {
    const current = this.boss();
    if (inactiveDays >= 3 && !current) {
      // Spawn new boss
      const newBoss: BossData = {
        id: 'proc_demon_' + Date.now(),
        name: 'Procrastination Demon',
        hp: 300,
        maxHp: 300,
        damagePerDay: 10,
        isActive: true
      };
      this.saveBoss(newBoss);
    } else if (inactiveDays < 3 && current && current.isActive) {
       // Reset if user is highly active again and defeated it previously or naturally cleared
    }
  }

  dealDamage(amount: number) {
    const current = this.boss();
    if (!current || !current.isActive) return;

    current.hp -= amount;
    
    if (current.hp <= 0) {
      this.defeatBoss(current);
    } else {
      this.saveBoss(current);
    }
  }

  private defeatBoss(bossData: BossData) {
    // Reward +100 XP
    this.userService.updateXP(100).subscribe({
      next: () => console.log('Boss Defeated! +100 XP Awarded.'),
      error: (e) => console.error('Failed to reward Boss XP:', e)
    });
    
    // Clear boss from storage
    this.saveBoss(null);
  }
}
