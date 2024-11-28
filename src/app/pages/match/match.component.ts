import {Component, inject} from '@angular/core';
import {MatButton} from '@angular/material/button';
import {MatFormField, MatLabel} from '@angular/material/form-field';
import {MatInput} from '@angular/material/input';
import {TestService} from '../../shared/services/test';
import {Question} from '../../shared/models/question.model';
import {Quiz} from '../../shared/models/quiz';
import {QuizResult} from '../../shared/models/quiz-result';
import {Router} from '@angular/router';
import {MatRadioModule} from '@angular/material/radio';

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
  styleUrl: './match.component.scss'
})
export class MatchComponent {
  testService=inject(TestService);
  router=inject(Router)
  // armazenar os dados do jogador
  questions:Question[] = [];
  quizInfo!:Quiz;
  quizResult!:QuizResult;
  currentQuestion:number = 0;
  ngOnInit(){
    this.quizResult = this.testService.quizResult
    if(!this.quizResult){}
    this.testService.getQuestions().subscribe(results => {
      this.questions = results;
    });
    this.testService.getQuizById(this.quizResult.quizId).subscribe(quiz => {
    this.quizInfo= quiz;
    });
  }
  get getCurrentQuestion(){
    let questionId = this.quizInfo.questions[this.currentQuestion];
    return this.questions.find(x => x.id === questionId);
  }

}
