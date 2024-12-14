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
import {QuizService} from './quiz.service';
import {FormsModule} from '@angular/forms';
import {NgForOf} from '@angular/common';


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
  ],
  templateUrl: './match.component.html',
  styleUrls: ['./match.component.scss'] // Corrigido: estilo é um array
})
export class MatchComponent implements OnInit {
  quizData: any;
  currentQuestionIndex = 0;
  currentQuestion: Question | undefined; // Define type as Question (assuming interface)
  selectedOptions: { [key: number]: number } = {};

  constructor(private quizService: QuizService) {}

  ngOnInit(): void {
    this.quizService.getQuizData(5).subscribe(quiz => {
      this.quizData = quiz;
      // Assign the current question based on the index
      this.currentQuestion = this.quizData.questions[this.currentQuestionIndex];
      console.log(this.currentQuestion);
    });
  }

  // Função para navegar para a próxima questão
  nextQuestion() {
    if (this.currentQuestionIndex < this.quizData.questions.length - 1) {
      this.currentQuestionIndex++;
    } else {
      alert('Você terminou o quiz!');
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
}
