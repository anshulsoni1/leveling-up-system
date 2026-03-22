const fs = require('fs');
const path = require('path');

function patch(file, replacer) {
  const p = path.resolve(file);
  let c = fs.readFileSync(p, 'utf8');
  fs.writeFileSync(p, replacer(c));
}

patch('src/app/shared/services/toast.service.ts', c => {
  return c
    .replace("import { Injectable } from '@angular/core';", "import { Injectable, inject } from '@angular/core';\nimport { SoundService } from '../../core/services/sound.service';")
    .replace("toasts$ = this.toastSubject.asObservable();", "toasts$ = this.toastSubject.asObservable();\n  private soundService = inject(SoundService);")
    .replace("show(message: string, type: ToastType) {", "show(message: string, type: ToastType) {\n    if (type === 'warning') this.soundService.playSound('alert');\n    if (type === 'level') this.soundService.playSound('levelup');");
});

patch('src/app/features/system/boss-panel/boss-panel.component.ts', c => {
  return c
    .replace("import { ToastService } from '../../../shared/services/toast.service';", "import { ToastService } from '../../../shared/services/toast.service';\nimport { SoundService } from '../../../core/services/sound.service';")
    .replace("toastService = inject(ToastService);", "toastService = inject(ToastService);\n  soundService = inject(SoundService);")
    .replace("this.bossService.dealDamage(dmg).subscribe((res: any) => {", "this.soundService.playSound('hit');\n    this.bossService.dealDamage(dmg).subscribe((res: any) => {");
});

patch('src/app/features/system/quest-panel/quest-panel.component.ts', c => {
  return c
    .replace("import { QuestSystemService } from '../../../core/services/quest-system.service';", "import { QuestSystemService } from '../../../core/services/quest-system.service';\nimport { SoundService } from '../../../core/services/sound.service';")
    .replace("private questService = inject(QuestSystemService);", "private questService = inject(QuestSystemService);\n  private soundService = inject(SoundService);")
    .replace("this.questService.completeQuest(quest._id).subscribe({", "this.soundService.playSound('success');\n    this.questService.completeQuest(quest._id).subscribe({");
});

patch('src/app/features/system/profile/profile.component.ts', c => {
  return c
    .replace("import { ToastService } from '../../../shared/services/toast.service';", "import { ToastService } from '../../../shared/services/toast.service';\nimport { SoundService } from '../../../core/services/sound.service';")
    .replace("private toastService = inject(ToastService);", "private toastService = inject(ToastService);\n  soundService = inject(SoundService);");
});

patch('src/app/features/system/profile/profile.component.html', c => {
  return c
    .replace('<div class="settings-card hud-panel">', `<div class="settings-card hud-panel">
    <div class="panel-header">
      <h2 class="panel-title">AUDIO SETTINGS</h2>
    </div>
    <div class="form-container" style="margin-bottom: 24px;">
      <div class="form-group" style="display: flex; justify-content: space-between; align-items: center;">
        <label class="system-label" style="margin: 0;">SYSTEM SOUNDS</label>
        <button class="save-btn glow-hover" (click)="soundService.toggleSound()" [style.background]="soundService.getSoundEnabled() ? 'var(--system-cyan)' : 'transparent'" [style.color]="soundService.getSoundEnabled() ? '#000' : 'var(--system-cyan)'">
          {{ soundService.getSoundEnabled() ? 'ENABLED' : 'DISABLED' }}
        </button>
      </div>
    </div>
    </div>
    <div class="settings-card hud-panel">`);
});

patch('src/app/features/system/dashboard/dashboard.ts', c => {
  return c
    .replace("import { ToastService } from '../../../shared/services/toast.service';", "import { ToastService } from '../../../shared/services/toast.service';\nimport { SoundService } from '../../../core/services/sound.service';")
    .replace("private toastService = inject(ToastService);", "private toastService = inject(ToastService);\n  private soundService = inject(SoundService);")
    .replace("this.stateService.toggleQuest(id);", "this.soundService.playSound('success');\n      this.stateService.toggleQuest(id);");
});

console.log('patched successfully');
