import {inject, Injectable} from '@angular/core';
import {QuizResult} from '../shared/models/quiz-result';
import {HttpClient} from '@angular/common/http';
import {Question} from '../shared/models/question.model';
import {Match} from '../shared/models/match.model';

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
    return this.http.get<Question[]>("http://localhost:8000/api/quiz/" + code);
  }
  joinQuiz(quizResult:QuizResult){
    return this.http.post<QuizResult[]>("http://localhost:8000/api/quizResults", quizResult);
  }
  getQuizById(quizId: string){
    return this.http.get<Match>("http://localhost:8000/api/quiz/" + quizId);
  }
  upDateQuizResult(id:number, result:QuizResult){
    return this.http.put<any>("http://localhost:8000/api/quizResults" + id, result);
  }
  getQuizResult(id:number){
    return this.http.get<QuizResult>("http://localhost:8000/api/quizResults" + id);
  }
}
