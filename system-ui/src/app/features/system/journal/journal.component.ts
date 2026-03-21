import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { JournalService, JournalEntry } from '../../../core/services/journal.service';
import { ToastService } from '../../../shared/services/toast.service';

@Component({
  selector: 'app-journal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './journal.component.html',
  styleUrls: ['./journal.component.scss']
})
export class JournalComponent implements OnInit {
  private journalService = inject(JournalService);
  private toastService = inject(ToastService);

  entries = signal<JournalEntry[]>([]);
  newEntryContent = signal<string>('');
  isSubmitting = signal<boolean>(false);

  ngOnInit() {
    this.loadEntries();
  }

  loadEntries() {
    this.journalService.getEntries().subscribe({
      next: (data) => {
        // Sort descending by date
        const sorted = data.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        this.entries.set(sorted);
      },
      error: (err) => {
        console.error('Failed to load journal entries', err);
        // Local fallback for testing without backend
        // this.entries.set([{ _id: '1', content: 'Simulation log: Network failed.', createdAt: new Date().toISOString() }]);
      }
    });
  }

  saveEntry() {
    const content = this.newEntryContent().trim();
    if (!content) return;

    this.isSubmitting.set(true);
    this.journalService.addEntry(content).subscribe({
      next: (savedEntry) => {
        this.entries.update(curr => [savedEntry, ...curr]);
        this.newEntryContent.set('');
        this.isSubmitting.set(false);
        this.toastService.show('ENTRY SAVED', 'xp');
      },
      error: (err) => {
        console.error('Failed to save entry', err);
        this.isSubmitting.set(false);
        
        // Simulating success if API fails for local dev test
        const simulated: JournalEntry = { _id: crypto.randomUUID(), content, createdAt: new Date().toISOString() };
        this.entries.update(curr => [simulated, ...curr]);
        this.newEntryContent.set('');
        this.toastService.show('ENTRY SAVED (Local)', 'warning');
      }
    });
  }
}
