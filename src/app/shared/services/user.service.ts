import { HttpClient, HttpHeaders,HttpParams  } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Subject } from 'rxjs';
import { JwtHelperService,} from '@auth0/angular-jwt';
import { EnvironmentUrlService } from './environment-url.service';
import { Login } from 'src/interfaces/authentication/login.model';
import { loginResponse } from 'src/interfaces/response/loginResponse.model';

@Injectable({
  providedIn: 'root'
})

export class UserService {
  public authChangeSub = new Subject<boolean>()
  public authChanged = this.authChangeSub.asObservable();

  constructor(private http: HttpClient, private envUrl: EnvironmentUrlService,private jwtHelper: JwtHelperService) { }
  token = sessionStorage.getItem('token')??'';

  
  Postheaders = new HttpHeaders()
  .set('Authorization', this.token)
  .set('Content-Type', 'application/json');

  Getheaders = new HttpHeaders()
  .set('Authorization', this.token);

  private userId: string ='';
  private authToken: string ='';
  private branch_id: string ='';


  setUSerDetails(companyName: string, companyTin:string,packageName:string) {

    sessionStorage.setItem('companyName', companyName);
    sessionStorage.setItem('companyTin', companyTin);
    sessionStorage.setItem('packageName', packageName); 
  }

  getCompanyName(): string | null {
    return sessionStorage.getItem('companyName');
  }

  getCompanyTin(): string |  null {
    return sessionStorage.getItem('companyTin');
  }

  getPackageName(): string | null {
    return sessionStorage.getItem('packageName');
  }


  private createCompleteRoute = (route: string, envAddress: string) => {
    return `${envAddress}/${route}`;
  }


}

