import { Component, OnInit, inject } from '@angular/core';
import { SkillsService } from '../../../../../../core/services/skills.service';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface SkillData {
  currentSkill: string;
  startDate: string | null;
  status: 'active' | 'completed' | null;
}

@Component({
  selector: 'app-skill-tracker',
  standalone: true,
  imports: [CommonModule, FormsModule, DatePipe],
  template: `
    <div class="tracker-interface">
      <div class="tracker-header">
        <h3 class="glow-text">SKILL ACQUISITION</h3>
        <p class="system-secondary">Level up your core abilities.</p>
      </div>

      <!-- State 1: No active skill -->
      <div class="tracker-form" *ngIf="data.status !== 'active'">
        <div class="input-container">
           <label>SELECT NEW SKILL</label>
           <div class="start-group">
              <input type="text" [(ngModel)]="newSkillInput" class="system-input" placeholder="Enter skill to master...">
              <button class="system-btn primary" (click)="startSkill()" [disabled]="!newSkillInput.trim()">INITIALIZE</button>
           </div>
        </div>
      </div>
      
      <!-- State 2: Active skill -->
      <div class="active-skill-panel" *ngIf="data.status === 'active'">
         <div class="skill-info">
            <h2 class="current-skill-name">{{ data.currentSkill }}</h2>
            <div class="skill-meta">
               <span class="meta-label">COMMENCED:</span>
               <span class="meta-value">{{ data.startDate | date:'mediumDate' }}</span>
            </div>
            <div class="skill-meta">
               <span class="meta-label">DURATION:</span>
               <span class="meta-value">{{ getDaysActive() }} DAYS</span>
            </div>
         </div>
         
         <div class="action-buttons">
            <button class="system-btn success" (click)="markCompleted()">MARK COMPLETED</button>
            <button class="system-btn danger outline" (click)="changeSkill()">CHANGE SKILL</button>
         </div>
      </div>
    
      <!-- Status Badge -->
      <div class="status-indicator">
         <span class="pulse" [class.active]="data.status === 'active'"></span>
         <span class="status-text">{{ data.status === 'active' ? 'TRAINING IN PROGRESS' : (data.status === 'completed' ? 'TRAINING CONCLUDED' : 'AWAITING DIRECTIVE') }}</span>
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
      margin-bottom: 0.5rem;
    }
    
    .tracker-form {
       display: flex;
       flex-direction: column;
    }

    .input-container {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
      width: 100%;
    }
    .input-container label {
        color: #00ffff;
        font-size: 0.8rem;
        letter-spacing: 1px;
        opacity: 0.8;
    }
    
    .start-group {
       display: flex;
       gap: 1rem;
    }

    .system-input {
        background: rgba(0, 0, 0, 0.4);
        border: 1px solid rgba(0, 255, 255, 0.3);
        color: white;
        padding: 0.8rem 1rem;
        border-radius: 4px;
        font-family: inherit;
        font-size: 1rem;
        transition: all 0.3s ease;
        flex: 1;
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
    
    .system-btn {
      border-radius: 4px;
      font-weight: 600;
      letter-spacing: 1px;
      cursor: pointer;
      transition: all 0.3s ease;
      text-transform: uppercase;
      font-size: 0.9rem;
      padding: 0.8rem 1.5rem;
    }

    .system-btn.primary {
      background: rgba(0, 255, 255, 0.1);
      border: 1px solid #00ffff;
      color: #00ffff;
    }
    .system-btn.primary:hover:not(:disabled) {
        background: rgba(0, 255, 255, 0.2);
        box-shadow: 0 0 15px rgba(0, 255, 255, 0.4);
    }
    .system-btn.primary:disabled {
        opacity: 0.5;
        cursor: not-allowed;
    }
    
    .system-btn.success {
       background: rgba(0, 255, 128, 0.15);
       border: 1px solid #00ff80;
       color: #00ff80;
       flex: 2;
    }
    .system-btn.success:hover {
       background: rgba(0, 255, 128, 0.3);
       box-shadow: 0 0 15px rgba(0, 255, 128, 0.4);
    }
    
    .system-btn.danger.outline {
       background: transparent;
       border: 1px dashed rgba(255, 51, 102, 0.5);
       color: #ff3366;
       flex: 1;
    }
    .system-btn.danger.outline:hover {
       background: rgba(255, 51, 102, 0.1);
       border-style: solid;
       box-shadow: 0 0 10px rgba(255, 51, 102, 0.3);
    }

    .active-skill-panel {
       background: rgba(0, 255, 255, 0.03);
       border: 1px solid rgba(0, 255, 255, 0.15);
       border-radius: 8px;
       padding: 2rem;
       display: flex;
       flex-direction: column;
       gap: 2rem;
       position: relative;
       overflow: hidden;
    }
    /* Hexagon Grid Background Effect */
    .active-skill-panel::before {
      content: '';
      position: absolute;
      top: 0; left: 0; right: 0; bottom: 0;
      background-image: linear-gradient(rgba(0, 255, 255, 0.05) 1px, transparent 1px),
      linear-gradient(90deg, rgba(0, 255, 255, 0.05) 1px, transparent 1px);
      background-size: 20px 20px;
      opacity: 0.5;
      pointer-events: none;
      z-index: 0;
    }
    
    .skill-info, .action-buttons {
       position: relative;
       z-index: 1;
    }
    
    .skill-info {
       display: flex;
       flex-direction: column;
       gap: 0.5rem;
    }
    
    .current-skill-name {
       font-size: 2.5rem;
       color: white;
       margin: 0 0 1rem 0;
       text-transform: uppercase;
       letter-spacing: 2px;
       text-shadow: 0 0 10px rgba(0, 255, 255, 0.3);
    }
    
    .skill-meta {
       display: flex;
       align-items: center;
       gap: 1rem;
    }
    
    .meta-label {
       color: rgba(255, 255, 255, 0.4);
       font-size: 0.8rem;
       letter-spacing: 1px;
       width: 100px;
    }
    
    .meta-value {
       color: #00ffff;
       font-weight: 600;
       letter-spacing: 1px;
    }
    
    .action-buttons {
       display: flex;
       gap: 1rem;
       margin-top: 1rem;
    }
    
    .status-indicator {
       display: flex;
       align-items: center;
       gap: 0.75rem;
       padding-top: 1rem;
       border-top: 1px solid rgba(255, 255, 255, 0.1);
    }
    
    .pulse {
       width: 8px;
       height: 8px;
       border-radius: 50%;
       background: rgba(255, 255, 255, 0.3);
    }
    .pulse.active {
       background: #00ffff;
       box-shadow: 0 0 8px #00ffff;
       animation: pulse-anim 2s infinite;
    }
    
    .status-text {
       color: rgba(255, 255, 255, 0.5);
       font-size: 0.8rem;
       letter-spacing: 2px;
    }
    
    @keyframes pulse-anim {
       0% { opacity: 1; transform: scale(1); }
       50% { opacity: 0.5; transform: scale(1.5); }
       100% { opacity: 1; transform: scale(1); }
    }
  `]
})
export class SkillTrackerComponent implements OnInit {
  private skillsService = inject(SkillsService);
  data: SkillData = {
    currentSkill: '',
    startDate: null,
    status: null
  };
  
