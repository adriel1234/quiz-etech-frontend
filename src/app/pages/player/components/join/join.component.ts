import { Component, inject } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';
import {FormsModule} from '@angular/forms';
import {TestService} from '../../../../shared/services/test.service';
import {MatchUserName} from '../../../../shared/models/match-user.model';


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

    // Busca o quiz pelo código
    this.testService.getQuizByCode(this.code).subscribe(
      (match) => {
        if (!match || !match.id) {
          alert('Código do quiz inválido.');
          return;
        }

        // Cria o objeto MatchUser com o nome do usuário e o matchId
        const matchUser: MatchUserName = {
          userName: this.name, // Envia o nome do usuário
          userId: undefined,
          match: match, // Dados do quiz retornados pela API
          points: 0,
          rightQuestions: 0,
          wrongQuestions: 0,
        };

        // Registra o usuário no quiz
        this.testService.registerMatchUser(matchUser).subscribe(
          (response) => {
            this.testService.quizResult = response; // Salva o resultado no serviço
            this.router.navigate(['/player/info']);
          },
          (error) => {
            console.error('Erro ao registrar MatchUser:', error);
            alert('Erro ao registrar o usuário no quiz.');
          }
        );
      },
      (error) => {
        console.error('Erro ao buscar o quiz pelo código:', error);
        alert('Erro ao buscar o quiz. Tente novamente.');
      }
    );
  }
}
