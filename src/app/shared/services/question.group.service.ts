import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {catchError, Observable, throwError} from 'rxjs';
import {Router} from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class QuestionGroupService {
  private apiUrl = 'http://localhost:8000/api/question-group/';

  constructor(private http: HttpClient, private router: Router) {}

  private getAuthToken(): string | null {
    return sessionStorage.getItem('auth-token');  // Recupera o token armazenado no sessionStorage
  }

  private getHttpHeaders(): HttpHeaders {
    const token = this.getAuthToken();
    let headers = new HttpHeaders();
    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);  // Adiciona o token no cabeçalho
    }
    return headers;
  }

  getQuestionGroups(): Observable<any[]> {
    const headers = this.getHttpHeaders();
    return this.http.get<any[]>(this.apiUrl,{headers}).pipe(catchError(this.handleError));
  }

  createQuestionGroup(data: any): Observable<any> {
    const headers = this.getHttpHeaders();
    return this.http.post<any>(this.apiUrl, data,{headers}).pipe(catchError(this.handleError));
  }

  private handleError(error: any) {
    if (error.status === 401) {
      console.error('Unauthorized access - redirecting to login');
      // Exemplo de redirecionamento para a página de login
      this.router.navigate(['/login']);
    } else if (error.status === 500) {
      console.error('Server error occurred');
    }
    return throwError('An error occurred. Please try again later.');
  }

}
