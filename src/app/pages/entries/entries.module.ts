import {NgModule} from '@angular/core';

import {EntriesRoutingModule} from './entries-routing.module';
import {EntryListComponent} from './entry-list/entry-list.component';
import {EntryFormComponent} from './entry-form/entry-form.component';
import {IMaskModule} from "angular-imask";
import {CalendarModule} from "primeng/calendar";
import {SharedModule} from "../../shared/shared.module";

@NgModule({
  declarations: [
    EntryListComponent,
    EntryFormComponent
  ],
  imports: [
    SharedModule,
    EntriesRoutingModule,
    IMaskModule,
    CalendarModule,
  ]
})
export class EntriesModule { }
