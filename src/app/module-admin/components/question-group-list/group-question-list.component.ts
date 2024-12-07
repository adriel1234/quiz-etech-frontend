import { Component, OnInit } from '@angular/core';
import {MatDialog, MatDialogModule} from '@angular/material/dialog';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {QuestionGroupItemComponent} from './question-group-item/question-group-item.component';
import {GroupQuestionService} from './group-question-service';
import {NavigationExtras, Router} from '@angular/router';
import {HttpClient} from '@angular/common/http';
import {MatCard} from '@angular/material/card';
import {FormsModule} from '@angular/forms';
import {QuestionGroup} from '../../../shared/models/question-group.model';
import {BaseService} from '../../../shared/services/base.service';
import {URLS} from '../../../shared/urls';

@Component({
  selector: 'app-group-question-list',
  standalone: true,
  imports: [MatTableModule, MatButtonModule, MatDialogModule, MatIconModule, MatFormFieldModule, MatInputModule, MatCard, FormsModule],
  templateUrl: './group-question-list.component.html',
  styleUrls: ['./group-question-list.component.scss'],
})
export class GroupQuestionListComponent implements OnInit {
  displayedColumns: string[] = ['id','description', 'actions'];
  public dataSource: QuestionGroup[] = [];
  public searchDescription: string = '';

  private router: Router = new Router();

  private service: BaseService<QuestionGroup>;


  constructor(private http: HttpClient) {
    this.service = new BaseService<QuestionGroup>(http, URLS.GROUP);
  }

  public ngOnInit(): void {
    this.search();
  }

  public search(resetIndex: boolean = false): void {

    this.service.addParameter('description', this.searchDescription);
    this.service.getAll().subscribe({
      next: (data: QuestionGroup[]) => {
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
        console.error('Error deleting Grupo');
      }
    });
  }


  public goToPage(route:string):void{
    const extras: NavigationExtras = {queryParamsHandling:'merge'};
    this.router.navigate([route],extras).then();
  }
}
