import { Component } from '@angular/core';
import {QuestionGroup} from '../../shared/models/question-group.model';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {Match} from '../../shared/models/match.model';
import {QuestionGroupService} from '../../shared/services/question.group.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import {MatchService} from './match.service';
import {CommonModule} from '@angular/common';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatSelectModule} from '@angular/material/select';
import {MatButtonModule} from '@angular/material/button';
import {NavigationExtras, Router} from '@angular/router';

interface MatchPayload {
  time_per_question: number;
  description: string;
  question_group: number; // Apenas o ID do grupo
}

@Component({
  selector: 'app-match',
  standalone: true,
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    ReactiveFormsModule
  ],
  templateUrl: './match.component.html',
  styleUrl: './match.component.scss'
})
export class MatchComponent { formGroup!: FormGroup;
  private router: Router = new Router();
  questionGroups: QuestionGroup[] = [];
  match: Match = {} as Match;

  constructor(
    private fb: FormBuilder,
    private matchService: MatchService,
    private questionGroupService: QuestionGroupService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.loadQuestionGroups();
  }

  initForm(): void {
    this.formGroup = this.fb.group({
      timePerQuestion: [null, Validators.required], // Campo no frontend
      description: ['', Validators.required],
      questionGroup: [null, Validators.required], // Deve ser um ID numérico
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
            this.goToPage('/admin/matches');
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

  public goToPage(route: string): void {
    const extras: NavigationExtras = {queryParamsHandling: 'merge'};
    this.router.navigate([route], extras).then();
  }

  cancel(): void {
    // Adicione a lógica de cancelamento, se necessário
  }
}
