import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {catchError, Observable, throwError} from 'rxjs';
import {Match} from '../../shared/models/match.model';
import {Router} from '@angular/router';

interface MatchPayload {
  time_per_question: number;
  description: string;
  question_group: number; // Apenas o ID do grupo
}
@Injectable({
  providedIn: 'root'
})
export class MatchService {
  private apiUrl = 'http://localhost:8000/api/match/';

  constructor(private http: HttpClient, private router: Router) {}
  // Função para obter o token de autenticação
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

  getAll(): Observable<Match[]> {
    const headers = this.getHttpHeaders();
    return this.http.get<Match[]>(this.apiUrl ,{headers}).pipe(catchError(this.handleError));
  }

  getById(id: number): Observable<Match> {
    const headers = this.getHttpHeaders();
    return this.http.get<Match>(`${this.apiUrl}/${id}`,{headers}).pipe(catchError(this.handleError));
  }

  create(match: MatchPayload): Observable<Match> {
    const headers = this.getHttpHeaders();
    return this.http.post<Match>(this.apiUrl, match ,{headers}).pipe(catchError(this.handleError));
  }

  update(id: number, match: MatchPayload): Observable<Match> {
    const headers = this.getHttpHeaders();
    return this.http.put<Match>(`${this.apiUrl}/${id}`,match,{headers}).pipe(catchError(this.handleError));
  }

  delete(id: number): Observable<void> {
    const headers = this.getHttpHeaders();
    return this.http.delete<void>(`${this.apiUrl}${id}/`, {headers}).pipe(
      catchError(this.handleError)
    );

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
