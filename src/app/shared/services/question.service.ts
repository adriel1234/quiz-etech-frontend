import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {catchError, Observable, throwError} from 'rxjs';
import { Question } from '../models/question.model';

@Injectable({
  providedIn: 'root'
})
export class QuestionService {

  private apiUrl = 'http://localhost:8000/api/question/';

  constructor(private http: HttpClient) { }
  private getAuthToken(): string | null {
    return sessionStorage.getItem('auth-token');  // Ensure that the token is in sessionStorage
  }

  private getHttpHeaders(): HttpHeaders {
    const token = this.getAuthToken();
    let headers = new HttpHeaders();
    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);  // Add the token to the header
    }
    return headers;
  }


  createQuestion(questionData: Question): Observable<Question> {
    const headers = this.getHttpHeaders();
    return this.http.post<Question>(this.apiUrl, questionData, { headers }).pipe(
      catchError((error) => {
        console.error('Erro ao criar a pergunta:', error);
        return throwError(() => new Error('Falha ao criar a pergunta.'));
      })
    );
  }

  getQuestions(): Observable<Question[]> {
    const headers = this.getHttpHeaders();
    return this.http.get<Question[]>(this.apiUrl, {
      headers,
    }).pipe(
        catchError((error) => {
          console.error('Erro ao buscar perguntas:', error);
          return throwError(() => new Error('Falha ao buscar perguntas.'));
        })
    );
  }

  // getById(id: number): Observable<Question> {
  //   console.log(sessionStorage.getItem('auth-token'));
  //   const headers = this.getHttpHeaders();
  //   return this.http.get<Question>(`${this.apiUrl}${id}`, {
  //     headers,
  //     withCredentials: true
  //   }).pipe(
  //       catchError((error) => {
  //         console.error('Erro ao buscar questão:', error);
  //         return throwError(() => new Error('Falha ao buscar questão.'));
  //       })
  //   );
  // }

  getById(id: number): Observable<Question> {
    const headers = this.getHttpHeaders();
    return this.http.get<Question>(`${this.apiUrl}${id}/`, { headers }).pipe(
      catchError((error) => {
        console.error('Erro ao buscar questão:', error);
        return throwError(() => new Error('Falha ao buscar questão.'));
      })
    );
  }

  updateQuestion(id: number, question: Question): Observable<Question> {
    const headers = this.getHttpHeaders();
    return this.http.put<Question>(`${this.apiUrl}${id}/`, question, { headers }).pipe(
      catchError((error) => {
        console.error('Erro ao atualizar a pergunta:', error);
        return throwError(() => new Error('Falha ao atualizar a pergunta.'));
      })
    );
  }


  deleteQuestion(id: number): Observable<void> {
    const headers = this.getHttpHeaders();
    return this.http.delete<void>(`${this.apiUrl}${id}/`, { headers }).pipe(
      catchError((error) => {
        console.error('Erro ao excluir a pergunta:', error);
        return throwError(() => new Error('Falha ao excluir a pergunta.'));
      })
    );
  }
}
