import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { map } from 'rxjs';
import { ModuleShellComponent } from '../../../../shared/components/module-layout/shell';

@Component({
  selector: 'app-module-placeholder',
  standalone: true,
  imports: [CommonModule, RouterModule, ModuleShellComponent],
  template: `
    <app-module-shell [title]="title$ | async">
      <div tracker>
        <p class="system-dim">SCANNING MODULE ARCHIVES...</p>
        <div class="placeholder-content">
          <span class="glow-text">TRACKER INTERFACE OFFLINE</span>
          <p class="system-secondary">Awaiting core module logic integration.</p>
        </div>
      </div>
    </app-module-shell>
  `,
  styles: [`
    @use '../../../../shared/styles/system-theme' as *;
    .placeholder-content {
      padding: 2rem;
      border: 1px dashed rgba($neon-cyan, 0.2);
      text-align: center;
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }
  `]
})
export class ModulePlaceholder {
  private route = inject(ActivatedRoute);
  
  private titleMap: Record<string, string> = {
    'books': 'Book Reading',
    'dsa': 'DSA Practice',
    'skills': 'Skill Learning'
  };

  title$ = this.route.url.pipe(
    map(url => {
      const segment = url[0]?.path || '';
      return this.titleMap[segment] || segment.replace(/-/g, ' ');
    })
  );
}
