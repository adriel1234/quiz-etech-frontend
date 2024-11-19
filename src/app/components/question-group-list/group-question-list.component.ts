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

@Component({
  selector: 'app-group-question-list',
  standalone: true,
  imports: [MatTableModule, MatButtonModule, MatDialogModule, MatIconModule, MatFormFieldModule, MatInputModule],
  templateUrl: './group-question-list.component.html',
  styleUrls: ['./group-question-list.component.scss'],
})
export class GroupQuestionListComponent implements OnInit {
  displayedColumns: string[] = ['description', 'actions'];
  dataSource = new MatTableDataSource<any>();


  constructor(private groupQuestionService: GroupQuestionService, public dialog: MatDialog,private router: Router) {}

  ngOnInit(): void {
    this.loadGroupQuestions();
  }
  cadastroNovo(): void {
    this.router.navigate(['/question-groups', 'add']);
  }
  loadGroupQuestions(): void {
    this.groupQuestionService.getGroupQuestions().subscribe((data) => {
      this.dataSource.data = data;
    });
  }


  updateGroupQuestion(groupQuestion: any): void {
    this.groupQuestionService.updateGroupQuestion(groupQuestion.id, groupQuestion).subscribe(() => {
      this.loadGroupQuestions();
    });
  }

  deleteGroupQuestion(id: number): void {
    this.groupQuestionService.deleteGroupQuestion(id).subscribe(() => {
      this.loadGroupQuestions();
    });
  }

  public goToPage(route:string):void{
    const extras: NavigationExtras = {queryParamsHandling:'merge'};
    this.router.navigate([route],extras).then();
  }
  addGroupQuestion(groupQuestion: any): void {
    this.groupQuestionService.createGroupQuestion(groupQuestion).subscribe(() => {
      this.loadGroupQuestions();
    });
  }
  openDialog(action: string, groupQuestion?: any): void {
    const dialogRef = this.dialog.open(QuestionGroupItemComponent, {
      data: { action, groupQuestion },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        if (action === 'add') {
          this.addGroupQuestion(result);
        } else if (action === 'edit') {
          this.updateGroupQuestion(result);
        }
      }
    });
  }
}
