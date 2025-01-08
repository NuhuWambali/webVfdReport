import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectorRef, Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthenticationService } from 'src/app/shared/services/authentication.service';
import { ErrorHandlerService } from 'src/app/shared/services/error-handler.service';
import { SalesItemsRepositoryService } from 'src/app/shared/services/sales-items.service';
import { SalesReportRepositoryService } from 'src/app/shared/services/sales-report.service';
import Swal from 'sweetalert2';
import * as XLSX from 'xlsx';
declare var $: any;

@Component({
  selector: 'app-sales-items-list',
  templateUrl: './sales-items-list.component.html',
  styleUrls: ['./sales-items-list.component.css']
})

export class SalesItemsListComponent {
  isLoading: boolean = false;  // This controls the loader visibility
  errorMessage: string = '';
  salesItems: any;
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
  vatRate!:string;
  companyId: number = 0;
  dateRangeForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private repository: SalesItemsRepositoryService,
    private authService: AuthenticationService,
    private errorHandler: ErrorHandlerService,
    private router: Router, 
    private activeRoute: ActivatedRoute,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {

    this.isLoading=true;
    this.dateRangeForm = this.fb.group({
      startDate: new FormControl(Date, [Validators.required]),
      endDate: new FormControl(Date, [Validators.required]),
      vatRate: new FormControl('', ),
    });
    this.loadPage(this.currentPage);
  }

  loadPage(page: number): void {
    this.isLoading = true; 
    if (page < 1 || page > this.totalPages) return;
    this.currentPage = page;
    this.updateDisplayedPages();
    this.getAllSalesItemsFunction(page, this.size);
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

  private getAllSalesItemsFunction(page: number, size: number): void {
    const companyId: string = localStorage.getItem('company_id') || '';
    if (!companyId) {
      console.error('Company ID not found in localStorage');
      this.isLoading = false;
      return;
    }
    const apiUrl = `api/v1/sales-items/${companyId}?page=${page}&size=${size}`;
    this.repository.getAllSalesItems(apiUrl).subscribe({
      next: (response: any) => {
        this.salesItems = response.body.content;
        this.totalPages = response.body.totalPages;
        this.updateDisplayedPages();
        this.isLoading = false;
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
      this.selectedItems = [...this.salesItems];
    } else {
      this.selectedItems = [];
    }
    this.salesItems.forEach((item: { selected: any; }) => (item.selected = event.target.checked));
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
          'Vat Rate',
          'Payment Type',
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
          Number(item.nettamount).toLocaleString(),
          Number(item.taxamount).toLocaleString(),
          Number(item.pmtamount).toLocaleString(),
          item.vatrate,
          item.pmttype,
        ]);

        // Combine title, column headers, and data into a single array
        const sheetData = [reportTitle, [], columnHeaders, ...formattedData];

        // Create worksheet and workbook
        const ws: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(sheetData);
        const wb: XLSX.WorkBook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Sales Items');

        // Style the title row
        ws['A1'].s = { font: { bold: true, sz: 14 }, alignment: { horizontal: 'center' } };
        ws['!merges'] = [
          { s: { r: 0, c: 0 }, e: { r: 0, c: columnHeaders.length - 1 } } // Merge title row
        ];

        // Generate filename with current date
        const fileName = `SalesItems_${currentDate.replace(/[:,\s]/g, '_')}.xlsx`;

        // Export to file
        XLSX.writeFile(wb, fileName);

        Swal.fire('Exported!', 'Your file has been exported.', 'success');
      }
    });
  }

  onSubmitDateRange(dateRangeForm: any): void {
    this.startDate = dateRangeForm.startDate;  // Store the start date
    this.endDate = dateRangeForm.endDate; 
    this.vatRate= dateRangeForm.vatRate;

    if (this.dateRangeForm.invalid) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Please select both start and end dates.',
      });
      return;
    }
  
    const { startDate, endDate, vatRate } = this.dateRangeForm.value; // Including vatRate
  
    // Convert the startDate and endDate to Date objects
    const startDateObject = new Date(startDate);
    const endDateObject = new Date(endDate);
  
    // Format the dates for display (DD/MM/YYYY format)
    const formattedStartDate = this.formatDateForDisplay(startDateObject);
    const formattedEndDate = this.formatDateForDisplay(endDateObject);
  
    // Send dates in DD/MM/YYYY format for the backend request
    const backendStartDate = this.formatDateForBackend(startDateObject);
    const backendEndDate = this.formatDateForBackend(endDateObject);
  
    Swal.fire({
      title: 'Are you sure?',
      text: `You are searching for receipts from ${formattedStartDate} to ${formattedEndDate} with Vat Rate ${vatRate}.`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Yes, proceed',
      cancelButtonText: 'Cancel',
    }).then((result) => {
      if (result.isConfirmed) {
        this.isLoading=true;
        this.searchByDateRange(backendStartDate, backendEndDate, vatRate); // Pass vatRate to backend
      }
    });
  }
  
  searchByDateRange(startDate: string, endDate: string, vatRate?: string): void {
    const companyId: string = localStorage.getItem('company_id') || '';
    if (!companyId) {
      console.error('Company ID not found in localStorage');
      this.isLoading = false;
      return;
    }
    const apiUrl = `api/v1/search-items`;
  
    this.repository.searchByDates(apiUrl, startDate, endDate, +companyId ,vatRate).subscribe({
      next: (response: any) => {
  
        // If the response directly returns an array, use it to set salesItems
        this.salesItems = response.body; 
  
        this.totalPages = response.body.totalPages;
        this.updateDisplayedPages();
        this.isLoading=false;
      },
      error: (err: HttpErrorResponse) => {
        this.isLoading=false;
        console.error('Error fetching sales items:', err.message);
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
