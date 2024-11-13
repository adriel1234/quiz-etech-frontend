import { Component, OnInit } from '@angular/core';
import {QuestionService} from '../../services/question.service';


@Component({
  selector: 'app-question-list',
  templateUrl: './question-list.component.html',
  styleUrls: ['./question-list.component.css']
})
export class QuestionListComponent implements OnInit {
  questions: any[] = [];
  loading: boolean = false;

  constructor(private questionService: QuestionService) {}

  ngOnInit(): void {
    this.loading = true;
    this.questionService.getQuestions().subscribe(
      (data) => {
        this.questions = data; // Supondo que os dados venham em um array
        this.loading = false;
      },
      (error) => {
        console.error('Erro ao carregar perguntas', error);
        this.loading = false;
      }
    );
  }
}
