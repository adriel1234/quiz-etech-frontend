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
import { Question } from '../../../shared/models/question.model';
import {Option} from '../../../shared/models/option.model';
import {BaseComponent} from '../../base.component';
import {HttpClient} from '@angular/common/http';
import {URLS} from '../../../shared/urls';


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
export class QuestionAnswerFormComponent extends BaseComponent<Question> implements OnInit {
  public questionForm: FormGroup;

  constructor(
    http: HttpClient,
    private questionService: QuestionService,
    private toastr: ToastrService,
    private fb: FormBuilder // Injeção do FormBuilder
  ) {
    super(http, URLS.QUESTION); // Passando a URL correta do serviço
    this.questionForm = this.fb.group({
      description: ['', [Validators.required]],
      options: this.fb.array([]),
    });
  }

  ngOnInit(): void {
    this.addInitialOptions();  // Adiciona opções iniciais como no código anterior
  }

  /**
   * Retorna o array de opções do formulário.
   */
  get optionsArray(): FormArray {
    return this.questionForm.get('options') as FormArray;
  }

  /**
   * Adiciona as opções iniciais ao formulário.
   */
  private addInitialOptions(): void {
    while (this.optionsArray.length < 4) {
      this.addOption();
    }
  }

  addOption(): void {
    if (this.optionsArray.length < 4) {
      const optionGroup = this.fb.group({
        description: [' ', [Validators.required]],
        correct: [false],
        question: [null],  // Adiciona a propriedade `question`, mesmo que seja null por enquanto
      });

      optionGroup.get('correct')?.valueChanges.subscribe((isChecked) => {
        if (isChecked) {
          this.clearCorrectOptions(optionGroup);
        }
      });

      this.optionsArray.push(optionGroup);
    }
  }

  private clearCorrectOptions(selectedOptionGroup: FormGroup): void {
    this.optionsArray.controls.forEach((control) => {
      if (control !== selectedOptionGroup && control.get('correct')?.value) {
        control.get('correct')?.setValue(false, { emitEvent: false });
      }
    });
  }

  onSubmit(): void {
    if (this.questionForm.valid) {
      const questionData: Question = {
        ...this.questionForm.value,
        options: this.questionForm.value.options.map((option: any) => ({
          description: option.description,
          correct: option.correct,
          question: option.question,
        })),
      };

      this.service.save(questionData).subscribe({
        next: () => {
          this.toastr.success('Pergunta cadastrada com sucesso!');
          this.resetForm();
        },
        error: () => {
          this.toastr.error('Ocorreu um erro ao cadastrar a pergunta.');
        },
      });
    } else {
      this.toastr.warning('Por favor, preencha todos os campos corretamente.');
    }
  }

  private resetForm(): void {
    this.questionForm.reset({
      description: ' ',
      options: []
    });

    this.optionsArray.clear();
    this.addInitialOptions();
  }


  public goToQuestionPage(): void {
    this.goToPage('question');
  }

  getAlternativaLabel(index: number): string {
    const labels = ['A', 'B', 'C', 'D'];  // Array com as letras
    return labels[index] || String.fromCharCode(97 + index); // Garante que, se o índice for maior que 3, a letra seja gerada
  }
}
