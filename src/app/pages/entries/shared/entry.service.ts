import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {catchError, flatMap, map, mergeMap, Observable, throwError} from 'rxjs';
import { Entry } from './entry.model';
import {CategoryService} from "../../categories/shared/category.service";

@Injectable({
  providedIn: 'root'
})
export class EntryService {

  private apiPath: string = "api/entries";

  constructor(
    private categoryService: CategoryService,
    private httpClient: HttpClient) { }

  getAll(): Observable<Entry[]> {
    return this.httpClient.get(this.apiPath).pipe(
      catchError(this.handlerError),
      map(this.jsonDataToEntries)
    );
  }

  getById(id: number): Observable<Entry> {
    const url = `${this.apiPath}/${id}`;

    return this.httpClient.get(url).pipe(
      catchError(this.handlerError),
      map(this.jsonDataToEntry)
    );
  }

  create(entry: Entry): Observable<Entry> {

    return this.categoryService.getById(entry.categoryId)
      .pipe(
        mergeMap(category => {
          entry.category = category;

          return this.httpClient.post(this.apiPath, entry).pipe(
            catchError(this.handlerError),
            map(this.jsonDataToEntry)
          );
        })
      )
  }

  update(entry: Entry): Observable<Entry> {
    const url = `${this.apiPath}/${entry.id}`;

    return this.categoryService.getById(entry.categoryId).pipe(
      mergeMap(category => {
        entry.category = category;

        return this.httpClient.put(url, entry).pipe(
          catchError(this.handlerError),
          map(() => entry)
        );
      })
    )
  }

  delete(id: any): Observable<any> {
    const url = `${this.apiPath}/${id}`;

    return this.httpClient.delete(url).pipe(
      catchError(this.handlerError),
      map(() => null)
    )
  }

  private jsonDataToEntry(jsonData: any) {
    return Object.assign(new Entry, jsonData);
  }

  private jsonDataToEntries(jsonData: any[]) {
    const entries: Entry[] = [];

    jsonData.forEach(element => {
      const entry = Object.assign(new Entry, element)
      entries.push(entry);
    });

    return entries;
  }

  private handlerError(error: any): Observable<any> {
    console.log("Error na requisição => ", error);
    return throwError(() => error);
  }
}
