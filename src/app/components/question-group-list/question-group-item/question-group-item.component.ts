import { Component, OnInit } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { ActivatedRoute } from '@angular/router';
import { QuestionService } from '../../../shared/services/question.service';
import { CommonModule } from '@angular/common';
import { MatCheckboxModule } from '@angular/material/checkbox';
import {MatListOption, MatSelectionList } from '@angular/material/list';
import {MatCard, MatCardContent, MatCardHeader, MatCardTitle} from '@angular/material/card';

@Component({
  selector: 'app-question-group-item',
  standalone: true,
  imports: [
    CommonModule,
    MatFormFieldModule,
    FormsModule,
    MatInputModule,
    MatButtonModule,
    MatCheckboxModule,
    MatCardContent,
    MatCardTitle,
    MatCardHeader,
    MatCard,
    MatSelectionList,
    MatListOption
  ],
  templateUrl: './question-group-item.component.html',
  styleUrl: './question-group-item.component.scss'
})
export class QuestionGroupItemComponent implements OnInit{
  action: string = '';
  groupQuestion: any = { description: '', questions: [] };
  questions: any[] = [];
  selectedQuestions: { [id: number]: boolean } = {};

  constructor(private route: ActivatedRoute, private questionService: QuestionService) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.action = params['action'];
      if (this.action === 'edit') {
        // Carregar dados para edição, se necessário
      }
    });

    this.questionService.getQuestions().subscribe(questions => {
      this.questions = questions;
    });
  }

  selecionarPergunta(question: any): void {
    if (this.selectedQuestions[question.id]) {
      this.groupQuestion.questions.push(question);
    } else {
      this.groupQuestion.questions = this.groupQuestion.questions.filter((q: any) => q.id !== question.id);
    }
  }

  save(): void {
    console.log(this.groupQuestion);
  }

  close(): void {
    console.log('Formulário cancelado');
  }
}
