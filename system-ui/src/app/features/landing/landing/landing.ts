import { Component, CUSTOM_ELEMENTS_SCHEMA, HostListener, OnInit, OnDestroy, ElementRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { GlitchTextComponent } from '../../../shared/components/glitch-text/glitch-text.component';

@Component({
  selector: 'app-landing',
  imports: [GlitchTextComponent],
  templateUrl: './landing.html',
  styleUrl: './landing.scss',
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class Landing implements OnInit, OnDestroy {
  @ViewChild('sysBtn', { static: false }) sysBtn!: ElementRef<HTMLButtonElement>;


  public btnHoverX = 50; 
  public btnHoverY = 50; 
  public isBtnHovered = false;
  
  public titleGlow = '0 0 10px rgba(0, 18a, 255, 0.6), 0 0 20px rgba(0, 150, 255, 0.3)';
  public btnTransform = 'perspective(400px) rotateX(0deg) rotateY(0deg) scale(1)';
  
  public starsTransform = 'translate3d(0px, 0px, 0px)';
  public nebula1Transform = 'translate3d(0px, 0px, 0px)';
  public nebula2Transform = 'translate3d(0px, 0px, 0px)';
  public starfieldBoxShadow = '';
  public parallaxTransform = 'translate3d(0px, 0px, 0px)';


  constructor(private router: Router) {}

  ngOnInit() {
  }

  ngOnDestroy() {
  }

  @HostListener('window:mousemove', ['$event'])
  onMouseMove(event: MouseEvent) {
    // HostListener preserved without body for future interactive extensions
  }

  onBtnMouseMove(event: MouseEvent) {
    if (!this.sysBtn) return;
    
    const rect = this.sysBtn.nativeElement.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    
    this.btnHoverX = (x / rect.width) * 100;
    this.btnHoverY = (y / rect.height) * 100;
    
    const tiltX = ((y / rect.height) - 0.5) * -15;
    const tiltY = ((x / rect.width) - 0.5) * 15;
    
    this.btnTransform = 'perspective(400px) rotateX(' + tiltX + 'deg) rotateY(' + tiltY + 'deg) scale(1.04)';
  }

  onBtnMouseEnter() {
    this.isBtnHovered = true;
  }

  onBtnMouseLeave() {
    this.isBtnHovered = false;
    this.btnHoverX = 50;
    this.btnHoverY = 50;
    this.btnTransform = 'perspective(400px) rotateX(0deg) rotateY(0deg) scale(1)';
  }


  createRipple(event: MouseEvent) {
    if (!this.sysBtn) return;
    
    const button = this.sysBtn.nativeElement;
    const rect = button.getBoundingClientRect();
    
    const ripple = document.createElement('span');
    ripple.classList.add('btn-ripple');
    
    const diameter = Math.max(rect.width, rect.height);
    const radius = diameter / 2;
    
    ripple.style.width = ripple.style.height = diameter + 'px';
    ripple.style.left = (event.clientX - rect.left - radius) + 'px';
    ripple.style.top = (event.clientY - rect.top - radius) + 'px';
    
    button.appendChild(ripple);
    setTimeout(() => {
      ripple.remove();
    }, 600);
  }

  enterSystem(event: MouseEvent) {
    this.createRipple(event);
    
    setTimeout(() => {
      this.router.navigate(['/system']);
    }, 300);
  }
}