import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';

interface Ranking {
  username: string;
  points: number;
  right_questions: number;
  wrong_questions: number;
}

@Injectable({
  providedIn: 'root'
})
export class RankingService {
  private apiUrl = 'http://localhost:8000/api/ranking';  // URL base da API do Django

  constructor(private http: HttpClient) {}

  // Método para obter o ranking de um match específico
  getRankingByMatch(matchId: number): Observable<Ranking[]> {
    return this.http.get<Ranking[]>(`${this.apiUrl}/${matchId}/`);
  }
}
