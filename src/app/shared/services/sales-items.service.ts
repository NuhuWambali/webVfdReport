import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { EnvironmentUrlService } from './environment-url.service';

@Injectable({
  providedIn: 'root'
})
export class SalesItemsRepositoryService {

  constructor(private http: HttpClient, private envUrl: EnvironmentUrlService) { }
  token = sessionStorage.getItem('token')??'';


  Postheaders = new HttpHeaders()
  .set('Authorization', this.token)
  .set('Content-Type', 'application/json');

  Getheaders = new HttpHeaders()
  .set('Authorization', this.token)

  public getAllSalesItems = (route: string) => {
    const params = new HttpParams()
    const headers = this.Getheaders;
    return this.http.get<any>(this.createCompleteRoute(route, this.envUrl.urlAddress),{params,headers,observe: 'response' });
  }


  public searchByDates = (route: string, startDate: string, endDate: string, companyId: number, vatRate?: string) => {

    const requestBody: any = {
      companyId,
      startDate,
      endDate,
      vatRate,
    };
  
    if (vatRate) {
      requestBody.vatRate = vatRate;
    }
  
    const headers = this.Postheaders; 
  
    return this.http.post<any>(this.createCompleteRoute(route, this.envUrl.urlAddress), requestBody, { headers, observe: 'response' });
  };
  



  private createCompleteRoute = (route: string, envAddress: string) => {
    return `${envAddress}/${route}`;
  }


  
  
}
