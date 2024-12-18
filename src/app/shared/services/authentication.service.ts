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

export class AuthenticationService {
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


  public loginUser = (route: string, body: Login) =>
  {
      const headers = new HttpHeaders()
      return this.http.post<loginResponse>(this.createCompleteRoute(route, this.envUrl.urlAddress),body,{ headers });
  }

  
  public isUserAuthenticated = (): boolean => {
    const token = sessionStorage.getItem('token');
  
    return !this.jwtHelper.isTokenExpired(token);
  }


  public sendAuthStateChangeNotification = (isAuthenticated: boolean) => {
    this.authChangeSub.next(isAuthenticated);
  }


  public logout = () => {
    sessionStorage.removeItem("token");
    this.sendAuthStateChangeNotification(false);

  }

 


  public getAuthUserName = () => {
    const token = sessionStorage.getItem('token');
    const decodedToken = this.jwtHelper.decodeToken(this.token);
    if(decodedToken!=null){
      const username = decodedToken.username;
      return username;
    }
    
  }


  setAuthData(token: string, userId: string,branchId:string) {
    this.authToken = token;
    this.userId = userId;
    this.branch_id = branchId;
    sessionStorage.setItem('token', token);
    sessionStorage.setItem('userId', userId);
    localStorage.setItem('branch_id', branchId);
  }


  getAuthToken(): string | null {
    return sessionStorage.getItem('authToken');
  }


  getBranchId(): string | null {
    return localStorage.getItem('branch_id');
  }

  getUserId(): string | null {
    return sessionStorage.getItem('userId');
  }


  private createCompleteRoute = (route: string, envAddress: string) => {
    return `${envAddress}/${route}`;
  }


}

