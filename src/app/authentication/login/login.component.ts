import { HttpErrorResponse } from '@angular/common/http';
import { Component, ElementRef, Renderer2 } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthenticationService } from 'src/app/shared/services/authentication.service';
import { UserService } from 'src/app/shared/services/user.service';
import { Login } from 'src/interfaces/authentication/login.model';
import { loginResponse } from 'src/interfaces/response/loginResponse.model';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
     loading:boolean | undefined;
     private returnUrl: string = '';
      showPassword: boolean = false;
      loginForm!: FormGroup;
      showError: boolean = false;
      errorMessages!: string | null;
      errorDetails: any;
      constructor(
              private authService:AuthenticationService,
              private userRepoService:UserService,
              private el: ElementRef,
              private router: Router, private route: ActivatedRoute,
              private renderer: Renderer2,
              private fb: FormBuilder,
              ) { }

            ngOnInit(): void {
              this.loginForm = this.fb.group({
                username: ['', Validators.required],
                password: ['', Validators.required]
              });
              this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
            }

            onSubmit(): void {
              if (this.loginForm.valid) {
                this.createLoginUser(this.loginForm.value);
              }
            }

            createLoginUser(loginFormValue: any): void {
              this.loading=true;
              const loginAuth: Login = {
                  username: loginFormValue.username,
                  password: loginFormValue.password
              };
              const apiUrl = 'login';
              this.authService.loginUser(apiUrl, loginAuth).subscribe({
                  next: (response: loginResponse) => {
                    this.loading=false;
                      if (!response.token) {
                          this.handleError('Something went wrong.');
                      } else {
                        console.log(response.token);
                        this.authService.setAuthData('Bearer ' + response.token,response.companyId);
                        this.userRepoService.setUSerDetails(response.companyName,response.companyTin,response.packageName);
                         this.router.navigate([this.returnUrl]).then(() => {
                           this.reloadDashboard(); 
                          });
                      }
                  },
                  error: (err: HttpErrorResponse) => {
                      if (err.status === 404) {
                          this.handleError('User not found.');
                      } else if (err.status === 401) {
                          this.handleError('Wrong Username Or Password');
                      } else if (err.status === 502) {         
                          this.handleError('Bad Gateway. Please try again later.');
                      } else if(err.status === 0){
                        this.handleError('No internet connection or network error');
                      }   
                      else {
                          this.handleError('An unexpected error occurred.');
                      }
                  }
              });
          }
      
          private handleError(message: string): void {
              this.errorDetails = message;
              this.showError = true;
              setTimeout(() => {
                  this.errorDetails = '';
                  this.showError = false;
              }, 3000); 
              this.loading=false;

          }
      

            validateControl = (controlName: string) => {
              const control = this.loginForm?.get(controlName);
              return control ? control.invalid && control.touched : false;
          }

          hasError = (controlName: string, errorName: string) => {
              const control = this.loginForm?.get(controlName);
              return control ? control.hasError(errorName) : false;
          }

            reloadDashboard() {
              window.location.href = window.location.href;
            }

}
