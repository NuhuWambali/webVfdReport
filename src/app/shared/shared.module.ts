import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PreloaderComponent } from './components/layouts/preloader/preloader.component';
import { NavbarComponent } from './components/layouts/navbar/navbar.component';
import { SidebarComponent } from './components/layouts/sidebar/sidebar.component';

@NgModule({
  declarations: [PreloaderComponent, ],
  imports: [CommonModule],
  exports: [PreloaderComponent] 
})
export class SharedModule { }