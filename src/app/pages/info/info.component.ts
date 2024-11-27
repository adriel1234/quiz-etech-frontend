import {Component, inject} from '@angular/core';
import {TestService} from '../../shared/services/test';
import {Quiz} from '../../shared/models/quiz';
import {Router, RouterEvent} from '@angular/router';
import {MatButton} from '@angular/material/button';
import {MatFormField, MatLabel} from '@angular/material/form-field';
import {MatInput} from '@angular/material/input';
import {MatButtonModule} from '@angular/material/button';
import {join} from '@angular/compiler-cli';

@Component({
  selector: 'app-info',
  standalone: true,
  imports: [
    MatButton,
    MatFormField,
    MatInput,
    MatLabel,
    MatButtonModule
  ],
  templateUrl: './info.component.html',
  styleUrl: './info.component.scss'
})
export class InfoComponent {

  testService=inject(TestService);
  quizInfo!:Quiz;
  router=inject(Router);
  ngOnInit(){
    let quizResult = this.testService.quizResult
    if (!quizResult){
      this.router.navigateByUrl("/info");
      return;
    }
    let quizId = quizResult.quizId;
    this.testService.getQuizById(quizId).subscribe((quiz) => {
      this.quizInfo=quiz;
    })
  }
  join(){
    this.router.navigateByUrl('/login');
  }

}
