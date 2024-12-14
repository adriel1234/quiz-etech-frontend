// src/app/quiz.service.ts
import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Match} from '../../../shared/models/match.model';
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

  // Método para pegar os dados de um quiz específico
  getMatchData(quizId: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}match/${quizId}/`); // Obtemos os dados do quiz
  }
  getQuizData(quizId: number): Observable<Quiz> {
    return this.http.get<Quiz>(`${this.apiUrl}match/${quizId}/`);
  }

  // Método para pegar o grupo de perguntas com base no question_group
  getQuestionGroup(questionGroupId: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}question-group/${questionGroupId}/`); // Obtemos os dados do question_group
  }

  // Método para pegar as perguntas específicas com base em seus IDs
  // getQuestions(questionIds: number[]): Observable<any[]> {
  //   // Criamos um array de requisições para cada ID de pergunta
  //   const requests = questionIds.map(id => this.http.get<any>(`${this.apiUrl}question/${id}/`));
  //   return Observable.forkJoin(requests); // Executa todas as requisições de uma vez
  // }
}
