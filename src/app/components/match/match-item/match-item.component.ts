import {Component, OnInit} from '@angular/core';
import { MatButtonModule} from "@angular/material/button";
import { MatFormFieldModule} from "@angular/material/form-field";
import { MatInputModule} from "@angular/material/input";

import { MatSelectModule} from "@angular/material/select";
import {CommonModule} from "@angular/common";

import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {ActivatedRoute} from '@angular/router';
import {QuestionGroup} from '../../../shared/models/question-group.model';
import {Match} from '../../../shared/models/match.model';
import {MatchService} from '../match.service';
import {QuestionGroupService} from '../../../shared/services/question.group.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import {BaseComponent} from '../../base.component';
import {HttpClient} from '@angular/common/http';
import {URLS} from '../../../shared/urls';


interface MatchPayload {
  time_per_question: number;
  description: string;
  question_group: number; // Apenas o ID do grupo
}


@Component({
  selector: 'app-match-item',
  standalone: true,
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    ReactiveFormsModule
  ],
  templateUrl: './match-item.component.html',
  styleUrl: './match-item.component.scss'
})
export class MatchItemComponent extends BaseComponent<Match> implements OnInit{
  protected formGroup!: FormGroup;
  protected questionGroups: QuestionGroup[] = [];
  protected match: Match = {} as Match;
  protected matchId?: number;

  constructor(
    private http: HttpClient,
    private fb: FormBuilder,
    private matchService: MatchService,
    private questionGroupService: QuestionGroupService,
    private snackBar: MatSnackBar,
    private route: ActivatedRoute,
  ) {super(http, URLS.MATCH); // Certifique-se de que a URL está correta
    this.formGroup = this.fb.group({
      description: ['', [Validators.required]],
      questions_group_question: this.fb.array([]), // Inicializando o FormArray
    });
  }

  ngOnInit(): void {
    this.initForm();
    this.loadQuestionGroups();

    const action: string | null = this.route.snapshot.paramMap.get('action');
    const id: string | null = this.route.snapshot.paramMap.get('id');
    if (action === 'create') {
      this.loadQuestionGroups();  // Carregar perguntas para o formulário novo
    } else if (action === 'edit' && id && !isNaN(Number(id))) {
      this.matchId = Number(id);
      this.loadMatchData();  // Carregar dados do QuestionGroup para edição
    } else {
      // this.isFormVisible = false;  // Não exibir o formulário
      console.log('Ação inválida ou ID inválido');
    }
  }

  initForm(): void {
    this.formGroup = this.fb.group({
      timePerQuestion: [null, Validators.required], // Campo no frontend
      description: ['', Validators.required],
      questionGroup: [null, Validators.required], // Deve ser um ID numérico
    });

  }

  loadMatchData(): void {
    this.service.getById(this.matchId!).subscribe({
      next: (data: Match) => {
        console.log('Dados recebidos do serviço:', data);
        this.object = data;
        this.formGroup.patchValue({
          timePerQuestion: data.time_per_question, // Mapeando para o campo correto
          description: data.description,
          questionGroup: data.question_group,     // Mapeando para o campo correto
        });
      },
      error: () => {
        this.snackBar.open('Erro ao carregar a partida', 'Fechar', { duration: 3000 });
      },
    });
  }




  loadQuestionGroups(): void {
    this.questionGroupService.getQuestionGroups().subscribe({
      next: (groups) => (this.questionGroups = groups),
      error: () => this.snackBar.open('Erro ao carregar grupos de perguntas', 'Fechar', { duration: 3000 }),
    });
  }

  saveOrUpdate(): void {
    if (this.formGroup.valid) {
      const formData = this.formGroup.value;

      // Montar o payload no formato esperado pelo backend
      const matchPayload: MatchPayload = {
        time_per_question: formData.timePerQuestion, // Nome esperado pelo backend
        description: formData.description,
        question_group: formData.questionGroup, // Apenas o ID
      };

      console.log('Payload enviado:', matchPayload);

      if (this.match.id) {
        // Atualizar uma partida existente
        this.matchService.update(this.match.id, matchPayload).subscribe({
          next: () => {
            this.snackBar.open('Partida atualizada com sucesso!', 'Fechar', { duration: 3000 });
            this.goToPage('/admin/matches');
          },
          error: (error) => {
            console.error('Erro ao atualizar a partida:', error.error);
            this.snackBar.open('Erro ao atualizar a partida.', 'Fechar', { duration: 3000 });
          },
        });
      } else {
        // Criar uma nova partida
        this.matchService.create(matchPayload).subscribe({
          next: () => {
            this.snackBar.open('Partida criada com sucesso!', 'Fechar', { duration: 3000 });
            this.goToPage('/admin/match');
          },
          error: (error) => {
            console.error('Erro ao criar a partida:', error.error);
            this.snackBar.open('Erro ao criar a partida.', 'Fechar', { duration: 3000 });
          },
        });
      }
    } else {
      this.snackBar.open('Por favor, preencha todos os campos obrigatórios.', 'Fechar', { duration: 3000 });
    }
  }


  cancel(): void {
    this.goToPage('/admin/match');
  }
}

