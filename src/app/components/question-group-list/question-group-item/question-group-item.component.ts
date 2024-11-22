import { Component, OnInit } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { ActivatedRoute } from '@angular/router';
import { QuestionService } from '../../../shared/services/question.service';
import { CommonModule } from '@angular/common';
import { MatCheckboxModule } from '@angular/material/checkbox';
import {MatListOption, MatSelectionList } from '@angular/material/list';
import {MatCard, MatCardContent, MatCardHeader, MatCardTitle} from '@angular/material/card';
import {FlexLayoutModule} from '@ngbracket/ngx-layout';
import {GroupQuestionService} from '../group-question-service';
import { Validators, FormGroup, NonNullableFormBuilder, UntypedFormArray, FormsModule } from '@angular/forms';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { QuestionGroup } from '../../../shared/models/question-group'; 

@Component({
  selector: 'app-question-group-item',
  standalone: true,
  imports: [
    CommonModule,
    MatFormFieldModule,
    FormsModule,
    MatInputModule,
    MatButtonModule,
    MatCheckboxModule,
    MatCardContent,
    MatCardTitle,
    MatCardHeader,
    MatCard,
    MatSelectionList,
    MatListOption,
    FlexLayoutModule,
    MatSnackBarModule
  ],
  templateUrl: './question-group-item.component.html',
  styleUrl: './question-group-item.component.scss'
})


export class QuestionGroupItemComponent implements OnInit {
  form!: FormGroup;
  action: string = '';
  groupQuestion: any = { description: '', questions: [] };
  questions: any[] = [];
  selectedQuestions: { [key: number]: boolean } = {};

  constructor(
    private formBuilder: NonNullableFormBuilder,  // Corrigido: NonNullableFormBuilder
    private route: ActivatedRoute,
    private questionService: QuestionService,
    private groupQuestionService: GroupQuestionService,
    private snackBar: MatSnackBar
    
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.action = params['action'];
      if (this.action === 'edit') {
        const groupId = params['id'];
        this.groupQuestionService.getGroupQuestion(groupId).subscribe((group: QuestionGroup) => {
          this.groupQuestion = group;
          console.log('Grupo de perguntas carregado: ', this.groupQuestion); // Verifique se as perguntas estão aqui
          this.initForm();  // Inicializa o formulário com as perguntas carregadas
        });
      } else {
        this.initForm();  // Para a criação, começa com um formulário vazio
      }
    });
  
    // Carregar a lista de perguntas
    this.questionService.getQuestions().subscribe(questions => {
      this.questions = questions;
      console.log('Perguntas carregadas: ', this.questions);
  
      // Inicializa o estado de seleção
      this.questions.forEach(question => {
        this.selectedQuestions[question.id] = false; // Marcar como não selecionada inicialmente
      });
    });
  }

  // Inicializa o formulário
  initForm() {
    // Cria o formulário com descrição e as perguntas selecionadas
    this.form = this.formBuilder.group({
      description: [this.groupQuestion.description, [Validators.required, Validators.maxLength(255)]],
      questions: this.formBuilder.array(this.retrieveSelectedQuestions()) // Ajuste aqui
    });
  }
  
  // Recupera as perguntas selecionadas para incluir no FormArray
  private retrieveSelectedQuestions(): any[] {
    const selectedQuestionsIds: any[] = [];
    
    this.questions.forEach(question => {
      if (this.selectedQuestions[question.id]) {
        selectedQuestionsIds.push(question.id);  // Adiciona apenas o ID
      }
    });
    
    return selectedQuestionsIds;  // Retorna apenas os IDs
  }
  // Recupera as perguntas do grupo
  private retrieveQuestions(questions: any[] = []): FormGroup[] {
    const questionsFormArray: FormGroup[] = [];
    if (questions.length > 0) {
      questions.forEach(question => {
        questionsFormArray.push(this.createQuestion(question));
      });
    } else {
      // Adicione perguntas vazias ou com valores padrão (se necessário)
      questionsFormArray.push(this.createQuestion({ id: null, description: '', selected: false }));
    }
    return questionsFormArray;
  }

  // Cria um grupo de pergunta no formulário
  private createQuestion(question: any = { id: '', description: '', selected: false }) {
    return this.formBuilder.group({
      id: [question.id],
      description: [question.description, [Validators.required, Validators.maxLength(255)]],
      selected: [question.selected]
    });
  }

  // Obtém o FormArray de perguntas
  getQuestionsFormArray() {
    return (<UntypedFormArray>this.form.get('questions')).controls;
  }

  // Adiciona uma nova pergunta
  addNewQuestion() {
    const questions = this.form.get('questions') as UntypedFormArray;
    questions.push(this.createQuestion());
  }

  // Remove uma pergunta do formulário
  removeQuestion(index: number) {
    const questions = this.form.get('questions') as UntypedFormArray;
    questions.removeAt(index);
  }

  // Método de submissão
  save() {
    console.log('Formulário:', this.form.value);  // Verifique o conteúdo do formulário
  
    if (this.form.valid) {
      if (this.action === 'edit') {
        this.groupQuestionService.updateGroupQuestion(this.groupQuestion.id, this.form.value).subscribe(
          response => this.onSuccess(),
          error => this.onError()
        );
      } else {
        this.groupQuestionService.createGroupQuestion(this.form.value).subscribe(
          response => this.onSuccess(),
          error => this.onError()
        );
      }
    } else {
      this.snackBar.open('Por favor, preencha todos os campos obrigatórios!', '', { duration: 5000 });
    }
  }

  // Caso de sucesso
  private onSuccess() {
    this.snackBar.open('Grupo de perguntas salvo com sucesso!', '', { duration: 5000 });
  }

  // Caso de erro
  private onError() {
    this.snackBar.open('Erro ao salvar o grupo de perguntas.', '', { duration: 5000 });
  }

  // Método de cancelamento
  close() {
    console.log('Formulário cancelado');
  }
}