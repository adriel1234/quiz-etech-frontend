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
    // Inicializa o formulário com validações necessárias
    this.questionForm = this.fb.group({
      description: ['', [Validators.required]],
      options: this.fb.array([]),
    });
  }

  ngOnInit(): void {
    this.addInitialOptions(); // Adiciona 4 opções iniciais
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

  /**
   * Adiciona uma nova opção ao array de opções.
   */
  addOption(): void {
    if (this.optionsArray.length < 4) {
      const optionGroup = this.fb.group({
        description: ['', [Validators.required]],
        correct: [false],
        question: [null],  // Adiciona a propriedade `question`, mesmo que seja null por enquanto
      });

      // Monitora o checkbox "correct" para manter apenas uma opção correta
      optionGroup.get('correct')?.valueChanges.subscribe((isChecked) => {
        if (isChecked) {
          this.clearCorrectOptions(optionGroup);
        }
      });

      this.optionsArray.push(optionGroup);
    }
  }
  /**
   * Garante que apenas uma opção seja marcada como correta.
   * @param selectedOptionGroup Grupo selecionado.
   */
  private clearCorrectOptions(selectedOptionGroup: FormGroup): void {
    this.optionsArray.controls.forEach((control) => {
      if (control !== selectedOptionGroup && control.get('correct')?.value) {
        control.get('correct')?.setValue(false, { emitEvent: false });
      }
    });
  }


  /**
   * Envia o formulário para o backend usando o `QuestionService`.
   */
  onSubmit(): void {
    if (this.questionForm.valid) {
      const questionData: Question = {
        ...this.questionForm.value,
        options: this.questionForm.value.options.map((option: any) => ({
          description: option.description,
          correct: option.correct,
          question: option.question,  // Ajuste conforme necessário
        })),
      };

      this.questionService.createQuestion(questionData).subscribe({
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

  /**
   * Reseta o formulário para o estado inicial.
   */
  private resetForm(): void {
    this.questionForm.reset();
    this.optionsArray.clear(); // Limpa o array de opções
    this.addInitialOptions(); // Recria as 4 opções iniciais
  }

  /**
   * Retorna o rótulo da alternativa (ex.: A, B, C, etc.).
   * @param index Índice da alternativa.
   * @returns Rótulo da alternativa.
   */
  getAlternativaLabel(index: number): string {
    const alternativas = ['A', 'B', 'C', 'D', 'E'];
    return alternativas[index] || '';
  }
}
