import { Component, OnInit, inject } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import {ActivatedRoute, Router} from '@angular/router';
import { MatRadioModule } from '@angular/material/radio';

import {TestService} from '../../../services/test.service';

import {QuizService} from './quiz.service';
import {FormsModule} from '@angular/forms';
import {NgForOf, NgIf} from '@angular/common';
import {QuestionService} from '../../../shared/services/question.service';
import {MatchUser} from '../../../shared/models/match-user.model';


@Component({
  selector: 'app-match',
  standalone: true,
  imports: [
    MatButton,
    MatFormField,
    MatInput,
    MatLabel,
    MatRadioModule,
    FormsModule,
    NgForOf,
    NgIf,
  ],
  templateUrl: './match.component.html',
  styleUrls: ['./match.component.scss'] // Corrigido: estilo é um array
})
export class MatchComponent implements OnInit {
  testService = inject(TestService);
  router = inject(Router);
  quizInfo?: MatchUser;
  quizData: any;
  match: number = 0;
  questions: any[] = [];
  currentQuestionIndex = 0; // Começa pela primeira pergunta
  currentQuestion: any; // Altera o tipo para lidar com o dado retornado
  selectedOptions: { [key: number]: number } = {}; // Respostas do usuário

  constructor(
    private quizService: QuizService,
    private questionService: QuestionService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    console.log("match");

    // Acessando os detalhes do match
    this.quizData = this.testService.matchDetails;

    // Acessando o valor de 'question_group' diretamente
    const questionGroupId = this.testService.matchDetails.question_group;

    console.log(this.quizData);        // Exibe todos os dados do match
    console.log(questionGroupId);      // Exibe o valor de 'question_group'

      // Busca todas as questões pelo grupo
      this.quizService.getQuestionsByGroup(questionGroupId).subscribe((questions) => {
        this.questions = questions;
        console.log("tamanho questions",questions.length)
        console.log('Questions fetched:', this.questions);

        // Define a primeira questão como a atual
        if (this.questions.length > 0) {
          this.currentQuestion = this.questions[this.currentQuestionIndex];
        } else {
          console.warn('Nenhuma questão encontrada.');
        }
      });
  }

  // Método para avançar para a próxima questão
  nextQuestion(): void {
    if (this.currentQuestionIndex < this.questions.length - 1) {
      this.currentQuestionIndex++;
      this.currentQuestion = this.questions[this.currentQuestionIndex];
    }
  }


  // Função para navegar para a questão anterior
  previousQuestion() {
    if (this.currentQuestionIndex > 0) {
      this.currentQuestionIndex--;
    }
  }

  // Função para registrar a opção selecionada
  onOptionSelected(questionId: number, optionId: number) {
    this.selectedOptions[questionId] = optionId;
  }
  submit(){

    this.router.navigateByUrl("player/score")

  }
  calculateResult(){


  }
}
