import {Component, inject} from '@angular/core';
import {TestService} from '../../shared/services/test';
import {Quiz} from '../../shared/models/quiz';
import {Router, RouterEvent} from '@angular/router';

@Component({
  selector: 'app-info',
  standalone: true,
  imports: [],
  templateUrl: './info.component.html',
  styleUrl: './info.component.scss'
})
export class InfoComponent {

  testService=inject(TestService);
  quizInfo!:Quiz;
  router=inject(Router);
  ngOnInit(){
    let quizResult=this.testService.quizResult;
    if(!quizResult){
      this.router.navigate(['/']);
      return;
    }
    let quizId=quizResult.quizId;
    this.testService.getQuizById(quizId).subscribe((quiz) => {
      this.quizInfo = quiz;
    });
  }

}
