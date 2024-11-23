import { Component, OnInit } from '@angular/core';
import {MatDialog, MatDialogModule} from '@angular/material/dialog';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import {QuestionService} from '../../shared/services/question.service';
import {QuestionAnswerFormComponent} from './question-answer-form/question-answer-form.component';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {NavigationExtras, Router} from '@angular/router';
import {QuestionGroup} from '../../shared/models/question-group.model';
import {BaseService} from '../../shared/services/base.service';
import {HttpClient} from '@angular/common/http';
import {URLS} from '../../shared/urls';
import {Question} from '../../shared/models/question.model';
import {FormsModule} from '@angular/forms';
import {MatCard} from '@angular/material/card';

@Component({
  selector: 'app-question-list',
  standalone: true,
  imports: [MatTableModule, MatButtonModule, MatDialogModule, MatIconModule, MatFormFieldModule, MatInputModule, FormsModule, MatCard],
  templateUrl: './question-list.component.html',
  styleUrls: ['./question-list.component.scss'],
})
export class QuestionListComponent implements OnInit {
  displayedColumns: string[] = ['id','description', 'actions'];
  public dataSource: Question[] = [];
  public searchDescription: string = '';

  private router: Router = new Router();

  private service: BaseService<Question>;


  constructor(private http: HttpClient) {
    this.service = new BaseService<Question>(http, URLS.QUESTION);
  }

  public ngOnInit(): void {
    this.search();
  }

  public search(resetIndex: boolean = false): void {

    this.service.addParameter('description', this.searchDescription);
    this.service.getAll().subscribe({
      next: (data: Question[]) => {
        this.dataSource = data;
      },
      error: (_) => {
        console.error('Error loading QuestionGroup');
      }
    });
  }

  public deleteObject(id: number): void {
    this.service.delete(id).subscribe({
      next: (_) => {
        this.search();
      },
      error: (_) => {
        console.error('Error deleting Question');
      }
    });
  }


  public goToPage(route:string):void{
    const extras: NavigationExtras = {queryParamsHandling:'merge'};
    this.router.navigate([route],extras).then();
  }
}
