import {BaseResourceModel} from "../models/base-resource.model";
import {catchError, map, Observable, throwError} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {Injector} from "@angular/core";

export abstract class BaseResourceService <T extends BaseResourceModel> {

  httpClient: HttpClient;

  protected constructor(
    protected apiPath: string,
    protected injector: Injector,
    protected jsonDataToResourceFn: (jsonData: any) => T
  ) {
    this.httpClient = injector.get(HttpClient);
  }

  getAll(): Observable<T[]> {
    return this.httpClient.get<T[]>(this.apiPath).pipe(
      map(this.jsonDataToResources.bind(this)),
      catchError(this.handlerError)
    );
  }

  getById(id: number | undefined): Observable<T> {
    const url = `${this.apiPath}/${id}`;

    return this.httpClient.get(url).pipe(
      map(this.jsonDataToResource.bind(this)),
      catchError(this.handlerError)
    );
  }

  create(resource: T): Observable<T> {
    return this.httpClient.post(this.apiPath, resource).pipe(
      map(this.jsonDataToResource.bind(this)),
      catchError(this.handlerError)
    )
  }

  update(resource: T): Observable<T> {
    const url = `${this.apiPath}/${resource.id}`;

    return this.httpClient.put(url, resource).pipe(
      map(() => resource),
      catchError(this.handlerError)
    );
  }

  delete(id: any): Observable<any> {
    const url = `${this.apiPath}/${id}`;

    return this.httpClient.delete(url).pipe(
      map(() => null),
      catchError(this.handlerError),

    )
  }

  protected jsonDataToResource(jsonData: any): T {
    return this.jsonDataToResourceFn(jsonData);
  }

  protected jsonDataToResources(jsonData: any[]): T[] {
    const resources: T[] = [];
    jsonData.forEach(element => resources.push(this.jsonDataToResourceFn(element)));
    return resources;
  }

  protected handlerError(error: any): Observable<any> {
    console.log("Error na requisição => ", error);
    return throwError(() => error);
  }
}
