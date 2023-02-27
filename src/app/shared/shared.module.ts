import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {ReactiveFormsModule} from "@angular/forms";
import { BreadCrumbComponent } from './components/bread-crumb/bread-crumb.component';
import {RouterLink, RouterModule} from "@angular/router";
import { PageHeaderComponent } from './components/page-header/page-header.component';



@NgModule({
  declarations: [
    BreadCrumbComponent,
    PageHeaderComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink,
    RouterModule
  ],
  exports: [
    ReactiveFormsModule,
    CommonModule,
    BreadCrumbComponent,
    PageHeaderComponent,
    RouterModule
  ]
})
export class SharedModule { }
