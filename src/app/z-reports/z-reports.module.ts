import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'; // Import this
import { SalesReportsRoutingModule } from './z-reports-routing.module';
import { ZReportListComponent } from './z-reports-list/z-report-list.component';


@NgModule({
  declarations: [
    ZReportListComponent
  ],
  imports: [
    CommonModule,
    FormsModule,  // Add FormsModule here
    SalesReportsRoutingModule,
    ReactiveFormsModule
  ]
})
export class SalesReportsModule { }
