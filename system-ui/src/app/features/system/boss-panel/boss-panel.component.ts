import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BossService } from '../../../core/services/boss.service';

@Component({
  selector: 'app-boss-panel',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="boss-card" *ngIf="bossService.boss() as boss">
       <div class="boss-header">
          <div class="boss-icon">☠️</div>
          <div class="boss-info">
             <h3 class="danger-title">{{ boss.name }}</h3>
             <p class="boss-desc">Your inactivity has manifested a demon! Complete modules to fight back (-50 HP per activity). <br/>If it survives, you lose {{boss.damagePerDay}} XP daily!</p>
          </div>
       </div>

       <div class="hp-container">
          <div class="hp-text">{{boss.hp}} / {{boss.maxHp}} HP</div>
          <div class="hp-track">
             <div class="hp-fill" [style.width.%]="(boss.hp / boss.maxHp) * 100"></div>
          </div>
       </div>
    </div>
  `,
  styles: [`
    .boss-card {
       background: rgba(30,5,5,0.7);
       border: 1px solid #ff3333;
       border-radius: 12px;
       padding: 20px;
       margin-bottom: 24px;
       box-shadow: 0 0 20px rgba(255,50,50,0.2) inset, 0 8px 16px rgba(0,0,0,0.4);
       animation: pulseRed 3s infinite alternate;
    }
    @keyframes pulseRed {
       0% { box-shadow: 0 0 10px rgba(255,50,50,0.1) inset; border-color: #aa1111; }
       100% { box-shadow: 0 0 30px rgba(255,50,50,0.4) inset; border-color: #ff3333; }
    }
    .boss-header {
       display: flex;
       align-items: center;
       gap: 16px;
       margin-bottom: 16px;
    }
    .boss-icon {
       font-size: 3rem;
       filter: drop-shadow(0 0 10px rgba(200,0,0,0.8));
    }
    .danger-title {
       color: #ff4444;
       margin: 0 0 8px 0;
       font-size: 1.4rem;
       text-transform: uppercase;
       letter-spacing: 2px;
       font-weight: 800;
       text-shadow: 0 0 10px rgba(255,0,0,0.6);
    }
    .boss-desc {
       color: #ffaaaa;
       font-size: 0.9rem;
       margin: 0;
       line-height: 1.4;
    }
    .hp-container {
       width: 100%;
       position: relative;
    }
    .hp-text {
       position: absolute;
       width: 100%;
       text-align: center;
       color: #fff;
       font-weight: bold;
       font-size: 0.85rem;
       line-height: 24px;
       z-index: 2;
       text-shadow: 1px 1px 2px #000;
       top: 0;
    }
    .hp-track {
        height: 24px;
        background: rgba(0,0,0,0.8);
        border-radius: 12px;
        overflow: hidden;
        border: 1px solid #441111;
        position: relative;
    }
    .hp-fill {
        height: 100%;
        background: linear-gradient(90deg, #aa0000, #ff3333);
        transition: width 0.5s cubic-bezier(0.4, 0, 0.2, 1);
        box-shadow: 0 0 10px #ff3333 inset;
    }
  `]
})
export class BossPanelComponent {
  bossService = inject(BossService);
}
