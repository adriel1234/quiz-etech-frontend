import { Component, OnInit, inject } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import {ActivatedRoute, Router} from '@angular/router';
import { MatRadioModule } from '@angular/material/radio';
import { Question } from '../../../shared/models/question.model';
import {TestService} from '../../../services/test.service';
import {Match} from '../../../shared/models/match.model';
import {QuizResult} from '../../../shared/models/quiz-result';


@Component({
  selector: 'app-match',
  standalone: true,
  imports: [
    MatButton,
    MatFormField,
    MatInput,
    MatLabel,
    MatRadioModule,
  ],
  templateUrl: './match.component.html',
  styleUrls: ['./match.component.scss'] // Corrigido: estilo é um array
})
export class MatchComponent implements OnInit {
  testService = inject(TestService);
  route = inject(ActivatedRoute);

  quizData: any;
  matchUser: any;

  ngOnInit() {
    const quizId = Number(this.route.snapshot.paramMap.get('id'));
    console.log('Quiz ID:', quizId);
    const matchUserId = this.route.snapshot.queryParamMap.get('matchUserId');

    this.testService.getQuizWithMatchUser(quizId, matchUserId ?? undefined).subscribe(
      (data) => {
        // Agora, data é o próprio objeto quiz
        this.quizData = data; // Defina diretamente como data
        this.matchUser = undefined; // Ajuste isso de acordo com a lógica que você precisa para o MatchUser
        console.log('Quiz:', this.quizData);
        console.log('MatchUser:', this.matchUser);
      },
      (error) => {
        console.error('Erro ao carregar quiz ou MatchUser:', error);
      }
    );
  }
}
