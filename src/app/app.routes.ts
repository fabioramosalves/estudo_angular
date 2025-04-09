import { Routes } from '@angular/router';
import { AuthGuard } from './auth/auth.guard';
import { redirectGuard } from './auth/redirectGuard';
import { LoginComponent } from './pages/login/login.component';
import { PriceMonitoringComponent } from './pages/price-monitoring/price-monitoring.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { RecoverPasswordComponent } from './pages/recover-password/recover-password.component';
import { ResetPasswordComponent } from './pages/reset-password/reset-password.component';

export const routes: Routes = [
  { path: '', canActivate: [redirectGuard], component: LoginComponent },
  { path: 'login', component: LoginComponent },
  { path: 'reset-password/:hash', component: ResetPasswordComponent },
  { path: 'recover-password', component: RecoverPasswordComponent },
  {
    path: 'price-monitoring', 
    component: PriceMonitoringComponent, 
    canActivate: [AuthGuard]
  },
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [AuthGuard],
  }
];