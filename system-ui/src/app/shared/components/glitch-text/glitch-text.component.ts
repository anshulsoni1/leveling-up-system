import { Component, Input, HostBinding } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-glitch-text',
  standalone: true,
  imports: [CommonModule],
  template: `
    <span class="glitch-wrapper" 
          [class.hover-only]="enableOnHover" 
          [class.with-shadows]="enableShadows"
          [style.--speed]="speed + 's'"
          [attr.data-text]="text">
      {{ text }}
    </span>
  `,
  styleUrls: ['./glitch-text.component.css']
})
export class GlitchTextComponent {
  @Input() text: string = '';
  @Input() speed: number = 0.6;
  @Input() enableShadows: boolean = true;
  @Input() enableOnHover: boolean = false;
  @HostBinding('class.glitch-strong') isStrong = true;
}
