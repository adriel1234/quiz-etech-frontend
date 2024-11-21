import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import { Observable } from 'rxjs';

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

  createQuestion(questionData: any): Observable<any> {
    const headers = this.getHttpHeaders(); // Obtém os cabeçalhos com o token
    return this.http.post(this.apiUrl, questionData, { headers });
  }

  getQuestions(): Observable<any[]> {
    const headers = this.getHttpHeaders(); // Adiciona o token nos cabeçalhos
    return this.http.get<any[]>(this.apiUrl, { headers });
  }

  updateQuestion(id: number, question: any): Observable<any> {
    const headers = this.getHttpHeaders(); // Adiciona o token nos cabeçalhos
    return this.http.put(`${this.apiUrl}${id}/`, question, { headers });
  }
  deleteQuestion(id: number): Observable<any> {
    const headers = this.getHttpHeaders(); // Adiciona o token nos cabeçalhos
    return this.http.delete(`${this.apiUrl}${id}/`, { headers });
  }


}
