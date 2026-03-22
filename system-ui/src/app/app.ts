import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SystemToastComponent } from './shared/components/system-toast/system-toast.component';
import { LoaderComponent } from './shared/components/loader/loader.component';
import { CommandPaletteComponent } from './shared/components/command-palette/command-palette.component';
import { InstallPromptComponent } from './shared/components/install-prompt/install-prompt.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, SystemToastComponent, LoaderComponent, CommandPaletteComponent, InstallPromptComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('system-ui');
}