import {NgModule} from '@angular/core';

import {ReportsRoutingModule} from './reports-routing.module';
import {ReportsComponent} from './reports/reports.component';
import {SharedModule} from "../../shared/shared.module";


@NgModule({
  declarations: [
    ReportsComponent
  ],
  imports: [
    SharedModule,
    ReportsRoutingModule
  ]
})
export class ReportsModule { }
