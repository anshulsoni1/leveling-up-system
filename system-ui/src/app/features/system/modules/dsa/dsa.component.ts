import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DsaTrackerComponent } from './components/dsa-tracker/dsa-tracker.component';
import { ModuleShellComponent } from '../../../../shared/components/module-layout/shell';

@Component({
  selector: 'app-dsa-module',
  standalone: true,
  imports: [CommonModule, ModuleShellComponent, DsaTrackerComponent],
  template: `
    <app-module-shell title="DSA Practice">
      <div tracker>
        <app-dsa-tracker></app-dsa-tracker>
      </div>
    </app-module-shell>
  `
})
export class DsaComponent {}
