import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import {environment} from '../../environments/environment';
 // Adapte isso de acordo com sua configuração de ambiente

@Injectable({
  providedIn: 'root',
})
export class QuestionService {
  private apiUrl = `${environment.apiBaseUrl}/questions/`; // A URL base da sua API Django

  constructor(private http: HttpClient) {}

  // Método para obter todas as perguntas
  getQuestions(): Observable<any> {
    return this.http.get<any>(this.apiUrl, {
      headers: this.getHeaders(),
    });
  }

  // Método para criar uma nova pergunta
  createQuestion(questionData: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, questionData, {
      headers: this.getHeaders(),
    });
  }

  // Método para editar uma pergunta
  updateQuestion(id: number, questionData: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}${id}/`, questionData, {
      headers: this.getHeaders(),
    });
  }

  // Método para excluir uma pergunta
  deleteQuestion(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}${id}/`, {
      headers: this.getHeaders(),
    });
  }

  // Método para adicionar headers, incluindo token de autenticação (caso necessário)
  private getHeaders() {
    const token = localStorage.getItem('authToken'); // Supondo que você tenha armazenado o token de autenticação
    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
  }
}
