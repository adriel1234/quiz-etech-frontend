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
  currentQuestionNo:number = 0;
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
  get currentQuestion(){
    let questionId = this.quizInfo.questions[this.currentQuestionNo];
    return this.questions.find(x => x.id === questionId);
  }
  currentSelectedOptionId = '';
  next(){
    this.quizResult.response?.push({
      questionId:this.currentQuestion!.id,
      answerOptionId:this.currentSelectedOptionId
    })
    this.currentQuestionNo++;
    this.currentSelectedOptionId="";
  }
  submit(){
  this.next()
  this.calculateResult()
  this.testService.upDateQuizResult(this.quizResult.id!,this.quizResult).subscribe();
  this.router.navigate(['/score'])
  }
  calculateResult(){
    let score = 0;
    let correct = 0;
    let inCorrect = 0;
    let unAttempted = 0;
    let percentage = 0;
    let totalMark = 0;
    this.quizResult.response?.forEach((response) => {
      let questionId = response.questionId;
      let selectedOptionId=response.answerOptionId;
      let question=this.questions.find(x => x.id === questionId);
      let correctOptionId = question?.options.find(x => x.correct==true);
      totalMark += question!.marks;
      if (!selectedOptionId){
        unAttempted++;
      } else if (selectedOptionId == questionId?.id){
        correct++;
        score+=question!.marks;
      } else {
        inCorrect++;
        score-=question!.negativemarks;
      }
    });
    percentage = Math.round((score/totalMark) * 100);
    this.quizResult.score=score;
    this.quizResult.correct =correct;
    this.quizResult.inCorrect=inCorrect;
    this.quizResult.unAttempt=unAttempted;
    this.quizResult.percentage=percentage;
  }
}
