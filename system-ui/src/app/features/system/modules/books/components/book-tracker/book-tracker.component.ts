import { Component, OnInit, inject } from '@angular/core';
import { BooksService } from '../../../../../../core/services/books.service';
import { StatIntegrationService } from '../../../../../../core/services/stat-integration.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface BookData {
  currentBook: string;
  totalPages: number;
  history: Record<string, number>;
}

@Component({
  selector: 'app-book-tracker',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="tracker-interface">
      <div class="tracker-header">
        <h3 class="glow-text">READING LOG</h3>
        <p class="system-secondary">Update your daily reading progress.</p>
      </div>

      <div class="tracker-form">
        <div class="form-group row">
          <div class="input-container flex-2">
            <label>CURRENT BOOK</label>
            <input type="text" [(ngModel)]="data.currentBook" (blur)="saveProgress()" class="system-input" placeholder="Enter book title...">
          </div>
          <div class="input-container flex-1">
            <label>TOTAL PAGES</label>
            <input type="number" [(ngModel)]="data.totalPages" (blur)="saveProgress()" class="system-input" placeholder="0">
          </div>
        </div>

        <div class="form-group row">
          <div class="input-container flex-2">
            <label>PAGES READ TODAY</label>
            <input type="number" [(ngModel)]="pagesToday" class="system-input" placeholder="0">
          </div>
          <div class="input-container flex-1 save-btn-container">
             <button class="system-btn primary" (click)="saveToday()">SAVE LOG</button>
          </div>
        </div>
      </div>
      
      <div class="stats-panel">
         <div class="stat-item">
            <span class="stat-label">TOTAL READ</span>
            <span class="stat-value">{{ totalPagesRead }}<span class="stat-sub"> / {{ data.totalPages || 0 }}</span></span>
         </div>
         <div class="stat-item">
            <span class="stat-label">PROGRESS</span>
            <span class="stat-value">{{ progressPercentage | number:'1.0-1' }}<span class="stat-sub">%</span></span>
         </div>
      </div>
    </div>
  `,
  styles: [`
    .glow-text {
      color: #00ffff;
      text-shadow: 0 0 10px rgba(0, 255, 255, 0.5);
      margin: 0;
    }
    .system-secondary {
      color: rgba(255, 255, 255, 0.5);
      font-size: 0.9rem;
      margin: 0;
    }
    
    .tracker-interface {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }

    .tracker-header {
      margin-bottom: 0.5rem;
    }

    .tracker-form {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .row {
      display: flex;
      gap: 1rem;
      align-items: flex-end;
    }

    .flex-1 { flex: 1; }
    .flex-2 { flex: 2; }

    .input-container {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
      width: 100%;
    }
    .input-container label {
        color: #00ffff;
        font-size: 0.75rem;
        letter-spacing: 1px;
        opacity: 0.8;
    }

    .system-input {
        background: rgba(0, 0, 0, 0.4);
        border: 1px solid rgba(0, 255, 255, 0.3);
        color: white;
        padding: 0.75rem 1rem;
        border-radius: 4px;
        font-family: inherit;
        font-size: 0.9rem;
        transition: all 0.3s ease;
        width: 100%;
        box-sizing: border-box;
    }
    .system-input:focus {
          outline: none;
          border-color: #00ffff;
          box-shadow: 0 0 10px rgba(0, 255, 255, 0.2);
    }
    .system-input::placeholder {
          color: rgba(255, 255, 255, 0.3);
    }

    .save-btn-container {
       justify-content: flex-end;
    }

    .system-btn.primary {
      background: rgba(0, 255, 255, 0.1);
      border: 1px solid #00ffff;
      color: #00ffff;
      border-radius: 4px;
      font-weight: 600;
      letter-spacing: 1px;
      cursor: pointer;
      transition: all 0.3s ease;
      height: 42px;
      text-transform: uppercase;
      font-size: 0.8rem;
      width: 100%;
    }
    .system-btn.primary:hover {
        background: rgba(0, 255, 255, 0.2);
        box-shadow: 0 0 15px rgba(0, 255, 255, 0.4);
    }
    .system-btn.primary:disabled {
        opacity: 0.5;
        cursor: not-allowed;
    }
    
    .stats-panel {
      display: flex;
      gap: 2rem;
      padding-top: 1.5rem;
      border-top: 1px solid rgba(255,255,255,0.1);
      margin-top: 0.5rem;
    }
    
    .stat-item {
       display: flex;
       flex-direction: column;
       gap: 0.25rem;
    }
    
    .stat-label {
        color: rgba(255, 255, 255, 0.5);
        font-size: 0.7rem;
        letter-spacing: 1px;
    }
    
    .stat-value {
        font-size: 1.5rem;
        font-weight: 600;
        color: white;
        text-shadow: 0 0 5px rgba(255, 255, 255, 0.3);
    }
    .stat-sub {
           font-size: 0.9rem;
           color: rgba(255, 255, 255, 0.4);
    }
  `]
})
export class BookTrackerComponent implements OnInit {
  private booksService = inject(BooksService);
  private statIntegration = inject(StatIntegrationService);
  
  data: BookData = {
    currentBook: '',
    totalPages: null as unknown as number,
    history: {}
  };
  
  pagesToday: number | null = null;
  
  private storageKey = 'bookData';

  ngOnInit() {
    this.loadData();
    this.initTodayLog();
  }

  loadData() {
    const saved = localStorage.getItem(this.storageKey);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        this.data = {
           currentBook: parsed.currentBook || '',
           totalPages: parsed.totalPages || null,
           history: parsed.history || {}
        };
      } catch (e) {
        console.error('Failed to parse book data', e);
      }
    }
  }
  
  initTodayLog() {
     const today = this.getTodayStr();
     if (this.data.history[today] !== undefined) {
        this.pagesToday = this.data.history[today];
     }
  }

  saveProgress() {
    localStorage.setItem(this.storageKey, JSON.stringify(this.data));
    window.dispatchEvent(new Event('storage'));
  }

  saveToday() {
    console.log('[BookTracker] saveToday clicked. Pages today:', this.pagesToday);
    if (this.pagesToday !== null && this.pagesToday >= 0) {
        const today = this.getTodayStr();
        const oldVal = this.data.history[today] || 0;
        const delta = this.pagesToday - oldVal;
        
        console.log(`[BookTracker] delta detected: ${delta} (old: ${oldVal}, new: ${this.pagesToday})`);
        
        this.data.history[today] = this.pagesToday;
        this.saveProgress();
        
        if (delta > 0) {
            this.statIntegration.logBookRead(delta);
        } else {
            console.log('[BookTracker] No positive delta, skipping stat update.');
        }
    }
  }

  get totalPagesRead(): number {
    return Object.values(this.data.history).reduce((sum, val) => sum + (val || 0), 0);
  }
  
  get progressPercentage(): number {
     if (!this.data.totalPages) return 0;
     return Math.min(100, (this.totalPagesRead / this.data.totalPages) * 100);
  }

  private getTodayStr(): string {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  }
}
