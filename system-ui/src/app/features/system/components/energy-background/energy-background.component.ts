import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-energy-background',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="energy-waves-container">
      <!-- Radial Ambient Waves -->
      <div class="wave wave-1"></div>
      <div class="wave wave-2"></div>
      <div class="wave wave-3"></div>
      
      <!-- Flowing Energy Streaks -->
      <div class="energy-streak streak-1"></div>
      <div class="energy-streak streak-2"></div>

      <!-- Lightning Veins Layer -->
      <div class="lightning-veins vein-1"></div>
      <div class="lightning-veins vein-2"></div>

      <div class="energy-overlay"></div>
    </div>
  `,
  styles: [`
    :host {
      display: block;
      position: absolute;
      inset: 0;
      z-index: 0;
      pointer-events: none;
      overflow: hidden;
      background: transparent; /* Top-level transparency */
    }

    .energy-waves-container {
      position: absolute;
      inset: -50%; /* Oversize to allow smooth translation */
      width: 200%;
      height: 200%;
      pointer-events: none;
    }

    /* --- GRADIENT WAVES (Radial) --- */
    .wave {
      position: absolute;
      border-radius: 50%;
      animation-iteration-count: infinite;
      animation-timing-function: ease-in-out;
      animation-direction: alternate;
      mix-blend-mode: screen;
      filter: blur(60px); 
      opacity: 0.08; /* Ultra-low opacity */
    }

    .wave-1 {
      width: 60vw;
      height: 70vh;
      top: 20%;
      left: 10%;
      background: radial-gradient(circle at center, #00eaff 0%, transparent 70%);
      animation: flow-1 15s infinite alternate ease-in-out;
    }

    .wave-2 {
      width: 80vw;
      height: 60vh;
      top: 40%;
      right: 10%;
      background: radial-gradient(circle at center, #0044ff 0%, transparent 60%);
      animation: flow-2 18s infinite alternate ease-in-out;
    }

    .wave-3 {
      width: 50vw;
      height: 80vh;
      bottom: 10%;
      left: 30%;
      background: radial-gradient(circle at center, #8a2be2 0%, transparent 70%);
      animation: flow-3 20s infinite alternate ease-in-out;
    }

    /* --- FLOWING ENERGY STREAKS --- */
    .energy-streak {
      position: absolute;
      height: 50vh;
      filter: blur(100px); /* Massive blur for extreme softness */
      mix-blend-mode: screen;
      pointer-events: none;
    }

    

    

    /* --- LIGHTNING VEINS --- */
    .lightning-veins {
      position: absolute;
      inset: 0;
      mix-blend-mode: screen;
      opacity: 0.05; /* Atmospheric, faint */
      filter: blur(2px); /* Blurred to prevent sharpness */
      background-repeat: no-repeat;
    }

    .vein-1 {
      /* Large branching structure, top-right to center */
      background-image: url("data:image/svg+xml,%3Csvg width='100%25' height='100%25' viewBox='0 0 1000 1000' preserveAspectRatio='xMidYMid slice' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M800 100 L750 200 L760 250 L680 350 L700 400 L620 500 L650 550 L580 650' stroke='%2300eaff' stroke-width='1.5' fill='none' stroke-linecap='round'/%3E%3Cpath d='M760 250 L810 300 L800 350 L850 400' stroke='%2300eaff' stroke-width='1' fill='none' stroke-linecap='round'/%3E%3Cpath d='M680 350 L600 380 L590 430' stroke='%2300eaff' stroke-width='0.8' fill='none' stroke-linecap='round'/%3E%3C/svg%3E");
      background-size: 150%;
      background-position: top right;
      animation: pulse-vein 9s infinite alternate ease-in-out, spike-vein 14s infinite;
    }

    .vein-2 {
      /* Smaller sparse branch, bottom-left */
      background-image: url("data:image/svg+xml,%3Csvg width='100%25' height='100%25' viewBox='0 0 1000 1000' preserveAspectRatio='xMidYMid slice' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M200 800 L250 720 L230 650 L310 580 L290 500' stroke='%234fd1ff' stroke-width='1.2' fill='none' stroke-linecap='round'/%3E%3Cpath d='M250 720 L180 680 L190 620' stroke='%234fd1ff' stroke-width='0.8' fill='none' stroke-linecap='round'/%3E%3C/svg%3E");
      background-size: 120%;
      background-position: bottom left;
      animation: pulse-vein 11s infinite alternate ease-in-out, spike-vein 19s infinite 3s;
    }

    /* --- OVERLAY --- */
    .energy-overlay {
      position: absolute;
      inset: 0;
      opacity: 0.1;
      background: linear-gradient(135deg, rgba(0, 234, 255, 0.4) 0%, transparent 40%, rgba(0, 68, 255, 0.2) 80%, transparent 100%);
      background-size: 300% 300%;
      animation: gradient-shift 12s infinite ease-in-out alternate;
    }

    /* --- ANIMATIONS --- */
    @keyframes flow-1 {
      0% { transform: translate(0, 0) scale(1); }
      50% { transform: translate(15%, 10%) scale(1.1); }
      100% { transform: translate(-5%, 20%) scale(0.9); }
    }

    @keyframes flow-2 {
      0% { transform: translate(0, 0) scale(1); }
      50% { transform: translate(-20%, -10%) scale(0.95); }
      100% { transform: translate(10%, -20%) scale(1.05); }
    }

    @keyframes flow-3 {
      0% { transform: translate(0, 0) scale(1); }
      50% { transform: translate(10%, -15%) scale(1.15); }
      100% { transform: translate(-15%, 5%) scale(0.85); }
    }

    @keyframes streak-flow {
      0% { transform: rotate(-15deg) translateX(0%); }
      100% { transform: rotate(-15deg) translateX(-50%); } 
    }

    @keyframes streak-flow-reverse {
      0% { transform: rotate(5deg) translateX(-50%); }
      100% { transform: rotate(5deg) translateX(0%); } 
    }

    @keyframes gradient-shift {
      0% { background-position: 0% 0%; }
      50% { background-position: 100% 100%; }
      100% { background-position: 0% 100%; }
    }

    @keyframes pulse-vein {
      0% { opacity: 0.02; filter: blur(3px); }
      100% { opacity: 0.08; filter: blur(2px); }
    }

    /* Occasional energy surge spike */
    @keyframes spike-vein {
      0%, 94% { opacity: 0.02; }
      95% { opacity: 0.25; filter: blur(1px) drop-shadow(0 0 10px #00eaff); }
      96% { opacity: 0.05; }
      97% { opacity: 0.15; filter: blur(1.5px); }
      98%, 100% { opacity: 0.02; }
    }
  `]
})
export class EnergyBackgroundComponent {}
