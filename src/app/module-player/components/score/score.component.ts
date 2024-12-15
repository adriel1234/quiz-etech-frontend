import { Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule, JsonPipe } from '@angular/common';
import {BaseService} from '../../../shared/services/base.service';
import {QuizResult} from '../../../shared/models/quiz-result';
import {TestService} from '../../../services/test.service';
import {MatchUser} from '../../../shared/models/match-user.model';

@Component({
  selector: 'app-score',
  standalone: true,
  imports: [
    JsonPipe,
    CommonModule
  ],
  templateUrl: './score.component.html',
  styleUrls: ['./score.component.scss'] // Corrigido para plural
})
export class ScoreComponent implements OnInit {
  userName?: string;

  testService = inject(TestService);
  quizResult!: MatchUser;
    ngOnInit(): void {
      console.log("score");

      this.quizResult = this.testService.quizResult;
      console.log(this.quizResult)
      const userId = this.quizResult.user;
      if (userId) {
        this.testService.getUserById(userId).subscribe(
          (user) => {
            this.userName = user.username;  // Armazene o nome do usuário
            console.log("Nome do usuário:", this.userName);  // Exiba o nome do usuário
          },
          (error) => {
            console.error('Erro ao buscar o nome do usuário:', error);
          }
        );
      } else {
        console.error('userId não encontrado no quizResult.');
      }
    }

}
