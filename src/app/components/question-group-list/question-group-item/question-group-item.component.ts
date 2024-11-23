import { Component, OnInit } from '@angular/core';
import {MatError, MatFormField, MatFormFieldModule, MatLabel} from '@angular/material/form-field';
import {MatInput, MatInputModule} from '@angular/material/input';
import {MatButton, MatButtonModule} from '@angular/material/button';
import { ActivatedRoute } from '@angular/router';
import { QuestionService } from '../../../shared/services/question.service';
import { CommonModule } from '@angular/common';
import { MatCheckboxModule } from '@angular/material/checkbox';
import {MatListOption, MatSelectionList } from '@angular/material/list';
import {MatCard, MatCardContent, MatCardHeader, MatCardTitle} from '@angular/material/card';
import {FlexLayoutModule} from '@ngbracket/ngx-layout';
import {GroupQuestionService} from '../group-question-service';
import {
  Validators,
  FormGroup,
  NonNullableFormBuilder,
  UntypedFormArray,
  FormsModule,
  ReactiveFormsModule, FormControl
} from '@angular/forms';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import {QuestionGroup} from '../../../shared/models/question-group.model';
import {BaseComponent} from '../../base.component';
import {HttpClient} from '@angular/common/http';
import {URLS} from '../../../shared/urls';
import {Question} from '../../../shared/models/question.model';
import {MatOption, MatSelect} from '@angular/material/select';

@Component({
  selector: 'app-question-group-item',
  standalone: true,
  imports: [
    MatButton,
    MatError,
    MatFormField,
    MatInput,
    MatLabel,
    ReactiveFormsModule,
    MatListOption,
    MatButton,
    MatError,
    MatFormField,
    MatInput,
    MatLabel,
    ReactiveFormsModule,
    MatCardHeader,
    MatCard,
    MatCardContent,
    MatSelectionList,
    CommonModule,
    MatSelect,
    MatOption,
  ],
  templateUrl: './question-group-item.component.html',
  styleUrl: './question-group-item.component.scss'
})

export class QuestionGroupItemComponent extends BaseComponent<QuestionGroup> implements OnInit {
  public formGroup: FormGroup;
  public questions: Question[] = [];


  constructor(http: HttpClient,    private questionService: QuestionService,  // Injeção do QuestionService
              private snackBar: MatSnackBar) {
    super(http, URLS.GROUP); // Certifique-se de que a URL está correta
    this.formGroup = new FormGroup({
      description: new FormControl('', [Validators.required]),
      questions_group_question: new FormControl([], [Validators.required]),
    });
  }

  ngOnInit(): void {
    if (this.object.id) {
      this.formGroup.patchValue({
        description: this.object.description,
        questions_group_question: this.object.questions_group_question || [],
      });
    }
    this.loadQuestions();  // Carregar perguntas ao inicializar
  }

  loadQuestions(): void {
    this.questionService.getQuestions().subscribe(
      (data: Question[]) => {
        this.questions = data;
        console.log(data)// Atribuindo as perguntas à variável
      },
      (error) => {
        console.error('Erro ao carregar perguntas', error);
        this.snackBar.open('Erro ao carregar perguntas', 'Fechar', {
          duration: 3000,
        });
      }
    );
  }


  public save(): void {
    if (this.formGroup.valid) {
      this.validateForm();
      this.service.save(this.object).subscribe((response) => {
        this.goToPage('question-groups');
      });
    }
  }

  saveOrUpdate(): void {
    if (this.formGroup.valid) {
      this.validateForm();
      if (this.object.id) {
        this.service.update(this.object.id!, this.object).subscribe((response) => {
          this.goToPage('question-groups');
        });
      } else {
        this.service.save(this.object).subscribe((response) => {
          this.goToPage('question-groups');
        });
      }
    }
  }

  private validateForm(): void {
    Object.keys(this.formGroup.getRawValue()).forEach((key) => {
      const value = this.formGroup.getRawValue()[key];
      if (value !== null && value !== undefined) {
        if (this.isValidKey(key)) {
          this.object[key as keyof QuestionGroup] = value;
        }
      }
    });
  }

  private isValidKey(key: string): key is keyof QuestionGroup {
    return ['id', 'description', 'questions_group_question'].includes(key);
  }
}
