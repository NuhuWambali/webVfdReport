import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { NavbarComponent } from './shared/components/layouts/navbar/navbar.component';
import { SidebarComponent } from './shared/components/layouts/sidebar/sidebar.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { AuthenticationModule } from './authentication/authentication.module';
import { JwtModule } from '@auth0/angular-jwt';
import { LoginComponent } from './authentication/login/login.component';

export function tokenGetter() {
  return localStorage.getItem("token");
}


@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    SidebarComponent,
    DashboardComponent,
    LoginComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    RouterLink,
    HttpClientModule,
    FormsModule,  
    AuthenticationModule,
    JwtModule.forRoot({
      config: {
          tokenGetter: tokenGetter,
          allowedDomains: ["localhost:5001"],
          disallowedRoutes: []
      }
  }),
  
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
