import { Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule, JsonPipe } from '@angular/common';
import {BaseService} from '../../../shared/services/base.service';
import {QuizResult} from '../../../shared/models/quiz-result';

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
    ngOnInit(): void {
        throw new Error('Method not implemented.');
    }
  // quizResult!: QuizResult;
  //
  // constructor(public router: Router,
  //             public baseService: BaseService<QuizResult>) {
  // }
  //
  // ngOnInit() { // Corrigido o nome do ciclo de vida
  //   this.quizResult = this.baseService.quizResult;
  //
  //   if (!this.quizResult) {
  //     this.router.navigateByUrl("/"); // Redireciona para a página inicial ou rota válida
  //     return;
  //   }
  //
  //   const quizResultId = this.quizResult.id;
  //   if (quizResultId) {
  //     this.baseService.getQuizResult(quizResultId).subscribe(result => {
  //       this.quizResult = result;
  //     });
  //   } else {
  //     console.error("Quiz result ID is missing.");
  //   }
  // }
}
