import { Injectable, inject } from '@angular/core';
import { SystemStateService, Attributes } from '../../shared/services/system-state.service';
import { ToastService } from '../../shared/services/toast.service';
import { ActivityService } from './activity.service';

@Injectable({ providedIn: 'root' })
export class StatIntegrationService {
  private systemState = inject(SystemStateService);
  private toast = inject(ToastService);
  private activityService = inject(ActivityService);

  private lastActionTimes: Record<string, number> = {};

  logDsaSolved(problemsSolved: number, difficulty: 'easy' | 'medium' | 'hard' = 'medium') {
    console.log(`[StatBridge] logDsaSolved called: ${problemsSolved} problems, difficulty: ${difficulty}`);
    if (problemsSolved <= 0) return;
    
    if (this.isSpam('dsa', 3000)) { // Lowered cooldown for fluidity
      console.warn('[StatBridge] DSA log rejected due to cooldown');
      return;
    }
    
    let intBoost = 0;
    if (difficulty === 'easy') intBoost = 1;
    else if (difficulty === 'medium') intBoost = 2;
    else if (difficulty === 'hard') intBoost = 3;
    
    intBoost *= problemsSolved;
    const conBoost = 1 * problemsSolved;
    
    this.applyStats({ intelligence: intBoost, consistency: conBoost }, `DSA SECURED (${difficulty.toUpperCase()})`);
  }

  logBookRead(pages: number) {
    console.log(`[StatBridge] logBookRead called: ${pages} pages`);
    if (pages <= 0) return;
    
    if (this.isSpam('books', 5000)) { // Lowered cooldown
       console.warn('[StatBridge] Book log rejected due to cooldown');
       return;
    }
    
    const intBoost = Math.max(1, Math.floor(pages / 10));
    this.applyStats({ intelligence: intBoost }, `KNOWLEDGE ASSIMILATED (${pages} pages)`);
  }

  logSkillPractice(minutes: number = 60) {
    console.log(`[StatBridge] logSkillPractice called: ${minutes} minutes`);
    if (minutes < 10) {
      console.warn('[StatBridge] Skill log ignored: below 10 minute threshold');
      this.toast.show('Insignificant effort (Min. 10m required)', 'warning');
      return;
    }
    
    if (this.isSpam('skills', 5000)) { // Lowered cooldown for multi-practice segments
      console.warn('[StatBridge] Skill log rejected due to cooldown');
      return;
    }
    
    // Proportional formula: 30 min -> +1, 60 min -> +2, 120 min -> +4
    const discBoost = Math.floor(minutes / 30);
    
    if (discBoost > 0) {
      this.applyStats({ discipline: discBoost }, `TRAINING COMPLETE (${minutes} mins logged)`);
    } else {
       this.toast.show(`Effort logged: ${minutes} mins (Need 30m for DSC gain)`, 'warning');
    }
  }

  private applyStats(points: Partial<Attributes>, title: string) {
    console.log(`[StatBridge] applyStats: ${title}`, points);
    const currentStats = this.systemState.attributes();
    const finalPoints: Partial<Attributes> = {};
    const msgs: string[] = [];

    const calculateYield = (statName: keyof Attributes, baseGain: number) => {
      if (!baseGain) return 0;
      const current = currentStats[statName];
      let scaledGain = baseGain;
      
      if (current >= 95) scaledGain = baseGain * 0.1;
      else if (current >= 80) scaledGain = baseGain * 0.5;
      else if (current >= 50) scaledGain = baseGain * 0.8;

      return parseFloat(scaledGain.toFixed(1));
    };

    if (points.strength) {
      finalPoints.strength = calculateYield('strength', points.strength);
      if (finalPoints.strength > 0) msgs.push(`STR +${finalPoints.strength}`);
    }
    if (points.intelligence) {
      finalPoints.intelligence = calculateYield('intelligence', points.intelligence);
      if (finalPoints.intelligence > 0) msgs.push(`INT +${finalPoints.intelligence}`);
    }
    if (points.discipline) {
      finalPoints.discipline = calculateYield('discipline', points.discipline);
      if (finalPoints.discipline > 0) msgs.push(`DSC +${finalPoints.discipline}`);
    }
    if (points.consistency) {
      finalPoints.consistency = calculateYield('consistency', points.consistency);
      if (finalPoints.consistency > 0) msgs.push(`CON +${finalPoints.consistency}`);
    }

    if (Object.keys(finalPoints).length > 0) {
      console.log('[StatBridge] Final points to add:', finalPoints);
      this.systemState.addAttributes(finalPoints);
      this.toast.show(`${title}: ${msgs.join(', ')}`, 'xp');
      
      this.activityService.logActivity().subscribe({
        next: () => console.log('[StatBridge] Activity logged to heatmap'),
        error: (err) => console.error('[StatBridge] Failed to log activity', err)
      });
    } else if (points.discipline === 0 && title.includes('TRAINING')) {
       // Feedback for low duration logs
       this.toast.show('Insignificant effort logged (Min. 30m required)', 'warning');
    }
  }

  private isSpam(actionKey: string, cooldownMs: number): boolean {
    const now = Date.now();
    const last = this.lastActionTimes[actionKey] || 0;
    if (now - last < cooldownMs) {
      this.toast.show('ACTION COOLDOWN ACTIVE', 'warning');
      return true;
    }
    this.lastActionTimes[actionKey] = now;
    return false;
  }
}
