import { Component, OnInit, inject } from '@angular/core';
import { SkillsService } from '../../../../../../core/services/skills.service';
import { StatIntegrationService } from '../../../../../../core/services/stat-integration.service';
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

         <div class="practice-logging">
            <div class="last-logged" *ngIf="lastLoggedSession">
               LAST SESSION: {{ lastLoggedSession }} MINS
            </div>
            
            <div class="time-input-group">
               <div class="input-main">
                  <input type="number" [(ngModel)]="practiceTime" class="time-input" placeholder="0">
                  <div class="unit-selector">
                     <button (click)="timeUnit = 'mins'" [class.active]="timeUnit === 'mins'">MINS</button>
                     <button (click)="timeUnit = 'hours'" [class.active]="timeUnit === 'hours'">HRS</button>
                  </div>
               </div>
               
               <div class="quick-btns">
                  <button (click)="addTime(15)">+15m</button>
                  <button (click)="addTime(30)">+30m</button>
                  <button (click)="addTime(60)">+1h</button>
               </div>
            </div>

            <button class="system-btn success-highlight log-btn" (click)="logPractice()">LOG PRACTICE</button>
         </div>
         
         <div class="secondary-actions">
            <button class="system-btn outline" (click)="markCompleted()">COMPLETED</button>
            <button class="system-btn danger outline" (click)="changeSkill()">RESET</button>
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
    
    .active-skill-panel {
       background: rgba(0, 255, 255, 0.03);
       border: 1px solid rgba(0, 255, 255, 0.15);
       border-radius: 8px;
       padding: 2rem;
       display: flex;
       flex-direction: column;
       gap: 1.5rem;
       position: relative;
    }
    
    .skill-info {
       display: flex;
       flex-direction: column;
       gap: 0.5rem;
    }
    
    .current-skill-name {
       font-size: 2rem;
       color: white;
       margin: 0;
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
       font-size: 0.7rem;
       letter-spacing: 1px;
       width: 80px;
    }
    
    .meta-value {
       color: #00ffff;
       font-weight: 600;
       font-size: 0.85rem;
    }

    .practice-logging {
       background: rgba(0, 0, 0, 0.3);
       padding: 1.5rem;
       border-radius: 6px;
       border: 1px solid rgba(0, 255, 255, 0.1);
       display: flex;
       flex-direction: column;
       gap: 1rem;
    }

    .last-logged {
       font-size: 0.65rem;
       color: #00ff80;
       letter-spacing: 1px;
       text-align: right;
       margin-bottom: -0.5rem;
    }

    .time-input-group {
       display: flex;
       flex-direction: column;
       gap: 0.75rem;
    }

    .input-main {
       display: flex;
       gap: 1px;
       background: rgba(255, 255, 255, 0.1);
       border-radius: 4px;
       overflow: hidden;
       border: 1px solid rgba(0, 255, 255, 0.2);
    }

    .time-input {
       background: rgba(0, 0, 0, 0.5);
       border: none;
       color: white;
       padding: 0.8rem;
       width: 60px;
       text-align: center;
       font-family: inherit;
       font-size: 1.2rem;
       font-weight: bold;
    }
    .time-input:focus { outline: none; background: rgba(0, 255, 255, 0.05); }

    .unit-selector {
       display: flex;
       flex: 1;
    }

    .unit-selector button {
       flex: 1;
       background: rgba(255, 255, 255, 0.05);
       border: none;
       color: rgba(255, 255, 255, 0.4);
       cursor: pointer;
       font-size: 0.7rem;
       font-weight: 600;
       letter-spacing: 1px;
       transition: all 0.2s;
    }

    .unit-selector button.active {
       background: #00ffff;
       color: black;
    }

    .quick-btns {
       display: flex;
       gap: 0.5rem;
    }

    .quick-btns button {
       flex: 1;
       background: rgba(0, 255, 255, 0.05);
       border: 1px solid rgba(0, 255, 255, 0.2);
       color: #00ffff;
       padding: 0.4rem;
       border-radius: 4px;
       font-size: 0.7rem;
       cursor: pointer;
       transition: all 0.2s;
    }
    .quick-btns button:hover { background: rgba(0, 255, 255, 0.15); }

    .system-btn {
      border-radius: 4px;
      font-weight: 600;
      letter-spacing: 1px;
      cursor: pointer;
      transition: all 0.3s ease;
      text-transform: uppercase;
      font-size: 0.8rem;
      padding: 0.8rem 1.2rem;
      border: 1px solid transparent;
    }

    .system-btn.primary {
      background: rgba(0, 255, 255, 0.1);
      border: 1px solid #00ffff;
      color: #00ffff;
    }
    
    .system-btn.success-highlight {
       background: rgba(0, 255, 128, 0.2);
       border: 1px solid #00ff80;
       color: #00ff80;
       box-shadow: 0 0 10px rgba(0, 255, 128, 0.2);
    }
    .system-btn.success-highlight:hover {
       background: rgba(0, 255, 128, 0.3);
       box-shadow: 0 0 20px rgba(0, 255, 128, 0.4);
    }

    .log-btn {
       width: 100%;
       font-size: 1rem;
    }

    .secondary-actions {
       display: flex;
       gap: 0.5rem;
    }
    
    .system-btn.outline {
       background: rgba(255, 255, 255, 0.05);
       border: 1px solid rgba(255, 255, 255, 0.2);
       color: white;
       flex: 1;
    }
    .system-btn.outline:hover {
       background: rgba(255, 255, 255, 0.1);
       border-color: white;
    }
    
    .system-btn.danger.outline {
       border-color: rgba(255, 51, 102, 0.4);
       color: #ff3366;
    }
    .system-btn.danger.outline:hover {
       background: rgba(255, 51, 102, 0.15);
       border-color: #ff3366;
    }

    .status-indicator {
       display: flex;
       align-items: center;
       gap: 0.75rem;
       padding-top: 1rem;
       border-top: 1px solid rgba(255, 255, 255, 0.1);
    }
    
    .pulse {
       width: 8px; height: 8px; border-radius: 50%; background: #00ffff;
       box-shadow: 0 0 8px #00ffff;
       animation: pulse-anim 2s infinite;
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
  private statIntegration = inject(StatIntegrationService);
  
  data: SkillData = {
    currentSkill: '',
    startDate: null,
    status: null
  };
  
  newSkillInput: string = '';
  practiceTime: number = 60;
  timeUnit: 'mins' | 'hours' = 'mins';
  lastLoggedSession: number | null = null;
  
  private storageKey = 'skillData';

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.skillsService.getSkills().subscribe((res: any) => {
      console.log('[SkillTracker] loadData:', res);
      if (res && res.skills && res.skills.length > 0) {
        const activeSkill = res.skills[0];
        this.data = {
          currentSkill: activeSkill.name,
          status: 'active',
          startDate: activeSkill.createdAt || new Date().toISOString()
        };
      } else {
        this.data = { status: null, currentSkill: '', startDate: null };
      }
    });

    const savedLast = localStorage.getItem('skillLastLogged');
    if (savedLast) this.lastLoggedSession = parseInt(savedLast, 10);
  }

  saveProgress() {
    this.skillsService.updateSkills({ skills: [{ name: this.data.currentSkill }] } as any).subscribe();
  }

  startSkill() {
     if (!this.newSkillInput.trim()) return;
     console.log('[SkillTracker] startSkill:', this.newSkillInput);
     this.data.currentSkill = this.newSkillInput.trim();
     this.data.startDate = new Date().toISOString();
     this.data.status = 'active';
     this.newSkillInput = '';
     this.saveProgress();
  }

  addTime(val: number) {
    this.practiceTime = (this.practiceTime || 0) + val;
  }
  
  logPractice() {
    if (!this.practiceTime || this.practiceTime <= 0) return;

    let totalMinutes = this.practiceTime;
    if (this.timeUnit === 'hours') {
       totalMinutes = this.practiceTime * 60;
    }

    // Validation
    if (totalMinutes < 10) {
       return; // StatIntegrationService already shows toast for < 10m
    }
    
    if (totalMinutes > 360) {
       totalMinutes = 360; // Cap at 6 hours
       console.warn('[SkillTracker] Practice time capped at 360 mins');
    }

    console.log('[SkillTracker] logPractice clicked:', totalMinutes, 'mins');
    
    this.statIntegration.logSkillPractice(totalMinutes);
    this.lastLoggedSession = totalMinutes;
    localStorage.setItem('skillLastLogged', totalMinutes.toString());
    
    // Clear input
    this.practiceTime = 60;
    this.timeUnit = 'mins';
  }

  markCompleted() {
     console.log('[SkillTracker] markCompleted');
     this.data.status = 'completed';
     this.saveProgress();
  }
  
  changeSkill() {
     console.log('[SkillTracker] changeSkill/Reset');
     this.data.currentSkill = '';
     this.data.startDate = null;
     this.data.status = null;
     this.lastLoggedSession = null;
     localStorage.removeItem('skillLastLogged');
     this.saveProgress();
  }

  getDaysActive(): number {
     if (!this.data.startDate) return 0;
     const start = new Date(this.data.startDate);
     const today = new Date();
     start.setHours(0,0,0,0);
     today.setHours(0,0,0,0);
     const diffTime = Math.abs(today.getTime() - start.getTime());
     return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) || 1;
  }
}
