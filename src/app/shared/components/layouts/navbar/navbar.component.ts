import { Component, ElementRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from 'src/app/shared/services/authentication.service';
import { UserService } from 'src/app/shared/services/user.service';
// import { AuthenticationService } from 'src/app/shared/services/authentication.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {

  username:string='' ;
  companyName:string='' ;
  companyTin:string='' ;
  packageName:string='' ;
  isUserAuthenticated!: boolean ;

  constructor(private authService: AuthenticationService,private userRepoService: UserService,private router:Router){}
   
  ngOnInit(): void {
    this.authService.authChanged
    .subscribe(res => {
      this.isUserAuthenticated = res;
    })
    this.username = this.authService.getAuthUserName();  
    this.companyName = this.userRepoService.getCompanyName()!;  
    this.companyTin = this.userRepoService.getCompanyTin()!;  
    this.packageName = this.userRepoService.getPackageName()!;  
  }

  
  logout = () => {
    this.authService.logout();
    this.router.navigate(["/login"]);
  }


  
}
