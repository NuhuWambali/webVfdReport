import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SalesItemsRoutingModule } from './sales-items-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SalesItemsListComponent } from './sales-items-list/sales-items-list.component';


@NgModule({
  declarations: [
    SalesItemsListComponent,
  ],
  imports: [
    CommonModule,
    SalesItemsRoutingModule,
    FormsModule, 
    ReactiveFormsModule
  ]
})
export class SalesItemsModule { }
