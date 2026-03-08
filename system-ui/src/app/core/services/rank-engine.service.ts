import { Injectable } from '@angular/core';

export type HunterRank = 'E' | 'D' | 'C' | 'B' | 'A' | 'S' | 'SS' | 'Shadow Monarch';

@Injectable({
  providedIn: 'root'
})
export class RankEngineService {

  private readonly RANK_ORDER: HunterRank[] = [
    'E', 'D', 'C', 'B', 'A', 'S', 'SS', 'Shadow Monarch'
  ];

  constructor() {}

  getRank(totalXP: number, disciplineScore: number): HunterRank {
    let baseRank: HunterRank = 'E';

    if (totalXP >= 10000) {
      baseRank = 'Shadow Monarch';
    } else if (totalXP >= 7000) {
      baseRank = 'SS';
    } else if (totalXP >= 4000) {
      baseRank = 'S';
    } else if (totalXP >= 2000) {
      baseRank = 'A';
    } else if (totalXP >= 1000) {
      baseRank = 'B';
    } else if (totalXP >= 500) {
      baseRank = 'C';
    } else if (totalXP >= 200) {
      baseRank = 'D';
    } else {
      baseRank = 'E';
    }

    if (disciplineScore < 40) {
      const idx = this.RANK_ORDER.indexOf(baseRank);
      if (idx > 0) {
        return this.RANK_ORDER[idx - 1];
      }
    }

    return baseRank;
  }
}
