import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../../core/services/user.service';
import { SystemStateService } from '../../../shared/services/system-state.service';
import { ToastService } from '../../../shared/services/toast.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  private userService = inject(UserService);
  stateService = inject(SystemStateService);
  private toastService = inject(ToastService);

  userProfile = signal<any>(null);
  
  // Editable fields
  editDisplayName = signal<string>('');
  editAvatarUrl = signal<string>('');
  isSubmitting = signal<boolean>(false);

  ngOnInit() {
    this.loadProfile();
  }

  loadProfile() {
    this.userService.getMe().subscribe({
      next: (user) => {
        if (user) {
          this.userProfile.set(user);
          this.editDisplayName.set(user.displayName || user.email || 'Shadow Monarch');
          this.editAvatarUrl.set(user.avatarUrl || '');
        }
      },
      error: (err) => console.error('Failed to load profile', err)
    });
  }

  saveProfile() {
    this.isSubmitting.set(true);
    const updates = { 
      displayName: this.editDisplayName(), 
      avatarUrl: this.editAvatarUrl() 
    };

    this.userService.updateProfile(updates).subscribe({
      next: (updatedUser) => {
        this.userProfile.set(updatedUser);
        this.stateService.setStateFromApi(updatedUser); // Keep system state up-to-date
        this.isSubmitting.set(false);
        this.toastService.show('PROFILE UPDATED', 'xp');
      },
      error: (err) => {
        console.error('Failed to update profile', err);
        // Fallback for local testing if API isn't ready
        const current = this.userProfile() || {};
        this.userProfile.set({ ...current, ...updates });
        this.isSubmitting.set(false);
        this.toastService.show('PROFILE UPDATED (Local)', 'warning');
      }
    });
  }
}
