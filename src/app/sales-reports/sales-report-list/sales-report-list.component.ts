import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectorRef, Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthenticationService } from 'src/app/shared/services/authentication.service';
import { ErrorHandlerService } from 'src/app/shared/services/error-handler.service';
import { SalesReportRepositoryService } from 'src/app/shared/services/sales-report.service';
import Swal from 'sweetalert2';
import * as XLSX from 'xlsx';
declare var $: any;


@Component({
  selector: 'app-sales-report-list',
  templateUrl: './sales-report-list.component.html',
  styleUrls: ['./sales-report-list.component.css']
})

export class SalesReportListComponent {
  errorMessage: string = '';
  salesReports:any;
  selectedItems: any[] = [];
  token: string = '';
  loading: boolean = true;
  currentPage: number = 1;
  totalPages: number = 1;
  totalPagesArray: number[] = [];
  displayedPages: number[] = [];
  size: number = 15;
  startDate: Date | null = null;
  endDate: Date | null = null;
  companyId: number = 0;
  dateRangeForm!: FormGroup ;
  
  constructor(private fb: FormBuilder,
    private repository: SalesReportRepositoryService,
    private authService: AuthenticationService,
    private errorHandler: ErrorHandlerService,
    private router: Router, private activeRoute: ActivatedRoute,
    private cdr: ChangeDetectorRef
  ) {
   
   }

  

  
  ngOnInit(): void {
    this.loading = false;
    // this.getAllSalesReportsFunction();
    this.loadPage(this.currentPage);
    this.dateRangeForm = this.fb.group({
      startDate: new FormControl(Date, [Validators.required]),
      endDate: new FormControl(Date, [Validators.required, ]),
    });
  
  }

  
  loadPage(page: number): void {
    if (page < 1 || page > this.totalPages) return;
    this.currentPage = page;
    this.updateDisplayedPages();
    this.getAllSalesReportsFunction(page, this.size);
  }

  updateDisplayedPages(): void {
    const maxPagesToShow = 8;
    const startPage = Math.max(1, this.currentPage - Math.floor(maxPagesToShow / 2));
    const endPage = Math.min(this.totalPages, startPage + maxPagesToShow - 1);

    this.displayedPages = [];
    for (let i = startPage; i <= endPage; i++) {
      this.displayedPages.push(i);
    }
  }


  private getAllSalesReportsFunction(page: number, size: number): void {
    const companyId: string = localStorage.getItem('company_id') || '';
    if (!companyId) {
      console.error('Company ID not found in localStorage');
      return;
    }

    const apiUrl = `api/v1/get-incoming-sales-report/${companyId}?page=${page}&size=${size}`;
    this.repository.getAllSalesReport(apiUrl).subscribe({
      next: (response: any) => {
        this.salesReports = response.body.content;
        this.totalPages = response.body.totalPages;
        this.updateDisplayedPages();
      },
      error: (err: HttpErrorResponse) => {
        this.errorHandler.handleError(err);
      }
    });
  }
  
  
  onItemCheck(event: any, item: any): void {
    if (event.target.checked) {
      this.selectedItems.push(item);

    } else {
      this.selectedItems = this.selectedItems.filter(i => i !== item);
    }
  }

  selectAll(event: any): void {
    if (event.target.checked) {
      this.selectedItems = [...this.salesReports];
    } else {
      this.selectedItems = [];
    }
    this.salesReports.forEach((item: { selected: any; }) => (item.selected = event.target.checked));
  }

