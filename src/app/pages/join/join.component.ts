import {Component, inject} from '@angular/core';
import {MatFormField} from '@angular/material/form-field';
import {MatInput, MatInputModule} from '@angular/material/input';
import {MatButtonModule} from '@angular/material/button';
import {TestService} from '../../shared/services/test';
import {QuizResult} from '../../shared/models/quiz-result';

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
  testService=inject(TestService)

  join(){
    if(this.name && this.code){
      this.testService.getQuizByCode(this.code).subscribe((result) => {
        let quiz=result[0];
        let quizResult:QuizResult={
          name:this.name,
          quizId:quiz.id,
        }
        this.testService.joinQuiz(quizResult).subscribe(response =>{
            console.log(response);
        });
      })

    }
    else {

    }
  }

}
