import { Component, Input, OnInit, OnChanges, inject, signal } from '@angular/core';
import { EmptyStateComponent } from '../empty-state/empty-state.component';
import { CommonModule } from '@angular/common';
import { ModuleService } from '../../../core/services/module.service';

@Component({
  selector: 'app-module-log-viewer',
  standalone: true,
  imports: [CommonModule, EmptyStateComponent],
  templateUrl: './module-log-viewer.component.html',
  styleUrls: ['./module-log-viewer.component.scss']
})
export class ModuleLogViewerComponent implements OnInit, OnChanges {
  @Input() moduleId!: string;
  private moduleService = inject(ModuleService);

  logs = signal<any[]>([]);

  ngOnInit() {
    this.fetchLogs();
  }

  ngOnChanges() {
    this.fetchLogs();
  }

  fetchLogs() {
    if (!this.moduleId) return;
    this.moduleService.getModuleLogs(this.moduleId).subscribe({
      next: (res: any[]) => {
        if (res && res.length) {
          const sorted = [...res].sort((a, b) => {
            const dateA = new Date(a.date || a.createdAt || a.timestamp).getTime();
            const dateB = new Date(b.date || b.createdAt || b.timestamp).getTime();
            return dateB - dateA;
          });
          this.logs.set(sorted);
        } else {
          this.logs.set([]);
        }
      },
      error: (err) => console.error('Failed to fetch module logs', err)
    });
  }
}
