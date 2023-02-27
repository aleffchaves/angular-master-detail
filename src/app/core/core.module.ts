import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {BrowserModule} from "@angular/platform-browser";
import {HttpClientModule} from "@angular/common/http";
import {ToastrModule} from "ngx-toastr";
import {HttpClientInMemoryWebApiModule} from "angular-in-memory-web-api";
import {InMemoryDatabase} from "../in-memory-database";
import { NavbarComponent } from './components/navbar/navbar.component';
import {RouterModule} from "@angular/router";



@NgModule({
  declarations: [
    NavbarComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    BrowserAnimationsModule,
    BrowserModule,
    HttpClientModule,
    ToastrModule.forRoot(),
    HttpClientInMemoryWebApiModule.forRoot(InMemoryDatabase)
  ],
  exports: [
    BrowserAnimationsModule,
    BrowserModule,
    HttpClientModule,
    NavbarComponent
  ]
})
export class CoreModule { }
