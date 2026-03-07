import { Component, EventEmitter, Output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModuleService } from '../../../core/services/module.service';

@Component({
  selector: 'app-module-templates',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './module-templates.component.html',
  styleUrl: './module-templates.component.scss'
})
export class ModuleTemplatesComponent {
  @Output() templateCreated = new EventEmitter<void>();

  private moduleService = inject(ModuleService);

  templates = [
    { name: "Gym", icon: "🏋️", category: "body", trackingType: "habit", xpReward: 20 },
    { name: "Reading", icon: "📚", category: "knowledge", trackingType: "timer", xpReward: 15 },
    { name: "Coding", icon: "💻", category: "career", trackingType: "timer", xpReward: 30 },
    { name: "Meditation", icon: "🧘", category: "mind", trackingType: "habit", xpReward: 10 },
    { name: "Study Session", icon: "🎓", category: "knowledge", trackingType: "timer", xpReward: 20 }
  ];

  isCreating = false;

  createFromTemplate(template: any) {
    this.moduleService.createModule(template).subscribe({
      next: (res) => {
        console.log("Template module created:", res);
        this.templateCreated.emit();
      },
      error: (err) => {
        console.error("Template creation failed:", err);
      }
    });
  }
}
