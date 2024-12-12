import { Component, OnInit, inject } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { Router } from '@angular/router';
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
  router = inject(Router);

  questions: Question[] = [];
  quizInfo!: Match;
  quizResult!: QuizResult;
  currentQuestionNo: number = 0;
  currentSelectedOptionId = '';

  ngOnInit() {
    // Obter o resultado do quiz
    this.quizResult = this.testService.quizResult;

    if (!this.quizResult) {
      this.router.navigateByUrl('/');
      return;
    }

    // Obter questões
    this.testService.getQuestions().subscribe((results) => {
      this.questions = results;
    });

    // Obter informações do quiz
    // this.testService.getQuizById(this.quizResult.quizId).subscribe((quiz) => {
    //   this.quizInfo = quiz;
    // });
  }

  // // Pega a pergunta atual
  // get currentQuestion() {
  //   const questionId = this.quizInfo.questions[this.currentQuestionNo];
  //   return this.questions.find((x) => x.id === questionId);
  // }
  //
  // // Próxima questão
  // next() {
  //   if (!this.currentQuestion) {
  //     console.error('Nenhuma pergunta encontrada.');
  //     return;
  //   }
  //
  //   this.quizResult.response = this.quizResult.response || [];
  //   this.quizResult.response.push({
  //     questionId: this.currentQuestion.id,
  //     answerOptionId: this.currentSelectedOptionId,
  //   });
  //
  //   this.currentQuestionNo++;
  //   this.currentSelectedOptionId = '';
  // }
  //
  // // Submeter respostas
  // submit() {
  //   this.next();
  //   this.calculateResult();
  //   this.testService.updateQuizResult(this.quizResult.id!, this.quizResult).subscribe(() => {
  //     this.router.navigate(['/score']);
  //   });
  // }
  //
  // // Calcular resultados do quiz
  // calculateResult() {
  //   let score = 0;
  //   let correct = 0;
  //   let inCorrect = 0;
  //   let unAttempted = 0;
  //   let totalMark = 0;
  //
  //   this.quizResult.response?.forEach((response) => {
  //     const questionId = response.questionId;
  //     const selectedOptionId = response.answerOptionId;
  //     const question = this.questions.find((x) => x.id === questionId);
  //
  //     if (question) {
  //       totalMark += question.marks;
  //
  //       if (!selectedOptionId) {
  //         unAttempted++;
  //       } else if (selectedOptionId === String(question.options.find((x) => x.correct)?.id)) {
  //         correct++;
  //         score += question.marks;
  //       } else {
  //         inCorrect++;
  //         score -= question.negativemarks || 0;
  //       }
  //     }
  //   });
  //
  //   const percentage = totalMark > 0 ? Math.round((score / totalMark) * 100) : 0;
  //
  //   this.quizResult.score = score;
  //   this.quizResult.correct = correct;
  //   this.quizResult.inCorrect = inCorrect;
  //   this.quizResult.unAttempt = unAttempted;
  //   this.quizResult.percentage = percentage;
  // }
}
