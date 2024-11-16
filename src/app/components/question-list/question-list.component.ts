import { Component, OnInit } from '@angular/core';
import {MatDialog, MatDialogModule} from '@angular/material/dialog';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import {QuestionService} from '../../shared/services/question.service';
import {QuestionAnswerFormComponent} from './question-answer-form/question-answer-form.component';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';

@Component({
  selector: 'app-question-list',
  standalone: true,
  imports: [MatTableModule, MatButtonModule, MatDialogModule, MatIconModule, MatFormFieldModule, MatInputModule],
  templateUrl: './question-list.component.html',
  styleUrls: ['./question-list.component.scss'],
})
export class QuestionListComponent implements OnInit {
  displayedColumns: string[] = ['description', 'actions'];
  dataSource = new MatTableDataSource<any>();

  constructor(private questionService: QuestionService, public dialog: MatDialog) {}

  ngOnInit(): void {
    this.loadQuestions();
  }

  loadQuestions(): void {
    this.questionService.getQuestions().subscribe((data) => {
      this.dataSource.data = data;
    });
  }

  openDialog(action: string, question?: any): void {
    const dialogRef = this.dialog.open(QuestionAnswerFormComponent, {
      data: { action, question },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        if (action === 'add') {
          this.addQuestion(result);
        } else if (action === 'edit') {
          this.updateQuestion(result);
        }
      }
    });
  }

  addQuestion(question: any): void {
    this.questionService.createQuestion(question).subscribe(() => {
      this.loadQuestions();
    });
  }

  updateQuestion(question: any): void {
    this.questionService.updateQuestion(question.id, question).subscribe(() => {
      this.loadQuestions();
    });
  }

  deleteQuestion(id: number): void {
    this.questionService.deleteQuestion(id).subscribe(() => {
      this.loadQuestions();
    });
  }
}
