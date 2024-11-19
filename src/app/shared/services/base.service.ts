import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { URLS } from '../urls';
import { HttpOptions } from '../http/http-options';

export class BaseService<T> {
  public fullUrl: string;
  private parameters: HttpParams = new HttpParams();

  constructor(
    public http: HttpClient,
    public path: string
  ) {
    this.fullUrl = `${URLS.BASE}${path}`;
  }


  public addParameter(key: string, value: string | number | boolean): void {
    this.parameters = this.parameters.set(key, value.toString());
  }


  public clearParameter(): void {
    this.parameters = new HttpParams();
  }

  public getOptions(): HttpOptions {
    const httpOptions: HttpOptions = {};
    if (this.parameters) {
      httpOptions.params = this.parameters;
    }
    return httpOptions;
  }


  public getAll(): Observable<T[]> {
    const url = this.fullUrl;
    return this.http.get<T[]>(url, this.getOptions());
  }


  public getById(id: number | string): Observable<T> {
    const url = `${this.fullUrl}${id}/`;
    return this.http.get<T>(url, this.getOptions());
  }


  public delete(id: number | string): Observable<any> {
    this.clearParameter(); 
    const url = `${this.fullUrl}${id}/`;
    return this.http.delete<any>(url, this.getOptions());
  }


  public save(entity: T): Observable<T> {
    this.clearParameter();
    const url = this.fullUrl;
    return this.http.post<T>(url, entity, this.getOptions());
  }


  public update(id: number | string, entity: T): Observable<T> {
    this.clearParameter(); 
    const url = `${this.fullUrl}${id}/`;
    return this.http.put<T>(url, entity, this.getOptions());
  }
}