import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { System } from './system/system';
import { SystemDashboard } from './dashboard/dashboard';
import { ModulePlaceholder } from './components/module-placeholder/module-placeholder';
import { BooksComponent } from './modules/books/books.component';
import { DsaComponent } from './modules/dsa/dsa.component';
import { SkillsComponent } from './modules/skills/skills.component';

const routes: Routes = [
  { 
    path: '', 
    component: System,
    children: [
      { path: '', component: SystemDashboard },
      { path: 'books', component: BooksComponent },
      { path: 'dsa', component: DsaComponent },
      { path: 'skills', component: SkillsComponent },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SystemRoutingModule { }
