import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BookTrackerComponent } from './components/book-tracker/book-tracker.component';
import { ModuleShellComponent } from '../../../../shared/components/module-layout/shell';

@Component({
  selector: 'app-books-module',
  standalone: true,
  imports: [CommonModule, ModuleShellComponent, BookTrackerComponent],
  template: `
    <app-module-shell title="Book Reading">
      <div tracker>
        <app-book-tracker></app-book-tracker>
      </div>
    </app-module-shell>
  `
})
export class BooksComponent {}
