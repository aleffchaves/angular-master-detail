import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, throwError } from 'rxjs';
import { Category } from './category.model';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  private apiPath: string = "api/categories";

  constructor(private httpClient: HttpClient) { }

  getAll(): Observable<Category[]> {
    return this.httpClient.get(this.apiPath).pipe(
      catchError(this.handlerError),
      map(this.jsonDataToCategories)
    );
  }

  getById(id: number | undefined): Observable<Category> {
    const url = `${this.apiPath}/${id}`;

    return this.httpClient.get(url).pipe(
      catchError(this.handlerError),
      map(this.jsonDataToCategory)
    );
  }

  create(category: Category): Observable<Category> {
    return this.httpClient.post(this.apiPath, category).pipe(
      catchError(this.handlerError),
      map(this.jsonDataToCategory)
    );
  }

  update(category: Category): Observable<Category> {
    const url = `${this.apiPath}/${category?.id}`;

    return this.httpClient.put(url, category).pipe(
      catchError(this.handlerError),
      map(() => category)
    );
  }

  delete(id: any): Observable<any> {
    const url = `${this.apiPath}/${id}`;

    return this.httpClient.delete(url).pipe(
      catchError(this.handlerError),
      map(() => null)
    )
  }

  private jsonDataToCategory(jsonData: any) {
    return jsonData as Category;
  }

  private jsonDataToCategories(jsonData: any[]) {
    const categories: Category[] = [];
    jsonData.forEach(element => categories.push(element as Category));
    return categories;
  }

  private handlerError(error: any): Observable<any> {
    console.log("Error na requisição => ", error);
    return throwError(() => error);
  }
}
