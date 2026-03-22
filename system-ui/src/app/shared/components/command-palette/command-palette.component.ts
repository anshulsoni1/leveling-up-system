import { Component, inject, signal, computed, HostListener, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

interface PaletteCommand {
  id: string;
  label: string;
  icon: string;
  action: () => void;
}

@Component({
  selector: 'app-command-palette',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="palette-overlay" *ngIf="isOpen()" (click)="close()">
      <div class="palette-modal" (click)="$event.stopPropagation()">
        <div class="palette-header">
          <span class="palette-hint">⌘ COMMAND PALETTE</span>
          <span class="palette-shortcut">ESC to close</span>
        </div>
        <input #searchInput
          class="palette-input"
          [(ngModel)]="query"
          (ngModelChange)="onSearch()"
          placeholder="Type a command..."
          autocomplete="off"
          spellcheck="false" />
        <div class="palette-results">
          <button *ngFor="let cmd of filteredCommands(); let i = index"
            class="palette-item" [class.active]="i === selectedIndex()"
            (click)="execute(cmd)" (mouseenter)="selectedIndex.set(i)">
            <span class="cmd-icon">{{ cmd.icon }}</span>
            <span class="cmd-label">{{ cmd.label }}</span>
          </button>
          <div *ngIf="filteredCommands().length === 0" class="no-results">
            NO MATCHING COMMANDS
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .palette-overlay {
      position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
      background: rgba(2, 6, 18, 0.8); backdrop-filter: blur(6px);
      z-index: 10000; display: flex; align-items: flex-start; justify-content: center;
      padding-top: 15vh; animation: overlayIn 0.15s ease;
    }
    .palette-modal {
      width: 500px; max-width: 90vw;
      background: rgba(8, 14, 30, 0.98);
      border: 1px solid rgba(0, 200, 255, 0.25);
      border-radius: 12px; overflow: hidden;
      box-shadow: 0 0 40px rgba(0, 200, 255, 0.1), 0 20px 60px rgba(0, 0, 0, 0.5);
      animation: modalIn 0.2s cubic-bezier(0.16, 1, 0.3, 1);
    }
    .palette-header {
      display: flex; justify-content: space-between; align-items: center;
      padding: 0.6rem 1rem; border-bottom: 1px solid rgba(0, 200, 255, 0.1);
    }
    .palette-hint {
      font-family: 'Orbitron', sans-serif; font-size: 0.55rem;
      color: rgba(0, 200, 255, 0.5); letter-spacing: 2px;
    }
    .palette-shortcut {
      font-family: 'Rajdhani', sans-serif; font-size: 0.65rem;
      color: rgba(255, 255, 255, 0.3); letter-spacing: 1px;
    }
    .palette-input {
      width: 100%; padding: 1rem 1.25rem; background: transparent;
      border: none; border-bottom: 1px solid rgba(0, 200, 255, 0.1);
      color: #e0e8f0; font-family: 'Rajdhani', sans-serif; font-size: 1.1rem;
      font-weight: 600; letter-spacing: 1px; outline: none;
      caret-color: #00c8ff;
    }
    .palette-input::placeholder {
      color: rgba(180, 200, 220, 0.3); letter-spacing: 1px;
    }
    .palette-results { max-height: 300px; overflow-y: auto; padding: 0.5rem; }
    .palette-item {
      display: flex; align-items: center; gap: 0.75rem;
      width: 100%; padding: 0.7rem 1rem; background: transparent;
      border: 1px solid transparent; border-radius: 6px;
      color: rgba(180, 200, 220, 0.7); cursor: pointer;
      font-family: 'Rajdhani', sans-serif; font-size: 0.9rem;
      font-weight: 600; letter-spacing: 1px; text-align: left;
      transition: all 0.15s ease;
    }
    .palette-item:hover, .palette-item.active {
      color: #00c8ff; background: rgba(0, 200, 255, 0.06);
      border-color: rgba(0, 200, 255, 0.15);
    }
    .cmd-icon { font-size: 1.1rem; min-width: 24px; text-align: center; }
    .no-results {
      padding: 1.5rem; text-align: center;
      font-family: 'Rajdhani', sans-serif; font-size: 0.8rem;
      color: rgba(180, 200, 220, 0.3); letter-spacing: 2px;
    }
    @keyframes overlayIn { from { opacity: 0; } to { opacity: 1; } }
    @keyframes modalIn {
      from { opacity: 0; transform: scale(0.95) translateY(-10px); }
      to { opacity: 1; transform: scale(1) translateY(0); }
    }
  `]
})
export class CommandPaletteComponent {
  private router = inject(Router);
  private authService = inject(AuthService);
  @ViewChild('searchInput') searchInput!: ElementRef;

  isOpen = signal(false);
  query = '';
  selectedIndex = signal(0);

  commands: PaletteCommand[] = [
    { id: 'dashboard', label: 'Go to Dashboard', icon: '◆', action: () => this.navigate('/system') },
    { id: 'analytics', label: 'Open Analytics', icon: '◈', action: () => this.navigate('/system/analytics') },
    { id: 'journal', label: 'Open Journal', icon: '◇', action: () => this.navigate('/system/journal') },
    { id: 'profile', label: 'View Profile', icon: '◎', action: () => this.navigate('/system/profile') },
    { id: 'books', label: 'Open Books Module', icon: '📖', action: () => this.navigate('/system/books') },
    { id: 'dsa', label: 'Open DSA Module', icon: '⚡', action: () => this.navigate('/system/dsa') },
    { id: 'skills', label: 'Open Skills Module', icon: '🎯', action: () => this.navigate('/system/skills') },
    { id: 'quest', label: 'Add Quest', icon: '⚔', action: () => this.navigate('/system') },
    { id: 'logout', label: 'Logout', icon: '⏻', action: () => this.logout() },
  ];

  filteredCommands = computed(() => {
    const q = this.query.toLowerCase().trim();
    if (!q) return this.commands;
    return this.commands.filter(c => c.label.toLowerCase().includes(q) || c.id.includes(q));
  });

  @HostListener('document:keydown', ['$event'])
  handleKeydown(event: KeyboardEvent) {
    if ((event.ctrlKey || event.metaKey) && event.key === 'k') {
      event.preventDefault();
      this.toggle();
    }
    if (event.key === 'Escape' && this.isOpen()) {
      this.close();
    }
    if (this.isOpen()) {
      if (event.key === 'ArrowDown') {
        event.preventDefault();
        const max = this.filteredCommands().length - 1;
        this.selectedIndex.update(i => Math.min(i + 1, max));
      }
      if (event.key === 'ArrowUp') {
        event.preventDefault();
        this.selectedIndex.update(i => Math.max(i - 1, 0));
      }
      if (event.key === 'Enter') {
        event.preventDefault();
        const cmds = this.filteredCommands();
        if (cmds.length > 0) this.execute(cmds[this.selectedIndex()]);
      }
    }
  }

  toggle() {
    this.isOpen.update(v => !v);
    if (this.isOpen()) {
      this.query = '';
      this.selectedIndex.set(0);
      setTimeout(() => this.searchInput?.nativeElement?.focus(), 50);
    }
  }

  close() { this.isOpen.set(false); }

  onSearch() { this.selectedIndex.set(0); }

  execute(cmd: PaletteCommand) {
    this.close();
    cmd.action();
  }

  private navigate(route: string) { this.router.navigate([route]); }
  private logout() { this.authService.logout(); this.router.navigate(['/']); }
}