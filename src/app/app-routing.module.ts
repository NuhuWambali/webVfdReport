import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AuthGuard } from './shared/guards/auth.guard';

const routes: Routes = [
  { path: 'dashboard', component:DashboardComponent,canActivate: [AuthGuard]},
  { path: 'authentication', loadChildren: () => import('./authentication/authentication.module').then(m => m.AuthenticationModule) },
  { path: 'sales-reports', loadChildren: () => import('./sales-reports/sales-reports.module').then(m => m.SalesReportsModule) },
  { path: 'sales-items', loadChildren: () => import('./sales-items/sales-items.module').then(m => m.SalesItemsModule) },

  // { path: 'borders', loadChildren: () => import('./border-ports/border/border.module').then(m => m.BorderModule) },
  // { path: 'device-category', loadChildren: () => import('./device-category/device-category.module').then(m => m.DeviceCategoryModule) },
  // { path: 'device-types', loadChildren: () => import('./device-type/device-type.module').then(m => m.DeviceTypeModule) },
  // { path: 'reports', loadChildren: () => import('./reports/reports.module').then(m => m.ReportsModule) },
  // { path: 'awaiting', loadChildren: () => import('./device-management/awaiting-storage/awaiting-storage.module').then(m => m.AwaitingStorageModule) },
  // { path: 'store', loadChildren: () => import('./device-management/store/store.module').then(m =>m.StoreModule) },
  // { path: 'awaiting', loadChildren: () => import('./device-management/awaiting-allocation/awaiting-allocation.module').then(m =>m.AwaitingAllocationModule) },
  // { path: 'released-devices', loadChildren: () => import('./device-management/released/released.module').then(m =>m.ReleasedModule) },
  // { path: 'border-return', loadChildren: () => import('./device-management/border-return/border-return.module').then(m =>m.BorderReturnModule) },
  // { path: 'maintanance', loadChildren: () => import('./device-management/maintanance/maintanance.module').then(m =>m.MaintananceModule) },
  // { path: 'demaged', loadChildren: () => import('./device-management/demaged/demaged.module').then(m =>m.DemagedModule) },
  // { path: 'users', loadChildren: () => import('./users/users.module').then(m =>m.UsersModule) },
  // { path: 'users', component: UserListComponent },
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
