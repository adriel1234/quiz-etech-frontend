import {inject, Injectable} from '@angular/core';
import {QuizResult} from '../shared/models/quiz-result';
import {HttpClient} from '@angular/common/http';
import {Question} from '../shared/models/question.model';
import {Match} from '../shared/models/match.model';
import {MatchUser, MatchUserName} from '../shared/models/match-user.model';
import {Observable} from 'rxjs';
import {URLS} from '../shared/urls';
import {User} from '../shared/models/user';

@Injectable({
  providedIn: 'root'
})
export class TestService {
  quizResult!:MatchUser;
  matchDetails!:Match;
  http = inject(HttpClient);
  constructor() {}
  getQuestions(){
    return this.http.get<Question[]>("http://localhost:8000/api/questions");
  }
  getQuizByCode(code: string) {
    return this.http.get<Match>("http://localhost:8000/api/quiz/" + code);
  }

  getQuizWithMatchUser(quizId: number, matchUserId?: string) {
    return this.http.get<{ quiz: any; matchUser: any }>(`http://localhost:8000/api/quiz/${quizId}/?matchUserId=${matchUserId}`);
  }


  registerMatchUser(matchUser: MatchUserName) {
    return this.http.post<MatchUser>(
      "http://localhost:8000/api/match-users",
      matchUser // Corpo da requisição
    );
  }
  joinQuiz(quizResult: QuizResult) {
    return this.http.post<QuizResult>("http://localhost:8000/api/quizResults", quizResult);
  }

  getQuizById(quizId: number){
    return this.http.get<Match>("http://localhost:8000/api/quiz/" + quizId);
  }
  upDateQuizResult(id:number, result:QuizResult){
    return this.http.put<any>("http://localhost:8000/api/quizResults" + id, result);
  }
  getQuizResult(id: number) {
    return this.http.get<QuizResult>(`http://localhost:8000/api/quizResults/${id}`);
  }
  // Método para buscar Match por ID
  getMatchByCode(matchId: Match): Observable<Match> {
    const url = `${URLS.BASE}match/${matchId}/`; // Monta a URL com o ID do Match
    return this.http.get<Match>(url); // Faz a requisição GET e retorna os dados
  }
  getUserById(userId: number) {
    const url = `${URLS.BASE}userid/${userId}/`;
    return this.http.get<User>(url);
  }
}
