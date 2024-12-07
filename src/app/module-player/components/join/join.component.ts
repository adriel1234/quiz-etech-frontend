import { Component, inject } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';
import { TestService } from '../../../shared/services/test.service';
import { QuizResult } from '../../../shared/models/quiz-result.model';

@Component({
  selector: 'app-join',
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
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
    // Verifica se o nome e o código estão preenchidos
    if (!this.name || !this.code) {
      alert('Por favor, insira seu nome e o código do quiz.'); // Feedback para o usuário
      return;
    }

    // Busca o quiz pelo código
    this.testService.getQuizByCode(this.code).subscribe(
      (result) => {
        if (result.length === 0) {
          alert('Código do quiz inválido.'); // Caso o código seja inválido
          return;
        }

        const quiz = result[0];
        const quizResult: QuizResult = {
          name: this.name,
          quizId: quiz.id, // O `quiz.id` já é tratado como string ou deve ser convertido para garantir
          response: [],
        };

        // Realiza o "join" no quiz
        this.testService.joinQuiz(quizResult).subscribe(
          () => {
            this.router.navigateByUrl('/quiz-info');
          },
          (error) => {
            console.error('Erro ao entrar no quiz:', error);
            alert('Não foi possível entrar no quiz. Tente novamente.');
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
