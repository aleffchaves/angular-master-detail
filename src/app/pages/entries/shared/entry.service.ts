import {Injectable, Injector} from '@angular/core';
import {catchError, map, mergeMap, Observable} from 'rxjs';
import {Entry} from './entry.model';
import {CategoryService} from "../../categories/shared/category.service";
import {BaseResourceService} from "../../../shared/services/base-resource.service";
import {Category} from "../../categories/shared/category.model";
import * as moment from "moment";

@Injectable({
  providedIn: 'root'
})
export class EntryService extends BaseResourceService<Entry> {

  constructor(
    protected categoryService: CategoryService,
    protected override injector: Injector) {

    super("api/entries", injector, Entry.fromJson)
  }

  override create(entry: Entry): Observable<Entry> {
    return this.setCategoryAndSendToServer(entry, super.create.bind(this));
  }

  override update(entry: Entry): Observable<Entry> {
    return this.setCategoryAndSendToServer(entry, super.update.bind(this));
  }

  private setCategoryAndSendToServer(entry: Entry, sendFn: (entry: any) => Observable<Entry>): Observable<Entry> {
    return this.categoryService.getById(entry.categoryId).pipe(
      mergeMap((category: Category) => {
        entry.category = category;
        return sendFn(entry);
      }),
      catchError(this.handlerError)
    );
  }

  getByMonthAndYear(month: number, year: number): Observable<Entry[]> {
    return this.getAll().pipe(
      map(entries => this.filterByMonthAndYear(entries, month, year))
    )
  }

  private filterByMonthAndYear(entries: Entry[], month: number, year: number) {
    return entries.filter(entry => {
      const entryDate = moment(entry.date, "DD/MM/YYYY");
      const monthMatches = entryDate.month() + 1 == month;
      const yearMatches = entryDate.year() == year;

      return monthMatches && yearMatches;
    })
  }
}
