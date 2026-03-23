import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { System } from './system/system';
import { SystemDashboard } from './dashboard/dashboard';
import { ModulePlaceholder } from './components/module-placeholder/module-placeholder';
import { BooksComponent } from './modules/books/books.component';
import { ModulePageComponent } from './module-page/module-page.component';
import { DsaComponent } from './modules/dsa/dsa.component';
import { SkillsComponent } from './modules/skills/skills.component';
import { JournalComponent } from './journal/journal.component';
import { AnalyticsComponent } from './analytics/analytics.component';
import { ProfileComponent } from './profile/profile.component';
import { TasksComponent } from './tasks/tasks.component';
import { TemplatesComponent } from './templates/templates.component';
import { ModulesPageComponent } from './modules-page/modules-page.component';

const routes: Routes = [
  { 
    path: '', 
    component: System,
    children: [
      { path: '', component: SystemDashboard },
      { path: 'tasks', component: TasksComponent },
      { path: 'templates', component: TemplatesComponent },
      { path: 'modules', component: ModulesPageComponent },
      { path: 'books', component: BooksComponent },
      { path: 'module/:id', component: ModulePageComponent },
      { path: 'dsa', component: DsaComponent },
      { path: 'skills', component: SkillsComponent },
      { path: 'journal', component: JournalComponent },
      { path: 'analytics', component: AnalyticsComponent },
      { path: 'profile', component: ProfileComponent },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SystemRoutingModule { }
