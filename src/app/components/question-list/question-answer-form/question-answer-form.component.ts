import { Component, OnInit } from '@angular/core';
import {FormArray, FormBuilder, FormGroup, FormsModule, Validators} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { QuestionService } from '../../../shared/services/question.service';
import { ToastrService } from 'ngx-toastr';
import {MatFormFieldModule, MatLabel} from "@angular/material/form-field";
import {MatButton, MatButtonModule, MatIconButton} from '@angular/material/button';
import {MatInputModule} from '@angular/material/input';
import {MatIcon, MatIconModule} from '@angular/material/icon';
import {MatCheckbox} from '@angular/material/checkbox';
import {MatDividerModule} from '@angular/material/divider';
import {MatTooltip} from '@angular/material/tooltip';


@Component({
  selector: 'app-question-answer-form',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatLabel,
    ReactiveFormsModule,
    MatButton,
    MatIcon,
    MatCheckbox,
    MatIconButton,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatDividerModule,
    MatIconModule,
    MatTooltip

  ],
  templateUrl: './question-answer-form.component.html',
  styleUrls: ['./question-answer-form.component.scss'],
})
export class QuestionAnswerFormComponent implements OnInit {
  questionForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private questionService: QuestionService,
    private toastr: ToastrService
  ) {
    this.questionForm = this.fb.group({
      description: ['', [Validators.required]],
      options: this.fb.array([]),
    });
  }

  ngOnInit() {
    this.addInitialOptions();  // Inicializa as 4 opções
  }
  getAlternativaLabel(index: number): string {
    const alternativas = ['A', 'B', 'C', 'D', 'E'];
    return alternativas[index] || '';
  }

  get optionsArray(): FormArray {
    return this.questionForm.get('options') as FormArray;
  }


  addInitialOptions() {
    while (this.optionsArray.length < 4) {
      this.addOption();
    }
  }


  addOption() {
    if (this.optionsArray.length < 4) {
      const optionGroup = this.fb.group({
        description: ['', [Validators.required]],
        correct: [false],
      });


      optionGroup.get('correct')?.valueChanges.subscribe((isChecked) => {
        if (isChecked) {
          this.clearCorrectOptions(optionGroup);
        }
      });

      this.optionsArray.push(optionGroup);
    }
  }


  clearCorrectOptions(selectedOptionGroup: FormGroup) {
    this.optionsArray.controls.forEach((control) => {
      if (control !== selectedOptionGroup && control.get('correct')?.value) {
        control.get('correct')?.setValue(false);  // Desmarcar as outras opções
      }
    });
  }


  removeOption(index: number) {
    this.optionsArray.removeAt(index);
  }

  onSubmit() {
    if (this.questionForm.valid) {
      const formData = this.questionForm.value;
      const questionData = {
        description: formData.description,
        options: formData.options,
      };

      this.questionService.createQuestion(questionData).subscribe(
        response => {
          this.toastr.success('Pergunta cadastrada com sucesso!');
          this.resetForm();
        },
        error => {
          this.toastr.error('Ocorreu um erro ao cadastrar a pergunta.');
        }
      );
    }
  }

  resetForm() {
    this.questionForm.reset();  // Limpa todos os campos do formulário


    this.addInitialOptions();
  }
}
