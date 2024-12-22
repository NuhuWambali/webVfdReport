import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SalesReportListComponent } from './sales-report-list/sales-report-list.component';
import { AuthGuard } from '../shared/guards/auth.guard';

const routes: Routes = [
  { path: 'list', component: SalesReportListComponent,canActivate: [AuthGuard]},
  // { path:'create', component: BranchCreateComponent },
  // { path: 'update/:id', component: BranchUpdateComponent },

  { path: '', redirectTo: '/sales-reports/list', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SalesReportsRoutingModule { }
