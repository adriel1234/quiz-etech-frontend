import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class QuestionGroupService {
  private apiUrl = 'http://localhost:8000/api/question-group/';

  constructor(private http: HttpClient) {}

  getQuestionGroups(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  createQuestionGroup(data: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, data);
  }
}
