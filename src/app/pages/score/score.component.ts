import {Component, inject} from '@angular/core';
import {TestService} from '../../shared/services/test';
import {QuizResult} from '../../shared/models/quiz-result';
import {Router} from '@angular/router';
import {CommonModule, JsonPipe} from '@angular/common';

@Component({
  selector: 'app-score',
  standalone: true,
  imports: [
    JsonPipe,
    CommonModule
  ],
  templateUrl: './score.component.html',
  styleUrl: './score.component.scss'
})
export class ScoreComponent {
  testService=inject(TestService);
  quizResult!:QuizResult;
  router=inject(Router);
  ngOnit(){
    this.quizResult = this.testService.quizResult
    if (!this.quizResult){
      this.router.navigateByUrl("/score");
      return;
    }
    let quizResultId = this.testService.quizResult.id!;
    this.testService.getQuizResult(quizResultId).subscribe(result =>{
      this.quizResult = result;
    })
  }
}
