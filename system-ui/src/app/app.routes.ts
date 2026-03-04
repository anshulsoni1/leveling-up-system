import { Routes } from '@angular/router';
import { Landing } from './features/landing/landing/landing';
import { LoginComponent } from './pages/login/login.component';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  { path: '', component: LoginComponent },
  { path: 'intro', component: Landing, canActivate: [authGuard] },
  { 
    path: 'system', 
    canActivate: [authGuard],
    loadChildren: () => import('./features/system/system-module').then(m => m.SystemModule) 
  }
];