  exportToExcel(): void {
    if (this.selectedItems.length === 0) {
      Swal.fire('No items selected', 'Please select at least 1 item to export.', 'warning');
      return;
    }
  
    Swal.fire({
      title: 'Are you sure?',
      text: `You have selected ${this.selectedItems.length} item(s). Do you want to export them to Excel?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, export it!',
      cancelButtonText: 'Cancel',
    }).then(result => {
      if (result.isConfirmed) {
        // Get current date for the title and file name
        const currentDate = new Date().toLocaleString('en-GB', {
          day: '2-digit',
          month: 'short',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        });
  
        // Title for the report
        const reportTitle = [`Sales Report - ${currentDate}`];
  
        // Column headers
        const columnHeaders = [
          'Invoice No',
          'Z Number',
          'Fiscal Code',
          'Receipt Date',
          'NET Amount',
          'Tax Amount',
          'Payment Amount',
          'Customer Name',
          'Customer ID',
        ];
  
        // Format data for export
        const formattedData = this.selectedItems.map(item => [
          item.referenceNo,
          item.znumber,
          item.fiscalCode,
          new Date(item.dateTime).toLocaleString('en-GB', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
          }),
          Number(item.totalAmountTaxEx).toLocaleString(),
          Number(item.totalTaxAmount).toLocaleString(),
          Number(item.totalAmountTaxInc).toLocaleString(),
          item.customername,
          item.customerID,
        ]);
  
        // Combine title, column headers, and data into a single array
        const sheetData = [reportTitle, [], columnHeaders, ...formattedData];
  
        // Create worksheet and workbook
        const ws: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(sheetData);
        const wb: XLSX.WorkBook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Sales Report');
  
        // Style the title row
        ws['A1'].s = { font: { bold: true, sz: 14 }, alignment: { horizontal: 'center' } };
        ws['!merges'] = [
          { s: { r: 0, c: 0 }, e: { r: 0, c: columnHeaders.length - 1 } } // Merge title row
        ];
  
        // Generate filename with current date
        const fileName = `SalesReport_${currentDate.replace(/[:,\s]/g, '_')}.xlsx`;
  
        // Export to file
        XLSX.writeFile(wb, fileName);
  
        Swal.fire('Exported!', 'Your file has been exported.', 'success');
      }
    });
  }


  // ngAfterViewInit(): void {
  //   ($('#start_date') as any).datepicker({
  //     format: 'yyyy-mm-dd',
  //     autoclose: true
  //   }).on('changeDate', (event: any) => {
  //     const formattedDate = this.formatDate(event.date);
  //     this.dateRangeForm.patchValue({ startDate: formattedDate });
  //   });
  
  //   ($('#end_date') as any).datepicker({
  //     format: 'yyyy-mm-dd',
  //     autoclose: true
  //   }).on('changeDate', (event: any) => {
  //     const formattedDate = this.formatDate(event.date);
  //     this.dateRangeForm.patchValue({ endDate: formattedDate });
  //   });
  
  //   // Update datepickers when form values change
  //   this.dateRangeForm.get('startDate')?.valueChanges.subscribe((value) => {
  //     ($('#start_date') as any).datepicker('update', value);
  //   });
  
  //   this.dateRangeForm.get('endDate')?.valueChanges.subscribe((value) => {
  //     ($('#end_date') as any).datepicker('update', value);
  //   });
  // }


  onSubmitDateRange(dateRangeForm:any): void {
    console.log(dateRangeForm)
    if (this.dateRangeForm.invalid) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Please select both start and end dates.',
      });
      return;
    }

    const { startDate, endDate } = this.dateRangeForm.value;

    Swal.fire({
      title: 'Are you sure?',
      text: `You are searching for receipts from ${startDate} to ${endDate}.`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Yes, proceed',
      cancelButtonText: 'Cancel',
    }).then((result) => {
      if (result.isConfirmed) {
        this.searchByDateRange(startDate, endDate);
      }
    });
  }

  searchByDateRange(startDate: Date, endDate: Date): void {
    const companyId: string = localStorage.getItem('company_id') || '';
    if (!companyId) {
      console.error('Company ID not found in localStorage');
      return;
    }

    const apiUrl = `api/v1/sales-reports-dates-search`;
    this.repository.searchByDates(apiUrl, startDate, endDate, +companyId).subscribe({
      next: (response: any) => {
        this.salesReports = response.body.content;
        console.log(this.salesReports);
        this.totalPages = response.body.totalPages;
        this.updateDisplayedPages();
      },
      error: (err: HttpErrorResponse) => {
        console.error('Error fetching sales report:', err.message);
      }
    });
  }

 
  



  redirectToBranchList = () => {
    this.router.navigate(['/sales-reports/list']);
  }

  
}





