import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms'; // Import this
import { SalesReportsRoutingModule } from './sales-reports-routing.module';
import { SalesReportListComponent } from './sales-report-list/sales-report-list.component';
import { FormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    SalesReportListComponent
  ],
  imports: [
    CommonModule,
    FormsModule,  // Add FormsModule here
    SalesReportsRoutingModule,
    ReactiveFormsModule
  ]
})
export class SalesReportsModule { }
