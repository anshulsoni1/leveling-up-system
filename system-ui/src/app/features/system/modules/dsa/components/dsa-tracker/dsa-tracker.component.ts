import { Component, OnInit, inject } from '@angular/core';
import { DsaService } from '../../../../../../core/services/dsa.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Topic {
  name: string;
  solved: number;
  total: number;
  revisions: number;
}

interface Category {
  name: string;
  topics: Topic[];
}

@Component({
  selector: 'app-dsa-tracker',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="tracker-interface">
      <div class="tracker-header">
        <div class="header-title">
          <h3 class="glow-text">DSA ARCHIVE</h3>
          <p class="system-secondary">Track your Data Structures & Algorithms mastery.</p>
        </div>
        <button class="system-btn primary add-category-btn" (click)="addCategory()">+ ADD CATEGORY</button>
      </div>

      <div class="category-list">
        <div class="category-card" *ngFor="let cat of categories; let i = index">
          
          <div class="category-header">
             <input type="text" [(ngModel)]="cat.name" (blur)="saveProgress()" class="category-name-input" placeholder="Category Name...">
             <div class="category-stats">
               <span class="stat-badge">SOLVED: <span class="badge-value">{{ getCategorySolved(cat) }} / {{ getCategoryTotal(cat) }}</span></span>
             </div>
          </div>
          
          <div class="topics-list">
             <div class="topic-row" *ngFor="let topic of cat.topics; let j = index">
                <input type="text" [(ngModel)]="topic.name" (blur)="saveProgress()" class="topic-name-input" placeholder="Topic name...">
                
                <div class="topic-metrics">
                   <div class="metric-group">
                      <label>SOLVED</label>
                      <input type="number" [(ngModel)]="topic.solved" (blur)="saveProgress()" class="small-input">
                   </div>
                   <span class="slash">/</span>
                   <div class="metric-group">
                      <label>TOTAL</label>
                      <input type="number" [(ngModel)]="topic.total" (blur)="saveProgress()" class="small-input">
                   </div>
                   <div class="revision-group">
                      <button class="icon-btn" (click)="incrementRevision(topic)" title="Add Revision">
                         <span class="rev-icon">?</span> {{ topic.revisions }}
                      </button>
                   </div>
                </div>
             </div>
          </div>
          
          <button class="system-btn secondary add-topic-btn" (click)="addTopic(cat)">+ ADD TOPIC</button>
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
      gap: 2rem;
    }

    .tracker-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 0.5rem;
    }
    
    .system-btn {
      border-radius: 4px;
      font-weight: 600;
      letter-spacing: 1px;
      cursor: pointer;
      transition: all 0.3s ease;
      text-transform: uppercase;
      font-size: 0.8rem;
    }

    .system-btn.primary {
      background: rgba(0, 255, 255, 0.1);
      border: 1px solid #00ffff;
      color: #00ffff;
      padding: 0.5rem 1rem;
    }
    .system-btn.primary:hover {
        background: rgba(0, 255, 255, 0.2);
        box-shadow: 0 0 15px rgba(0, 255, 255, 0.4);
    }
    
    .system-btn.secondary {
      background: transparent;
      border: 1px dashed rgba(0, 255, 255, 0.4);
      color: #00ffff;
      padding: 0.5rem 1rem;
      opacity: 0.8;
    }
    .system-btn.secondary:hover {
       background: rgba(0, 255, 255, 0.05);
       border-color: #00ffff;
       opacity: 1;
    }

    .input-base {
        background: transparent;
        border: none;
        color: white;
        font-family: inherit;
        transition: all 0.3s ease;
    }
    .input-base:focus {
        outline: none;
        border-bottom: 1px solid #00ffff;
    }
    .input-base::placeholder {
        color: rgba(255, 255, 255, 0.2);
    }

    .category-list {
       display: flex;
       flex-direction: column;
       gap: 1.5rem;
    }
    
    .category-card {
       background: rgba(0, 0, 0, 0.3);
       border: 1px solid rgba(0, 255, 255, 0.15);
       border-radius: 6px;
       padding: 1.5rem;
       display: flex;
       flex-direction: column;
       gap: 1.5rem;
    }
    
    .category-header {
       display: flex;
       justify-content: space-between;
       align-items: center;
       border-bottom: 1px solid rgba(255, 255, 255, 0.1);
       padding-bottom: 0.75rem;
    }
    
    .category-name-input {
       background: transparent;
       border: none;
       color: #00ffff;
       font-family: inherit;
       font-size: 1.2rem;
       font-weight: 600;
       letter-spacing: 1px;
       flex: 1;
       text-transform: uppercase;
    }
    .category-name-input:focus {
       outline: none;
       box-shadow: 0 1px 0 rgba(0, 255, 255, 0.5);
    }
    .category-name-input::placeholder {
       color: rgba(0, 255, 255, 0.3);
    }
    
    .stat-badge {
       background: rgba(0, 255, 255, 0.1);
       border: 1px solid rgba(0, 255, 255, 0.3);
       color: rgba(255, 255, 255, 0.7);
       padding: 0.3rem 0.8rem;
       border-radius: 20px;
       font-size: 0.75rem;
       letter-spacing: 1px;
    }
    
    .badge-value {
       color: white;
       font-weight: 600;
    }
    
    .topics-list {
       display: flex;
       flex-direction: column;
       gap: 0.75rem;
    }
    
    .topic-row {
       display: flex;
       justify-content: space-between;
       align-items: center;
       background: rgba(255, 255, 255, 0.03);
       padding: 0.75rem 1rem;
       border-radius: 4px;
       border: 1px solid transparent;
       transition: border-color 0.3s;
    }
    .topic-row:hover {
       border-color: rgba(0, 255, 255, 0.2);
    }
    
    .topic-name-input {
       background: transparent;
       border: none;
       color: white;
       font-family: inherit;
       font-size: 0.95rem;
       flex: 1;
    }
    .topic-name-input:focus {
       outline: none;
       color: #00ffff;
    }
    .topic-name-input::placeholder {
       color: rgba(255, 255, 255, 0.3);
    }
    
    .topic-metrics {
       display: flex;
       align-items: center;
       gap: 0.75rem;
    }
    
    .metric-group {
       display: flex;
       flex-direction: column;
       align-items: center;
       gap: 0.2rem;
    }
    
    .metric-group label {
       font-size: 0.6rem;
       color: rgba(255, 255, 255, 0.4);
       letter-spacing: 0.5px;
    }
    
    .small-input {
       background: rgba(0, 0, 0, 0.5);
       border: 1px solid rgba(255, 255, 255, 0.2);
       color: white;
       width: 40px;
       text-align: center;
       padding: 0.3rem;
       border-radius: 3px;
       font-family: inherit;
       font-size: 0.8rem;
       /* Hide spinners */
       -moz-appearance: textfield;
    }
    .small-input::-webkit-outer-spin-button,
    .small-input::-webkit-inner-spin-button {
      -webkit-appearance: none;
      margin: 0;
    }
    .small-input:focus {
       outline: none;
       border-color: #00ffff;
    }
    
    .slash {
       color: rgba(255, 255, 255, 0.3);
       font-size: 1.2rem;
       font-weight: 300;
       margin-top: 0.8rem;
    }
    
    .revision-group {
       margin-left: 1rem;
       display: flex;
       align-items: center;
    }
    
    .icon-btn {
       background: rgba(255, 204, 0, 0.1);
       border: 1px solid rgba(255, 204, 0, 0.3);
       color: #ffcc00;
       padding: 0.3rem 0.6rem;
       border-radius: 4px;
       cursor: pointer;
       font-family: inherit;
       font-size: 0.8rem;
       display: flex;
       align-items: center;
       gap: 0.3rem;
       transition: all 0.3s;
    }
    .icon-btn:hover {
       background: rgba(255, 204, 0, 0.2);
       box-shadow: 0 0 10px rgba(255, 204, 0, 0.3);
    }
    .rev-icon {
       font-size: 1rem;
    }
    
    .add-topic-btn {
       align-self: flex-start;
       margin-top: 0.5rem;
    }
  `]
})
export class DsaTrackerComponent implements OnInit {
  private dsaService = inject(DsaService);
  categories: Category[] = [];
  
  private storageKey = 'dsaData';

  ngOnInit() {
    this.loadData();
    if (this.categories.length === 0) {
      // Initialize with an empty category if completely fresh
      this.addCategory();
    }
  }

    loadData() {
    this.dsaService.getDSA().subscribe((res: any) => {
      if (res && res.categories) {
        this.categories = res.categories as Category[];
      }
    });
  }

  saveProgress() {
    localStorage.setItem(this.storageKey, JSON.stringify({ categories: this.categories }));
    window.dispatchEvent(new Event('storage'));
  }

  addCategory() {
    this.categories.push({
      name: '',
      topics: []
    });
    // We let the blur event on the title input trigger the save, or they can save it empty.
    this.saveProgress();
  }
  
  addTopic(category: Category) {
     category.topics.push({
        name: '',
        solved: null as unknown as number,
        total: null as unknown as number,
        revisions: 0
     });
     this.saveProgress();
  }
  
  incrementRevision(topic: Topic) {
     topic.revisions++;
     this.saveProgress();
  }
  
  getCategorySolved(category: Category): number {
     return category.topics.reduce((sum, topic) => sum + (topic.solved || 0), 0);
  }
  
  getCategoryTotal(category: Category): number {
     return category.topics.reduce((sum, topic) => sum + (topic.total || 0), 0);
  }
}
