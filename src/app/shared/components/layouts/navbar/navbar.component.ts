import { Component, ElementRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from 'src/app/shared/services/authentication.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {

  username:string='' ;
  isUserAuthenticated!: boolean ;
  // public isUserAuthenticated: boolean'';
  constructor(private authService: AuthenticationService,private router:Router){}
   
  ngOnInit(): void {
    this.authService.authChanged
    .subscribe(res => {
      this.isUserAuthenticated = res;
    })

    this.username = this.authService.getAuthUserName();
    
  }



  
  logout = () => {
    this.authService.logout();
    this.router.navigate(["/login"]);
  }


  
}
