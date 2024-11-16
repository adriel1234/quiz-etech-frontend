import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import {QuestionGroupService} from '../../shared/services/question.group.service';

@Component({
  selector: 'app-question-group-create',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './question-group-create.component.html',
  styleUrls: ['./question-group-create.component.scss'],
})
export class QuestionGroupCreateComponent {
  questionGroupForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private questionGroupService: QuestionGroupService,
    private toastr: ToastrService
  ) {
    this.questionGroupForm = this.fb.group({
      description: ['', Validators.required],
    });
  }

  onSubmit(): void {
    if (this.questionGroupForm.valid) {
      this.questionGroupService.createQuestionGroup(this.questionGroupForm.value).subscribe(
        () => {
          this.toastr.success('Question Group created successfully');
          this.questionGroupForm.reset();
        },
        (error) => {
          this.toastr.error('Error creating Question Group');
          console.error(error);
        }
      );
    } else {
      this.toastr.warning('Please fill out the form correctly');
    }
  }
}
