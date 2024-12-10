import {Component, OnInit} from '@angular/core';
import {MatError, MatFormField, MatLabel} from '@angular/material/form-field';
import {MatInput} from '@angular/material/input';
import {MatButton} from '@angular/material/button';
import {ActivatedRoute} from '@angular/router';
import {QuestionService} from '../../../shared/services/question.service';
import {CommonModule} from '@angular/common';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatListOption, MatSelectionList} from '@angular/material/list';
import {MatCard, MatCardContent, MatCardHeader} from '@angular/material/card';
import {FormArray, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {MatPaginatorModule, PageEvent} from '@angular/material/paginator';
import {MatSnackBar} from '@angular/material/snack-bar';
import {QuestionGroup} from '../../../shared/models/question-group.model';
import {BaseComponent} from '../../base.component';
import {HttpClient} from '@angular/common/http';
import {URLS} from '../../../shared/urls';
import {Question} from '../../../shared/models/question.model';
import {MatOption, MatSelect} from '@angular/material/select';
import {firstValueFrom} from 'rxjs';

@Component({
  selector: 'app-question-group-item',
  standalone: true,
  imports: [
    MatCheckboxModule,
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
    MatPaginatorModule,
  ],
  templateUrl: './question-group-item.component.html',
  styleUrl: './question-group-item.component.scss'
})

export class QuestionGroupItemComponent extends BaseComponent<QuestionGroup> implements OnInit {
  public formGroup: FormGroup;
  public questions: Question[] = [];
  public questionGroupId?: number;
  public isFormVisible: boolean = true;
  public paginatedQuestions: Question[] = [];
  public pageSize = 25;
  public pageIndex = 0;

  // Mapeamento para armazenar os IDs das perguntas selecionadas
  private selectedQuestionIds: Set<number> = new Set();

  constructor(http: HttpClient,
              private questionService: QuestionService,
              private route: ActivatedRoute,
              private snackBar: MatSnackBar,
              private fb: FormBuilder) {
    super(http, URLS.GROUP); // Certifique-se de que a URL está correta
    this.formGroup = this.fb.group({
      description: ['', [Validators.required]],
      questions_group_question: this.fb.array([]), // Inicializando o FormArray
    });
  }

  ngOnInit(): void {
    const action: string | null = this.route.snapshot.paramMap.get('action');
    const id: string | null = this.route.snapshot.paramMap.get('id');

    if (action === 'create') {
      this.loadQuestions();  // Carregar perguntas para o formulário novo
    } else if (action === 'edit' && id && !isNaN(Number(id))) {
      this.questionGroupId = Number(id);
      this.loadQuestionGroup();  // Carregar dados do QuestionGroup para edição
    } else {
      this.isFormVisible = false;  // Não exibir o formulário
      console.log('Ação inválida ou ID inválido');
    }
  }

  // Carregar todas as perguntas
  async loadQuestions(): Promise<void> {
    try {
      this.questions = await firstValueFrom(this.questionService.getQuestions());
      this.paginatedQuestions = this.questions.slice(0, this.pageSize);
      const formArray = this.formGroup.get('questions_group_question') as FormArray;

      // Limpar o FormArray antes de preencher
      formArray.clear();
      this.questions.forEach(() => formArray.push(new FormControl(false))); // Adicionar controle para todas as perguntas

    } catch (error) {
      console.error('Erro ao carregar perguntas', error);
      this.snackBar.open('Erro ao carregar perguntas', 'Fechar', { duration: 3000 });
      throw error;
    }
  }

  // Carregar um QuestionGroup existente
  async loadQuestionGroup(): Promise<void> {
    try {
      const data: QuestionGroup | undefined = await this.service.getById(this.questionGroupId!).toPromise();

      if (!data) {
        this.snackBar.open('Grupo de perguntas não encontrado!', 'Fechar', { duration: 3000 });
        this.isFormVisible = false;
        return;
      }

      this.object = data;
      this.formGroup.patchValue({
        description: data.description,
      });

      // Atualizar o conjunto de perguntas selecionadas com base nos IDs
      data.questions_group_question?.forEach((questionId: number) => {
        this.selectedQuestionIds.add(questionId);
      });

      await this.loadQuestions();
      this.syncSelectionsWithPage();

    } catch (error) {
      console.error('Erro ao carregar QuestionGroup', error);
      this.snackBar.open('Erro ao carregar o grupo de perguntas', 'Fechar', { duration: 3000 });
      this.isFormVisible = false;
    }
  }

  // Sincronizar as seleções com a página atual
  syncSelectionsWithPage(): void {
    const formArray = this.formGroup.get('questions_group_question') as FormArray;

    if (!this.paginatedQuestions || this.paginatedQuestions.length === 0) {
      console.warn('Nenhuma pergunta disponível na página');
      return;
    }

    this.paginatedQuestions.forEach((question, index) => {
      const formControl = formArray.controls[index];

      // Marcar a questão se o ID estiver selecionado
      const isSelected = this.selectedQuestionIds.has(question.id);
      formControl.setValue(isSelected); // Atualizar o estado do checkbox
    });
  }


  // trata a mudança de pagina no paginator
  pageEvent(event: PageEvent): void {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;

    const startIndex = this.pageIndex * this.pageSize;
    this.paginatedQuestions = this.questions.slice(startIndex, startIndex + this.pageSize);

    this.syncSelectionsWithPage(); // Sincronizar seleções ao mudar de página
  }

  // Atualizar o conjunto de IDs selecionados (internamente)
  updateSelectedQuestionIds(): void {
    const formArray = this.formGroup.get('questions_group_question') as FormArray;

    if (!this.paginatedQuestions || this.paginatedQuestions.length === 0) {
      console.warn('Nenhuma pergunta disponível na página');
      return; // Retorna sem tentar acessar os dados
    }

    // Atualizar o conjunto de IDs das perguntas selecionadas
    formArray.controls.forEach((control, index) => {
      const question = this.paginatedQuestions[index];

      // Verifique se a pergunta existe antes de acessar seu ID
      if (question) {
        if (control.value) {
          this.selectedQuestionIds.add(question.id); // Adicionar ao conjunto se selecionado
        } else {
          this.selectedQuestionIds.delete(question.id); // Remover do conjunto se desmarcado
        }
      }
    });


  }

  // salvar e alterar
  saveOrUpdate(): void {
    if (this.formGroup.valid) {
      this.validateForm();

      // Preenche o objeto com os IDs das perguntas selecionadas
      this.object.questions_group_question = Array.from(this.selectedQuestionIds);


      // Envia para a API (atualização ou criação)
      if (this.object.id) {
        this.service.update(this.object.id!, this.object).subscribe({
          next: () => {
            this.snackBar.open('Grupo de perguntas atualizado com sucesso', 'Fechar', { duration: 3000 });
            this.goToPage('admin/question-groups');
          },
          error: (error) => {
            console.error('Erro ao atualizar o grupo de perguntas', error);
            this.snackBar.open('Erro ao atualizar o grupo de perguntas', 'Fechar', { duration: 3000 });
          }
        });
      } else {
        this.service.save(this.object).subscribe({
          next: () => {
            this.snackBar.open('Grupo de perguntas salvo com sucesso', 'Fechar', { duration: 3000 });
            this.goToPage('admin/question-groups');
          },
          error: (error) => {
            console.error('Erro ao salvar o grupo de perguntas', error);
            this.snackBar.open('Erro ao salvar o grupo de perguntas', 'Fechar', { duration: 3000 });
          }
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
