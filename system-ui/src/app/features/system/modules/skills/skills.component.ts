import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SkillTrackerComponent } from './components/skill-tracker/skill-tracker.component';
import { ModuleShellComponent } from '../../../../shared/components/module-layout/shell';

@Component({
  selector: 'app-skills-module',
  standalone: true,
  imports: [CommonModule, ModuleShellComponent, SkillTrackerComponent],
  template: `
    <app-module-shell title="Skill Learning">
      <div tracker>
        <app-skill-tracker></app-skill-tracker>
      </div>
    </app-module-shell>
  `
})
export class SkillsComponent {}
