import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs';
import {URLS} from '../urls';
import {HttpOptions} from '../http/http-options';

export class BaseService<T> {
  public fullUrl: string;

  private parameters: HttpParams = new HttpParams();

  constructor(
    public http: HttpClient,
    public path: string
  ) {
    this.fullUrl = `${URLS.BASE}${path}`;
  }
  private getAuthToken(): string | null {
    return sessionStorage.getItem('auth-token');  // Recupera o token do sessionStorage
  }

  private getHttpHeaders(): HttpHeaders {
    const token = this.getAuthToken();
    let headers = new HttpHeaders();
    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);  // Adiciona o token ao cabeçalho
    }
    headers = headers.set('Content-Type', 'application/json');  // Garante que o conteúdo seja tratado como JSON
    return headers;
  }
  public addParameter(key: string, value: string): void {
    this.parameters = this.parameters.set(key, value);
  }

  public clearParameter(): void {
    this.parameters = new HttpParams();
  }

  public getOptions(): HttpOptions {
    const httpOptions: HttpOptions = {
      headers: this.getHttpHeaders()  // Adiciona o cabeçalho de autenticação
    };

    if (this.parameters) {
      httpOptions.params = this.parameters;
    }

    return httpOptions;
  }

  public getAll(): Observable<T[]> {
    const url = this.fullUrl;
    const headers = this.getHttpHeaders();  // Adiciona os cabeçalhos
    return this.http.get<T[]>(url, { headers, ...this.getOptions() });  // Inclui os headers na requisição
  }

  public getById(id: number | string): Observable<T> {
    const url = `${this.fullUrl}${id}/`;
    const headers = this.getHttpHeaders();  // Adiciona os cabeçalhos
    return this.http.get<T>(url, { headers, ...this.getOptions() });  // Inclui os headers na requisição
  }

  public delete(id: number | string): Observable<any> {
    this.clearParameter();
    const url = `${this.fullUrl}${id}/`;
    const headers = this.getHttpHeaders();  // Adiciona os cabeçalhos
    return this.http.delete<any>(url, { headers, ...this.getOptions() });  // Inclui os headers na requisição
  }

  save(entity: T): Observable<T> {
    console.log('Dados sendo enviados:', entity);  // Verifique o conteúdo enviado
    this.clearParameter();
    const url = this.fullUrl;
    const headers = this.getHttpHeaders();  // Adiciona os cabeçalhos
    return this.http.post<T>(url, entity, { headers, params: this.parameters }) as Observable<T>;
  }
  public update(id: number | string, entity: any): Observable<T> {
    this.clearParameter();
    const url = `${this.fullUrl}${id}/`;
    const headers = this.getHttpHeaders();  // Adiciona os cabeçalhos
    return this.http.patch<T>(url, entity, { headers, ...this.getOptions() }) as Observable<T>;  // Inclui os headers na requisição
  }
}
