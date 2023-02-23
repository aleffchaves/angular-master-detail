import {Injectable, Injector} from '@angular/core';
import {catchError, mergeMap, Observable} from 'rxjs';
import {Entry} from './entry.model';
import {CategoryService} from "../../categories/shared/category.service";
import {BaseResourceService} from "../../../shared/services/base-resource.service";
import {Category} from "../../categories/shared/category.model";

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
}
