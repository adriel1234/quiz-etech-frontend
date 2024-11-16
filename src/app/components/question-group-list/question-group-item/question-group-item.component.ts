import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';

@Component({
  selector: 'app-question-group-item',
  standalone: true,
  imports: [],
  templateUrl: './question-group-item.component.html',
  styleUrl: './question-group-item.component.scss'
})
export class QuestionGroupItemComponent {
  action: string;
  groupQuestion: any;

  constructor(
    public dialogRef: MatDialogRef<QuestionGroupItemComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.action = data.action;
    this.groupQuestion = data.groupQuestion ? { ...data.groupQuestion } : { description: '' };
  }

  save(): void {
    this.dialogRef.close(this.groupQuestion);
  }

  close(): void {
    this.dialogRef.close();
  }
}
