import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {QuestionGroup} from '../../shared/models/question-group';

@Injectable({
  providedIn: 'root',
})
export class GroupQuestionService {
  private apiUrl = 'http://localhost:8000/api/question-group/';

  constructor(private http: HttpClient) {}

  getGroupQuestions(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  createGroupQuestion(groupQuestion: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, groupQuestion);
  }

  updateGroupQuestion(id: number, groupQuestion: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}${id}/`, groupQuestion);
  }

  deleteGroupQuestion(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}${id}/`);
  }

  getQuestionGroups(): Observable<QuestionGroup[]> {
    return this.http.get<QuestionGroup[]>(this.apiUrl);
  }

  criarQuestionGroup(questionGroup: QuestionGroup): Observable<any> {
    return this.http.post(this.apiUrl, questionGroup);
  }
}
