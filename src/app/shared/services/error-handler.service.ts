import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class ErrorHandlerService {
  public errorMessage: string = '';

  constructor(private router: Router) { }

  public handleError = (error: HttpErrorResponse) => {
    if (error.status === 500) {
      this.handle500Error(error);
    }

    else if (error.status === 404) {
      this.handleNotFound(error)
    }

    else if(error.status === 400) {
      return this.handleBadRequest(error);
    }

    else if(error.status === 401) {
      return this.handleUnauthorized(error);
    }
    else if(error.status === 403) {
      return this.handleForbidden(error);
    }

    else {
      return this.handleOtherError(error);
    }

  }

  private handleUnauthorized = (error: HttpErrorResponse) => {
    if(this.router.url === '/authentication/login') {
      return 'Authentication failed. Wrong Username or Password';
    }
    else {
      this.router.navigate(['/authentication/login']);
      return error.message;
    }
  }
  
  private handleForbidden = (error: HttpErrorResponse) => {
    this.router.navigate(["/forbidden"], { queryParams: { returnUrl: this.router.url }});
    return "Forbidden";
  }

  private handle500Error = (error: HttpErrorResponse) => {
    this.createErrorMessage(error);
    this.router.navigate(['/500']);
  }

  private handleBadRequest = (error: HttpErrorResponse) => {
    this.createErrorMessage(error);
    this.router.navigate(['/404']);
  }
  
  private handleNotFound = (error: HttpErrorResponse) => {
    this.createErrorMessage(error); 
  }

  private handleOtherError = (error: HttpErrorResponse) => {
    this.createErrorMessage(error); 
  }


  private createErrorMessage = (error: HttpErrorResponse) => {
    this.errorMessage = error.error ? error.error : error.statusText;
  }


}