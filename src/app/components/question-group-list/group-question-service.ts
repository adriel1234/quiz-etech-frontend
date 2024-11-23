import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {catchError, Observable, throwError} from 'rxjs';

import { Router } from '@angular/router';
import {QuestionGroup} from '../../shared/models/question-group.model';

@Injectable({
  providedIn: 'root',
})
export class GroupQuestionService {
  private apiUrl = 'http://localhost:8000/api/question-group/';


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

  getGroupQuestions(): Observable<QuestionGroup[]> {
    const headers = this.getHttpHeaders();
    return this.http.get<QuestionGroup[]>(this.apiUrl, {headers}).pipe(
      catchError(this.handleError)
    );

  }
  getGroupQuestion(id: number): Observable<QuestionGroup> {
    const headers = this.getHttpHeaders();
    return this.http.get<QuestionGroup>(`${this.apiUrl}${id}/`, { headers }).pipe(
      catchError(this.handleError)
    );
  }

  createGroupQuestion(groupQuestion: QuestionGroup): Observable<QuestionGroup> {
    const headers = this.getHttpHeaders();

    // Log para verificar os dados que estão sendo enviados
    console.log('Dados enviados para criação do grupo de questões:', groupQuestion);

    return this.http.post<QuestionGroup>(this.apiUrl, groupQuestion, { headers }).pipe(
      catchError((error) => {
        // Se a resposta for 400, mostre o erro completo
        if (error.status === 400) {
          console.error('Erro 400 (Bad Request) - Detalhes:', error.error);
          if (error.error) {
            console.log('Resposta do erro:', error.error);
            alert(`Erro: ${JSON.stringify(error.error)}`);  // Exibe o erro detalhado na interface
          } else {
            alert('Erro 400: Dados enviados não são válidos');
          }
        }

        // Se a resposta for outro erro, exibe uma mensagem genérica
        if (error.status !== 400) {
          console.error('Erro desconhecido:', error);
          alert('Erro desconhecido. Por favor, tente novamente mais tarde.');
        }

        return throwError(error);  // Passa o erro para o fluxo
      })
    );
  }

  updateGroupQuestion(id: number, groupQuestion: QuestionGroup): Observable<QuestionGroup> {
    const headers = this.getHttpHeaders();
    return this.http.put<QuestionGroup>(`${this.apiUrl}${id}/`, groupQuestion, {headers}).pipe(
      catchError(this.handleError)
    );
  }

  deleteGroupQuestion(id: number): Observable<void> {
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
