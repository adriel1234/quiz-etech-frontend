import { Component, OnInit } from '@angular/core';
import {AbstractControl, FormArray, FormBuilder, FormGroup, FormsModule, Validators} from '@angular/forms';
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
import {ActivatedRoute} from '@angular/router';


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
  public question!: Question;
  protected questionId: number | null = null;

  constructor(
    http: HttpClient,
    private questionService: QuestionService,
    private toastr: ToastrService,
    private fb: FormBuilder,
    private route: ActivatedRoute // Para obter o ID da URL
  ) {
    super(http, URLS.QUESTION);
    this.questionForm = this.fb.group({
      description: ['', [Validators.required]],
      options: this.fb.array([]),
    });
  }

  ngOnInit(): void {
    this.questionForm = this.fb.group({
      description: ['', Validators.required],
      options: this.fb.array([]),  // Inicia o FormArray vazio
    });

    this.questionId = Number(this.route.snapshot.paramMap.get('id'));

    if (this.questionId) {
      this.loadQuestionData();
    } else {
      this.addInitialOptions();
    }
  }
  private loadQuestionData(): void {
    this.questionService.getById(this.questionId!).subscribe({
      next: (data: Question) => {
        // Preenche o campo description
        this.questionForm.patchValue({
          description: data.description,
        });

        // Preenche o FormArray de opções
        this.setOptions(data.options);
      },
      error: () => {
        this.toastr.error('Erro ao carregar os dados da questão.');
      },
    });
  }


  private setOptions(options: Option[]): void {
    const optionsArray = this.questionForm.get('options') as FormArray;

    // Limpar as opções existentes no FormArray antes de adicionar novas
    optionsArray.clear();

    options.forEach(option => {
      optionsArray.push(
        this.fb.group({
          description: [option.description, Validators.required],
          correct: [option.correct]
        })
      );
    });
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
    // Inicialize com 4 opções vazias
    while (this.optionsArray.length < 4) {
      this.addOption({ description: '', correct: false });
    }
  }
  private addOption(option: Partial<Option> = { description: '', correct: false }): void {
    const optionGroup = this.fb.group({
      description: [option.description || '', Validators.required],
      correct: [option.correct || false],
    });

    this.optionsArray.push(optionGroup);  // Adiciona a opção no FormArray
  }

  protected clearCorrectOptions(selectedOptionControl: AbstractControl): void {
    // Verifica se a opção selecionada está marcada como 'correta'
    if (selectedOptionControl.get('correct')?.value) {
      this.optionsArray.controls.forEach((control) => {
        // Desmarca as outras opções, exceto a selecionada
        if (control !== selectedOptionControl && control.get('correct')?.value) {
          control.get('correct')?.setValue(false, { emitEvent: false });
        }
      });
    }
  }

  onSubmit(): void {
    if (this.questionForm.valid) {
      const questionData: Question = {
        ...this.questionForm.value,
        options: this.questionForm.value.options.map((option: any) => ({
          description: option.description,
          correct: option.correct,
        })),
      };

      if (this.questionId) {
        // faz a atualização chama o update usa o question service
        this.questionService.updateQuestion(this.questionId, questionData).subscribe({
          next: () => {
            this.toastr.success('Pergunta atualizada com sucesso!');
            this.goToQuestionPage(); // volta para list

          },
          error: () => {
            this.toastr.error('Ocorreu um erro ao atualizar a pergunta.');
          },
        });
      } else {
        // faz o create usar do base service
        this.service.save(questionData).subscribe({
          next: () => {
            this.toastr.success('Pergunta cadastrada com sucesso!');
            this.resetForm();
          },
          error: () => {
            this.toastr.error('Ocorreu um erro ao cadastrar a pergunta.');
          },
        });
      }
    } else {
      this.toastr.warning('Por favor, preencha todos os campos corretamente.');
    }
  }

  private resetForm(): void {
    this.questionForm.reset({
      description: '',
      options: [],
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
