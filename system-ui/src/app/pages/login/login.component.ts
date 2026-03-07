import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { GlitchTextComponent } from '../../shared/components/glitch-text/glitch-text.component';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, GlitchTextComponent],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  email = '';
  password = '';
  isLoginMode = true;
  error = '';
  isLoading = false;

  constructor(private authService: AuthService, private router: Router) {}

  toggleMode() {
    this.isLoginMode = !this.isLoginMode;
    this.error = '';
  }

  onSubmit() {
    if (!this.email || !this.password) {
      this.error = 'Must provide email and password';
      return;
    }

    this.isLoading = true;
    this.error = '';

    const obs$ = this.isLoginMode
      ? this.authService.login(this.email, this.password)
      : this.authService.signup(this.email, this.password);

    obs$.subscribe({
      next: () => {
        console.log('Login successful! Token saved intercepting requests.');
        this.isLoading = false;
        this.router.navigate(['/system/dashboard']);
      },
      error: (err) => {
        this.isLoading = false;
        this.error = err.error?.message || 'Authentication failed';
      }
    });
  }
}