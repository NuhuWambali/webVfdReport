import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AuthGuard } from './shared/guards/auth.guard';

const routes: Routes = [
  { path: 'dashboard', component:DashboardComponent,canActivate: [AuthGuard]},
  { path: 'authentication', loadChildren: () => import('./authentication/authentication.module').then(m => m.AuthenticationModule) },
  { path: 'sales-reports', loadChildren: () => import('./sales-reports/sales-reports.module').then(m => m.SalesReportsModule) },
  { path: 'sales-items', loadChildren: () => import('./sales-items/sales-items.module').then(m => m.SalesItemsModule) },
  { path: 'z-reports', loadChildren: () => import('./z-reports/z-reports.module').then(m => m.SalesReportsModule) },

  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
