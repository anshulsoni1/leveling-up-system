import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { ToastService, ToastMessage } from '../../services/toast.service';

@Component({
  selector: 'app-system-toast',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './system-toast.component.html',
  styleUrl: './system-toast.component.scss'
})
export class SystemToastComponent implements OnInit, OnDestroy {
  toasts: ToastMessage[] = [];
  private subscription: Subscription = new Subscription();

  constructor(private toastService: ToastService) {}

  ngOnInit() {
    this.subscription.add(
      this.toastService.toasts$.subscribe(toast => {
        this.toasts.push(toast);
        setTimeout(() => {
          this.removeToast(toast.id);
        }, 3000);
      })
    );
  }

  removeToast(id: string) {
    this.toasts = this.toasts.filter(t => t.id !== id);
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}