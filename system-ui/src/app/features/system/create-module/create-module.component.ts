import { Component, EventEmitter, Output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ModuleService } from '../../../core/services/module.service';

@Component({
  selector: 'app-create-module',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './create-module.component.html',
  styleUrl: './create-module.component.scss'
})
export class CreateModuleComponent {
  @Output() close = new EventEmitter<void>();
  @Output() moduleCreated = new EventEmitter<void>();

  private fb = inject(FormBuilder);
  private moduleService = inject(ModuleService);

  moduleForm: FormGroup = this.fb.group({
    name: ['', Validators.required],
    icon: ['⚔️', Validators.required],
    category: ['custom', Validators.required],
    trackingType: ['habit', Validators.required],
    xpReward: [20, Validators.required]
  });

  isCreating = false;

  form = this.moduleForm; // Alias to match user instructions

  closeModal() {
    this.close.emit();
  }

  createModule() {
    if (this.moduleForm.invalid) return;
    this.isCreating = true;
    
    this.moduleService.createModule(this.form.value).subscribe({
      next: (res) => {
        console.log("Module created:", res);
        this.isCreating = false;
        this.closeModal();
        this.moduleCreated.emit();
      },
      error: (err) => {
        console.error('Module creation failed', err);
        this.isCreating = false;
      }
    });
  }
}
