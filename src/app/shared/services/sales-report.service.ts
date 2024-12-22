import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { EnvironmentUrlService } from './environment-url.service';

@Injectable({
  providedIn: 'root'
})
export class SalesReportRepositoryService {

  constructor(private http: HttpClient, private envUrl: EnvironmentUrlService) { }
  token = sessionStorage.getItem('token')??'';


  Postheaders = new HttpHeaders()
  .set('Authorization', this.token)
  .set('Content-Type', 'application/json');

  Getheaders = new HttpHeaders()
  .set('Authorization', this.token)

  public getAllSalesReport = (route: string) => {
    const params = new HttpParams()
    const headers = this.Getheaders;
    return this.http.get<any>(this.createCompleteRoute(route, this.envUrl.urlAddress),{params,headers,observe: 'response' });
  }

  public searchByDates = (route: string, startDate: Date, endDate: Date, companyId: number) => {
    const requestBody = {
      companyId,
      startDate: startDate, // Convert to ISO string
      endDate: endDate     // Convert to ISO string
    };
    const headers = this.Getheaders; // Ensure headers are configured properly
    return this.http.post<any>(this.createCompleteRoute(route, this.envUrl.urlAddress), requestBody, { headers, observe: 'response' });
  };

  private createCompleteRoute = (route: string, envAddress: string) => {
    return `${envAddress}/${route}`;
  }


  
}
