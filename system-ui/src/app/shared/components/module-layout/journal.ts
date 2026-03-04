import { Component, signal, computed, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { JournalService } from '../../../core/services/journal.service';

interface JournalEntry {
  id: string;
  timestamp: number;
  content: string;
}

@Component({
  selector: 'app-module-journal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="hud-panel journal-panel">
      <h2 class="panel-title">CHRONICLES <span class="system-dim">[Journal Log]</span></h2>
      
      <div class="journal-layout">
        <!-- Explorer / History -->
        <div class="journal-sidebar hud-border">
          <div class="sidebar-header">
            <span class="system-label">ENTRIES</span>
            <button class="add-entry-btn glow-hover" (click)="createNewEntry()">+ NEW ENTRY</button>
          </div>
          <div class="entries-list">
            <div *ngFor="let entry of entries()" 
                 class="entry-item" 
                 [class.active]="selectedId() === entry.id"
                 (click)="selectEntry(entry.id)">
              <span class="entry-date">{{ entry.timestamp | date:'MMM dd, HH:mm' }}</span>
              <span class="entry-excerpt">{{ entry.content.substring(0, 30) }}...</span>
            </div>
          </div>
        </div>

        <!-- Editor & Preview -->
        <div class="journal-workspace" *ngIf="selectedEntry(); else noSelection">
          <div class="workspace-header">
            <div class="view-tabs">
              <button [class.active]="viewMode() === 'editor'" (click)="viewMode.set('editor')">EDITOR</button>
              <button [class.active]="viewMode() === 'preview'" (click)="viewMode.set('preview')">PREVIEW</button>
              <button [class.active]="viewMode() === 'both'" (click)="viewMode.set('both')">SPLIT</button>
            </div>
            <button class="delete-btn system-dim" (click)="deleteEntry(selectedId())">DELETE</button>
          </div>

          <div class="workspace-content" [class.split-view]="viewMode() === 'both'">
            <div class="editor-pane" *ngIf="viewMode() === 'editor' || viewMode() === 'both'">
              <textarea 
                [(ngModel)]="editContent" 
                (blur)="saveChanges()"
                (ngModelChange)="updateEntry()"
                placeholder="Transcribe your progress in markdown..."
                spellcheck="false">
              </textarea>
            </div>
            <div class="preview-pane hud-border" 
                 *ngIf="viewMode() === 'preview' || viewMode() === 'both'"
                 [innerHTML]="renderedContent()">
            </div>
          </div>
        </div>

        <ng-template #noSelection>
          <div class="no-selection system-dim">
            <p>SELECT AN ENTRY TO CONTINUE TRANSCRIBING</p>
          </div>
        </ng-template>
      </div>
    </div>
  `,
  styles: [`
    @use '../../styles/system-theme' as *;
    .journal-panel {
      width: 100%;
      padding: 1.5rem;
      min-height: 500px;
      display: flex;
      flex-direction: column;
    }
    .journal-layout {
      display: flex;
      gap: 1.5rem;
      flex-grow: 1;
      height: 400px;
      
      @media (max-width: 900px) {
        flex-direction: column;
        height: auto;
      }
    }
    
    // SIDEBAR
    .journal-sidebar {
      width: 250px;
      display: flex;
      flex-direction: column;
      background: rgba($bg-deep, 0.3);
      padding: 1rem;
      
      @media (max-width: 900px) {
        width: 100%;
        height: 150px;
      }
    }
    .sidebar-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1rem;
      font-size: 0.8rem;
    }
    .add-entry-btn {
      background: transparent;
      border: 1px solid $neon-cyan;
      color: $neon-cyan;
      font-size: 0.7rem;
      padding: 0.2rem 0.5rem;
      cursor: pointer;
    }
    .entries-list {
      overflow-y: auto;
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }
    .entry-item {
      padding: 0.8rem;
      background: rgba($neon-blue, 0.05);
      border: 1px solid rgba($neon-cyan, 0.1);
      cursor: pointer;
      display: flex;
      flex-direction: column;
      gap: 0.2rem;
      
      &.active {
        border-color: $neon-cyan;
        background: rgba($neon-blue, 0.15);
        box-shadow: $glow-soft;
      }
      
      &:hover:not(.active) {
        background: rgba($neon-blue, 0.1);
      }
    }
    .entry-date { font-size: 0.75rem; color: $neon-cyan; font-family: 'Rajdhani', sans-serif; font-weight: 700; }
    .entry-excerpt { font-size: 0.85rem; color: $text-secondary; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }

    // WORKSPACE
    .journal-workspace {
      flex-grow: 1;
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }
    .workspace-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .view-tabs {
      display: flex;
      gap: 1px;
      background: rgba($neon-cyan, 0.2);
      padding: 2px;
      border-radius: 4px;
      
      button {
        background: transparent;
        border: none;
        color: $text-secondary;
        padding: 0.4rem 1rem;
        font-size: 0.75rem;
        cursor: pointer;
        font-family: 'Orbitron', sans-serif;
        
        &.active {
          background: rgba($neon-cyan, 0.2);
          color: $neon-cyan;
          text-shadow: $glow-soft;
        }
      }
    }
    .delete-btn {
      background: transparent;
      border: none;
      font-size: 0.75rem;
      cursor: pointer;
      &:hover { color: #ff4444; }
    }

    .workspace-content {
      display: flex;
      gap: 1rem;
      flex-grow: 1;
      height: 100%;
      
      &.split-view {
        .editor-pane, .preview-pane { width: 50%; }
      }
    }
    .editor-pane {
      width: 100%;
      textarea {
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.3);
        border: 1px solid rgba($neon-cyan, 0.2);
        color: $text-primary;
        padding: 1rem;
        font-family: 'Courier New', monospace;
        resize: none;
        outline: none;
        &:focus { border-color: $neon-cyan; box-shadow: inset 0 0 10px rgba($neon-cyan, 0.1); }
      }
    }
    .preview-pane {
      width: 100%;
      padding: 1.5rem;
      background: rgba($bg-deep, 0.5);
      overflow-y: auto;
      color: $text-secondary;
      line-height: 1.6;
      font-size: 1rem;
      
      ::ng-deep {
        h1, h2, h3 { color: $neon-cyan; text-shadow: $glow-soft; margin-top: 1.5rem; }
        strong { color: white; font-weight: 800; }
        code { background: rgba($neon-blue, 0.2); padding: 0.1rem 0.4rem; border-radius: 3px; }
        ul, ol { padding-left: 1.5rem; margin: 1rem 0; }
        li { margin-bottom: 0.5rem; }
        blockquote { border-left: 4px solid $neon-cyan; margin: 1.5rem 0; padding-left: 1rem; font-style: italic; }
      }
    }
    
    .no-selection {
      flex-grow: 1;
      display: flex;
      align-items: center;
      justify-content: center;
    }
  `]
})
export class ModuleJournalComponent implements OnInit {
  @Input() moduleName: string = '';
  entries = signal<JournalEntry[]>([]);
  selectedId = signal<string | null>(null);
  viewMode = signal<'editor' | 'preview' | 'both'>('both');
  
  editContent = '';

  constructor(private journalService: JournalService) {}

  ngOnInit() {
    this.loadEntries();
  }

  loadEntries() {
    if (!this.moduleName) return;
    this.journalService.getJournal(this.moduleName).subscribe({
      next: (res: any) => {
        if (res && res.entries) {
          const mapped = res.entries.map((e: any) => ({
            id: e._id || e.id,
            timestamp: new Date(e.timestamp).getTime(),
            content: e.text || e.content || ''
          }));
          this.entries.set(mapped);
        } else {
          this.entries.set([]);
        }
      },
      error: () => this.entries.set([])
    });
  }

  selectedEntry = computed(() => 
    this.entries().find(e => e.id === this.selectedId()) || null
  );

  renderedContent = computed(() => {
    const content = this.selectedEntry()?.content || '';
    return this.parseMarkdown(content);
  });

  selectEntry(id: string) {
    this.selectedId.set(id);
    this.editContent = this.selectedEntry()?.content || '';
  }

    createNewEntry() {
    if (!this.moduleName) return;
    this.journalService.addEntry(this.moduleName, 'New Log Entry...').subscribe({
       next: () => {
          this.loadEntries();
          this.viewMode.set('editor');
       }
    });
  }

  updateEntry() {
    this.entries.update(list => 
      list.map(e => e.id === this.selectedId() ? { ...e, content: this.editContent } : e)
    );
  }

  saveChanges() {
     const id = this.selectedId();
     if (!id || !this.moduleName) return;
     // It's not an update API unfortunately, it's push based...
     // WAIT! The current DB schema is an array of objects on a module!
     // There is no PATCH entry endpoint. There is GET, ADD, DELETE.
     // Let's delete the old Mongo _id and ADD a new one so it's fresh!
     this.journalService.deleteEntry(this.moduleName, id).subscribe(() => {
         this.journalService.addEntry(this.moduleName, this.editContent).subscribe(() => {
             this.loadEntries();
         });
     });
  }

  deleteEntry(id: string | null) {
    if (!id) return;
    this.entries.update(list => list.filter(e => e.id !== id));
    if (this.selectedId() === id) {
      this.selectedId.set(null);
    }
  }

  private parseMarkdown(md: string): string {
    if (!md) return '';
    
    let html = md
      .replace(/^# (.*$)/gm, '<h1>$1</h1>')
      .replace(/^## (.*$)/gm, '<h2>$1</h2>')
      .replace(/^### (.*$)/gm, '<h3>$1</h3>')
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/^> (.*$)/gm, '<blockquote>$1</blockquote>')
      .replace(/^\- (.*$)/gm, '<li>$1</li>')
      .replace(/(<li>.*<\/li>)/gms, '<ul>$1</ul>')
      .replace(/\n\n/g, '<br/><br/>')
      .replace(/\n/g, '<br/>');

    return html;
  }
}
