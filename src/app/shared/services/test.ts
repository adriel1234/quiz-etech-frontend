import {HttpClient} from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import {Quiz} from '../models/quiz';
import {QuizResult} from '../models/quiz-result';

@Injectable({
  providedIn: 'root'
})
export class TestService {
  quizResult!:QuizResult;
  http = inject(HttpClient);
  constructor() {
  }
  getQuizByCode(code: string){
    return this.http.get<Quiz[]>("http://localhost:8000/api/question/" + code);
  }
  joinQuiz(quizResult:QuizResult){
    return this.http.post<QuizResult[]>("http://localhost:8000/api/quizResults", quizResult);
  }
}
