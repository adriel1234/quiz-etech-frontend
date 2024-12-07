import {Component, OnInit} from '@angular/core';
import {MatError, MatFormField, MatLabel} from '@angular/material/form-field';
import {MatInput} from '@angular/material/input';
import {MatButton} from '@angular/material/button';
import { ActivatedRoute } from '@angular/router';
import { QuestionService } from '../../../shared/services/question.service';
import { CommonModule } from '@angular/common';
import { MatCheckboxModule } from '@angular/material/checkbox';
import {MatListOption, MatSelectionList } from '@angular/material/list';
import {MatCard, MatCardContent, MatCardHeader} from '@angular/material/card';
import {
  Validators,
  FormGroup,
  ReactiveFormsModule, FormControl, FormArray, FormBuilder
} from '@angular/forms';
import { MatSnackBar} from '@angular/material/snack-bar';
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
  ],
  templateUrl: './question-group-item.component.html',
  styleUrl: './question-group-item.component.scss'
})

export class QuestionGroupItemComponent extends BaseComponent<QuestionGroup> implements OnInit {
  public formGroup: FormGroup;
  public questions: Question[] = [];
  public questionGroupId?: number;
  public isFormVisible: boolean = true;


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

    // novo formulario
    if (action === 'create') {
      this.loadQuestions();  // Carregar perguntas para o formulário novo
      // verirfica se action é edit e se id é um numero
    } else if (action === 'edit' && id && !isNaN(Number(id))) {
      this.questionGroupId = Number(id);
      this.loadQuestionGroup();  // Carregar dados do QuestionGroup para edição
    } else {
      this.isFormVisible = false;  // Não exibir o formulário
      console.log('Ação inválida ou ID inválido');
    }
  }

  async loadQuestions(): Promise<void> {
    try {
      // Usando firstValueFrom para obter os dados do Observable
      const data: Question[] = await firstValueFrom(this.questionService.getQuestions());

      this.questions = data;
      const formArray = this.formGroup.get('questions_group_question') as FormArray;

      // Adicionando FormControl para cada pergunta com valor inicial 'false'
      data.forEach(() => formArray.push(new FormControl(false)));

      // A Promise será resolvida quando os dados forem carregados
    } catch (error) {
      console.error('Erro ao carregar perguntas', error);
      this.snackBar.open('Erro ao carregar perguntas', 'Fechar', { duration: 3000 });

      // Rejeitando a Promise em caso de erro
      throw error;
    }
  }

  // metodo para carregas as perguntas  selecionadas pegando da API pelo ID

  async loadQuestionGroup(): Promise<void> {
    try {
      const data: QuestionGroup | undefined = await this.service.getById(this.questionGroupId!).toPromise();

      // Se a resposta for undefined ou não encontrada (status 404), exibe a mensagem e oculta o formulário
      if (!data) {
        this.snackBar.open('Grupo de perguntas não encontrado!', 'Fechar', { duration: 3000 });
        this.isFormVisible = false; // Esconde o formulário
        return;
      }

      this.object = data;
      this.formGroup.patchValue({
        description: data.description,
      });

      const selectedQuestions = data.questions_group_question || [];
      await this.loadQuestions(); // Carregar as perguntas

      const formArray = this.formGroup.get('questions_group_question') as FormArray;
      formArray.controls.forEach((control, index) => {
        if (selectedQuestions.includes(this.questions[index]?.id)) {
          control.setValue(true);
        } else {
          control.setValue(false);
        }
      });
    } catch (error) {
      // Tratamento de erro adicional para garantir que qualquer erro de requisição também ocultará o formulário
      console.error('Erro ao carregar QuestionGroup', error);
      this.snackBar.open('Erro ao carregar o grupo de perguntas', 'Fechar', { duration: 3000 });
      this.isFormVisible = false; // Esconde o formulário em caso de erro
    }
  }


  saveOrUpdate(): void {
    if (this.formGroup.valid) {
      this.validateForm();

      // Obtendo os valores dos checkboxes
      const selectedQuestions = this.formGroup.get('questions_group_question')?.value;

      // Filtrando as perguntas selecionadas (valores 'true' nos checkboxes)
      this.object.questions_group_question = this.questions
        .filter((_, index) => selectedQuestions[index])  // Filtrando os selecionados
        .map(question => question.id);  // Mapeando para os IDs das perguntas

      // Enviando para a API
      if (this.object.id) {
        // Atualizando o grupo de perguntas
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
        // Salvando um novo grupo de perguntas
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
