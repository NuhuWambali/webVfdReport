import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../shared/guards/auth.guard';
import { ZReportListComponent } from './z-reports-list/z-report-list.component';

const routes: Routes = [
  { path: 'list', component: ZReportListComponent,canActivate: [AuthGuard]},
  // { path:'create', component: BranchCreateComponent },
  // { path: 'update/:id', component: BranchUpdateComponent },

  { path: '', redirectTo: '/z-reports/list', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SalesReportsRoutingModule { }
