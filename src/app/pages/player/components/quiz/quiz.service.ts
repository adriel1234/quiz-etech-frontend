import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {QuestionGroup} from '../../../../shared/models/question-group.model';

interface Quiz {
  id: number;
  title: string;
  questions: Question[];
}

interface Question {
  id: number;
  text: string;
  options: Option[];
}

interface Option {
  id: number;
  text: string;
  isCorrect: boolean;
}
@Injectable({
  providedIn: 'root'  // Faz o serviço disponível em toda a aplicação
})
export class QuizService {

  private apiUrl = 'http://localhost:8000/api/'; // URL base da API

  constructor(private http: HttpClient) { }

  getQuestionsByGroup(groupId: QuestionGroup): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}question/?group_id=${groupId}`);
  }


}
