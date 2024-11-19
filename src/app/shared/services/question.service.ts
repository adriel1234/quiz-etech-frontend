import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class QuestionService {

  private apiUrl = 'http://localhost:8000/api/question/';

  constructor(private http: HttpClient) { }

  createQuestion(questionData: any): Observable<any> {
    return this.http.post(this.apiUrl, questionData);
  }
  getQuestions(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  updateQuestion(id: number, question: any): Observable<any> {
    return this.http.put(`${this.apiUrl}${id}/`, question);
  }

  deleteQuestion(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}${id}/`);
  }


}
