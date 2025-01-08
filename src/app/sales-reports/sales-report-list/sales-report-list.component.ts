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
  isLoading: boolean = false;  // This controls the loader visibility
  errorMessage: string = '';
  salesReports:any;
  selectedItems: any[] = [];
  token: string = '';
  loading: boolean = true;
  currentPage: number = 1;
  totalPages: number = 1;
  totalPagesArray: number[] = [];
  displayedPages: number[] = [];
  size: number = 50;
  startDate: Date | null = null;
  endDate: Date | null = null;
  companyId: number = 0;
  dateRangeForm!: FormGroup ;
  dateRangeMessage: string | null = null;
  
  constructor(private fb: FormBuilder,
    private repository: SalesReportRepositoryService,
    private authService: AuthenticationService,
    private errorHandler: ErrorHandlerService,
    private router: Router, private activeRoute: ActivatedRoute,
    private cdr: ChangeDetectorRef
  ) {
   
   }

  

  
  ngOnInit(): void {
   
    this.dateRangeForm = this.fb.group({
      startDate: new FormControl(Date, [Validators.required]),
      endDate: new FormControl(Date, [Validators.required, ]),
    });
    this.isLoading = true;  
    this.loadPage(this.currentPage);
  
  }

  
  loadPage(page: number): void {
    this.isLoading = true; 
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
    const companyId: string = sessionStorage.getItem('company_id') || '';
    if (!companyId) {
      console.error('Company ID not found in localStorage');
      this.isLoading = false;
      return;
    }

    const apiUrl = `api/v1/get-incoming-sales-report/${companyId}?page=${page}&size=${size}`;
    this.repository.getAllSalesReport(apiUrl).subscribe({
      next: (response: any) => {
        this.salesReports = response.body.content;
        this.totalPages = response.body.totalPages;
        this.updateDisplayedPages();
        this.isLoading = false;
      },
      error: (err: HttpErrorResponse) => {
        this.errorHandler.handleError(err);
        this.isLoading = false;
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

        const currentDate = new Date().toLocaleString('en-GB', {
          day: '2-digit',
          month: 'short',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        });
  
        const reportTitle = [`Sales Report - ${currentDate}`];
  
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
          item.customerName,
          item.customerID,
        ]);
  
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
  
        const fileName = `SalesReport_${currentDate.replace(/[:,\s]/g, '_')}.xlsx`;
  
        XLSX.writeFile(wb, fileName);
  
        Swal.fire('Exported!', 'Your file has been exported.', 'success');
      }
    });
  }


  onSubmitDateRange(dateRangeForm: any): void {
    this.startDate = dateRangeForm.startDate;  // Store the start date
    this.endDate = dateRangeForm.endDate;  
    this.isLoading = true;
    if (this.dateRangeForm.invalid) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Please select both start and end dates.',
      });
      return;
    }
  
    const { startDate, endDate, vatRate } = this.dateRangeForm.value;
  
    const startDateObject = new Date(startDate);
    const endDateObject = new Date(endDate);
  
    const formattedStartDate = this.formatDateForDisplay(startDateObject);
    const formattedEndDate = this.formatDateForDisplay(endDateObject);
  
    const backendStartDate = this.formatDateForBackend(startDateObject);
    const backendEndDate = this.formatDateForBackend(endDateObject);
  
    Swal.fire({
      title: 'Are you sure?',
      text: `You are searching for receipts from ${formattedStartDate} to ${formattedEndDate}.`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Yes, proceed',
      cancelButtonText: 'Cancel',
    }).then((result) => {
      if (result.isConfirmed) {
        this.dateRangeMessage = ` ${formattedStartDate} to ${formattedEndDate}`; // Update message
        this.searchByDateRange(backendStartDate, backendEndDate, );
        this.isLoading = false;
      }
    });
  }
  
  searchByDateRange(startDate: string, endDate: string): void {
    
    this.isLoading=true
    const companyId: string = localStorage.getItem('company_id') || '';
    if (!companyId) {
      console.error('Company ID not found in localStorage');
      this.isLoading = false;
      return;
    }

    const apiUrl = `api/v1/sales-reports-dates-search`;  
    this.repository.searchByDates(apiUrl, startDate, endDate, +companyId ).subscribe({
      next: (response: any) => {  
        // If the response directly returns an array, use it to set salesItems
        this.salesReports = response.body; 
        this.totalPages = response.body.totalPages;

        this.updateDisplayedPages();
        this.isLoading=false;
        
      },
      error: (err: HttpErrorResponse) => {
        this.isLoading = false; 
        console.error('Error fetching Sales Report:', err.message);
      }
    });
  }
  
  formatDateForDisplay(date: Date): string {
    const d = new Date(date);
    const day = ('0' + d.getDate()).slice(-2); // Ensure two digits for day
    const month = ('0' + (d.getMonth() + 1)).slice(-2); // Ensure two digits for month, and months are 0-indexed
    const year = d.getFullYear();
  
    return `${day}/${month}/${year}`;
  }
  
  // Format the Date objects into DD/MM/YYYY format for backend request
  formatDateForBackend(date: Date): string {
    const d = new Date(date);
    const day = ('0' + d.getDate()).slice(-2);
    const month = ('0' + (d.getMonth() + 1)).slice(-2); // Ensure two digits for month
    const year = d.getFullYear();
  
    return `${day}/${month}/${year}`; // DD/MM/YYYY format
  }
  
  

  
 
  


  
}





