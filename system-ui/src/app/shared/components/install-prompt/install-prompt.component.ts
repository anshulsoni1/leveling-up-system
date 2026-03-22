import { Component, HostListener, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-install-prompt',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './install-prompt.component.html',
  styleUrls: ['./install-prompt.component.scss']
})
export class InstallPromptComponent implements OnInit {
  deferredPrompt: any;
  showPrompt = false;

  @HostListener('window:beforeinstallprompt', ['$event'])
  onbeforeinstallprompt(e: Event) {
    e.preventDefault();
    this.deferredPrompt = e;
    this.showPrompt = true;
  }

  ngOnInit() {
    window.addEventListener('appinstalled', () => {
      this.showPrompt = false;
      this.deferredPrompt = null;
    });
  }

  installApp() {
    this.showPrompt = false;
    if (this.deferredPrompt) {
      this.deferredPrompt.prompt();
      this.deferredPrompt.userChoice.then((choiceResult: any) => {
        this.deferredPrompt = null;
      });
    }
  }

  dismiss() {
    this.showPrompt = false;
  }
}