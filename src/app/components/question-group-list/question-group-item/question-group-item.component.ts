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
import { QuestionGroup } from '../../../shared/models/question-group.model';

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
  groupQuestion: QuestionGroup = {} as QuestionGroup;
  questions: any[] = [];
  selectedQuestions: { [key: number]: boolean } = {};

  constructor(
    private formBuilder: NonNullableFormBuilder,
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
          console.log('Grupo de perguntas carregado para edição:', group);
          this.groupQuestion = group;
          this.initForm();  // Inicializa o formulário com as perguntas carregadas
        });
      } else {
        this.initForm();  // Para a criação, começa com um formulário vazio
      }
    });
  }
  // Inicializa o formulário
  initForm() {
    this.form = this.formBuilder.group({
      description: [this.groupQuestion.description || '', [Validators.required, Validators.maxLength(255)]],
      questions: this.formBuilder.array(this.retrieveSelectedQuestions()) // Ajuste aqui
    });
  }

  // Recupera as perguntas selecionadas para incluir no FormArray
  private retrieveSelectedQuestions(): any[] {
    const selectedQuestionsIds: any[] = [];
    this.questions.forEach(question => {
      if (this.selectedQuestions[question.id]) {
        selectedQuestionsIds.push(question.id);  // Apenas IDs
      }
    });
    return selectedQuestionsIds;  // Retorna apenas os IDs selecionados
  }

  // Método que prepara e envia os dados para o backend
save() {
  // Garantir que a descrição não esteja vazia
  const description = this.form.get('description')?.value.trim();
  
  // Se a descrição estiver vazia, mostrar um alerta e impedir o envio
  if (!description) {
    this.snackBar.open('Descrição é obrigatória', '', { duration: 5000 });
    return;
  }

  // Garantir que o id esteja definido corretamente (null se for um novo grupo)
  const id = this.groupQuestion.id || null;  // Se não houver id, considera null para criação

  // Recupera as perguntas selecionadas
  const selectedQuestions = this.questions.filter((question) => this.selectedQuestions[question.id]);

  const requestData: QuestionGroup = {
    id: id,  // Se estiver criando, id será null, caso contrário, usa o id existente
    description: description,  // Usar o valor do formulário
    questionsGroupQuestion: selectedQuestions,  // Passar as perguntas selecionadas
    createdAt: this.groupQuestion.createdAt || new Date(),  // Usar data de criação, ou nova data
    modifiedAt: new Date(),  // Definir a data de modificação como agora
  };

  console.log('Request Data:', requestData);  // Verifique os dados antes de enviar

  // Enviar os dados para o backend
  if (this.action === 'edit') {
    this.groupQuestionService.updateGroupQuestion(this.groupQuestion.id, requestData).subscribe(
      response => this.onSuccess(),
      error => this.onError(error)
    );
  } else {
    this.groupQuestionService.createGroupQuestion(requestData).subscribe(
      response => this.onSuccess(),
      error => this.onError(error)
    );
  }
}
  private onSuccess() {
    this.snackBar.open('Grupo de perguntas salvo com sucesso!', '', { duration: 5000 });
  }

  private onError(error: any) {
    this.snackBar.open('Erro ao salvar o grupo de perguntas.', '', { duration: 5000 });
  }

  // Método de cancelamento
  close() {
    console.log('Formulário cancelado');
  }
}