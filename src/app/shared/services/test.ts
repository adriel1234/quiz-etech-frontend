import {HttpClient} from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import {Quiz} from '../models/quiz';
import {QuizResult} from '../models/quiz-result';
import {Observable} from 'rxjs';
import {Question} from '../models/question.model';

@Injectable({
  providedIn: 'root'
})
export class TestService {
  quizResult!:QuizResult;
  http = inject(HttpClient);
  constructor() {}
  getQuestions(){
    return this.http.get<Question[]>("http://localhost:8000/api/questions");
  }
  getQuizByCode(code: string){
    return this.http.get<Quiz[]>("http://localhost:8000/api/question/" + code);
  }
  joinQuiz(quizResult:QuizResult){
    return this.http.post<QuizResult[]>("http://localhost:8000/api/quizResults", quizResult);
  }
  getQuizById(quizId: string){
    return this.http.get<Quiz>("http://localhost:8000/api/quiz/" + quizId);
  }
  upDateQuizResult(id:number, result:QuizResult){
    return this.http.put<any>("http://localhost:8000/api/quizResults" + id, result);
  }
  getQuizResult(id:number){
    return this.http.get<QuizResult>("http://localhost:8000/api/quizResults" + id);
  }
}
