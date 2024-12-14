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
import {QuestionService} from '../../../shared/services/question.service';


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
  match: number=0;
  public questions: Question[] = [];
  currentQuestionIndex = 0;
  currentQuestion: Question | undefined; // Define type as Question (assuming interface)
  selectedOptions: { [key: number]: number } = {};

  constructor(private quizService: QuizService,private questionService: QuestionService,private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.match = Number(this.route.snapshot.paramMap.get('id'));
    this.quizService.getQuizData(4).subscribe(quiz => {
      this.quizData = quiz;

      const questionGroupIds = this.quizData.questions_group_question;

      questionGroupIds.forEach((questionId: number) => {
        this.questionService.getById(questionId).subscribe(question => {
          // Process the fetched question
          console.log(question);

          // Add the question to a list of questions, if needed
          this.questions.push(question);
        });
      });
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
