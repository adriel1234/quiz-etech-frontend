import { Component, inject } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';
import {TestService} from '../../../services/test.service';
import {QuizResult} from '../../../shared/models/quiz-result';
import {FormsModule} from '@angular/forms';
import {MatchUser} from '../../../shared/models/match-user.model';
import {Match} from '../../../shared/models/match.model';

@Component({
  selector: 'app-join',
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    FormsModule,
  ],
  templateUrl: './join.component.html',
  styleUrls: ['./join.component.scss'], // Corrigido: "styleUrl" para "styleUrls" e array
})
export class JoinComponent {
  name!: string;
  code!: string;
  testService = inject(TestService);
  router = inject(Router);

  join() {
    if (!this.name || !this.code) {
      alert('Por favor, insira seu nome e o código do quiz.');
      return;
    }

    this.testService.getQuizByCode(this.code).subscribe(
      (match) => {
        if (!match || !match.id) {
          alert('Código do quiz inválido.');
          return;
        }

        // Get a valid userId (replace with your actual logic for fetching the user ID)
        const userId = 1;  // Implement this function to get the logged-in user ID

        const matchUser: {
          wrongQuestions: number;
          rightQuestions: number;
          match: Match;
          userId: number;  // Use a valid userId here
          points: number;
        } = {
          userId: userId,
          match: match,
          points: 0,
          rightQuestions: 0,
          wrongQuestions: 0,
        };

        this.testService.registerMatchUser(matchUser).subscribe(
          () => {
            alert('Usuário cadastrado no quiz com sucesso!');
            this.router.navigate(['/player/quiz/', match.id]); // Redirecionar para perguntas
            console.log('Navigating to:', '/player/quiz/', match.id);
          },
          (error) => {
            console.error('Erro ao cadastrar o usuário no quiz:', error);
            alert('Não foi possível cadastrar o usuário no quiz. Tente novamente.');
          }
        );
      },
      (error) => {
        console.error('Erro ao buscar o quiz pelo código:', error);
        alert('Houve um erro ao buscar o quiz. Tente novamente mais tarde.');
      }
    );
  }

}
