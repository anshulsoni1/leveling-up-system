import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SystemToastComponent } from './shared/components/system-toast/system-toast.component';
import { LoaderComponent } from './shared/components/loader/loader.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, SystemToastComponent, LoaderComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('system-ui');
}