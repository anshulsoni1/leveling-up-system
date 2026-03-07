import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class XpEngineService {

  constructor() { }

  calculateXPGain(baseXP: number, streak: number, disciplineScore: number): number {
    let streakMultiplier = 1;
    if (streak >= 30) {
      streakMultiplier = 2;
    } else if (streak >= 8) {
      streakMultiplier = 1.5;
    } else if (streak >= 4) {
      streakMultiplier = 1.2;
    } else if (streak >= 1) {
      streakMultiplier = 1;
    }

    const disciplineMultiplier = 1 + (disciplineScore / 100);

    return Math.floor(baseXP * streakMultiplier * disciplineMultiplier);
  }

  applyDecay(xp: number, inactiveDays: number): number {
    if (inactiveDays < 3) return xp;
    if (inactiveDays === 3) return xp;

    let decayRate = 0;
    if (inactiveDays === 4) {
      decayRate = 0.02;
    } else if (inactiveDays === 5) {
      decayRate = 0.03;
    } else if (inactiveDays >= 6) {
      decayRate = 0.05;
    }

    return Math.floor(xp * (1 - decayRate));
  }

  calculateDiscipline(activeDaysLast30: number): number {
    return (activeDaysLast30 / 30) * 100;
  }
}
