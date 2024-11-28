import {Component, inject} from '@angular/core';
import {MatFormField} from '@angular/material/form-field';
import {MatInput, MatInputModule} from '@angular/material/input';
import {MatButtonModule} from '@angular/material/button';
import {TestService} from '../../shared/services/test';
import {QuizResult} from '../../shared/models/quiz-result';
import {Router} from '@angular/router';

@Component({
  selector: 'app-join',
  standalone: true,
  imports: [
    MatFormField,
    MatInput,
    MatInputModule,
    MatButtonModule,
  ],
  templateUrl: './join.component.html',
  styleUrl: './join.component.scss'
})
export class JoinComponent {
  name!: string;
  code!: string;
  testService=inject(TestService);
  router = inject(Router)

  join(){
    function string(id: number) {
      return '';
    }

    if(this.name && this.code){
      this.testService.getQuizByCode(this.code).subscribe((result) => {
        let quiz=result[0];
        let quizResult:QuizResult={
          name:this.name,
          quizId:string(quiz.id),
        }
        this.testService.joinQuiz(quizResult).subscribe(response =>{
            this.testService.joinQuiz(quizResult).subscribe(response =>{})
            this.router.navigateByUrl('/quiz-info');
        });
      })

    }
    else {

    }
  }

}