  newSkillInput: string = '';
  
  private storageKey = 'skillData';

  ngOnInit() {
    this.loadData();
  }

    loadData() {
    this.skillsService.getSkills().subscribe((res: any) => {
      if (res && res.skills && res.skills.length > 0) {
        // Get the latest/first skill to match behavior
        const activeSkill = res.skills[0];
        this.data = {
          currentSkill: activeSkill.name,
          status: 'active',
          startDate: new Date().toISOString()
        };
      } else {
        this.data = { status: null, currentSkill: '', startDate: null };
      }
    });
  }

  saveProgress() {
    this.skillsService.updateSkills({ skills: [{ name: this.data.currentSkill }] } as any).subscribe();
  }

  startSkill() {
     if (!this.newSkillInput.trim()) return;
     
     this.data.currentSkill = this.newSkillInput.trim();
     this.data.startDate = this.getTodayStr();
     this.data.status = 'active';
     this.newSkillInput = '';
     this.saveProgress();
  }
  
  markCompleted() {
     this.data.status = 'completed';
     this.saveProgress();
  }
  
  changeSkill() {
     this.data.currentSkill = '';
     this.data.startDate = null;
     this.data.status = null;
     this.saveProgress();
  }

  getDaysActive(): number {
     if (!this.data.startDate) return 0;
     const start = new Date(this.data.startDate);
     const today = new Date();
     // Set hours to 0 to compare just dates perfectly
     start.setHours(0,0,0,0);
     today.setHours(0,0,0,0);
     
     const diffTime = Math.abs(today.getTime() - start.getTime());
     const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
     return diffDays;
  }

  private getTodayStr(): string {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  }
}
