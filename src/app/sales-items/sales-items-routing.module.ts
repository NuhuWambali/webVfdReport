import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SalesItemsListComponent } from './sales-items-list/sales-items-list.component';
import { AuthGuard } from '../shared/guards/auth.guard';

const routes: Routes = [
    { path: 'list', component: SalesItemsListComponent,canActivate: [AuthGuard]},
    // { path:'create', component: BranchCreateComponent },
    // { path: 'update/:id', component: BranchUpdateComponent },
  
    { path: '', redirectTo: '/sales-items/list', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SalesItemsRoutingModule { }
