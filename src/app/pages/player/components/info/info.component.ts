import {Component, inject} from '@angular/core';
import {Router} from '@angular/router';
import {MatButton} from '@angular/material/button';
import {MatFormField, MatLabel} from '@angular/material/form-field';
import {MatInput} from '@angular/material/input';
import {MatButtonModule} from '@angular/material/button';
import {NgIf} from '@angular/common';
import {TestService} from '../../../../shared/services/test.service';
import {MatchUser} from '../../../../shared/models/match-user.model';

@Component({
  selector: 'app-info',
  standalone: true,
  imports: [
    MatButton,
    MatFormField,
    MatInput,
    MatLabel,
    MatButtonModule,
    NgIf
  ],
  templateUrl: './info.component.html',
  styleUrl: './info.component.scss'
})
export class InfoComponent {
  testService = inject(TestService);
  quizInfo?: MatchUser; // Agora opcional, para verificar se foi inicializado
  userName?: string;
  constructor(
    private router: Router  // Adicionando o Router no construtor
  ) {}

  ngOnInit() {
    // Verifique se `quizResult` está definido
    if (!this.testService.quizResult) {
      console.error('quizResult está indefinido. Certifique-se de que foi atribuído antes de acessar este componente.');
      return;
    }

    // Acesse o quizResult armazenado no serviço
    this.quizInfo = this.testService.quizResult;
    console.log("quiz")
    console.log(this.quizInfo)
    const userId = this.quizInfo.user;
    if (userId) {
      this.testService.getUserById(userId).subscribe(
        (user) => {
          this.userName = user.username;  // Armazene o nome do usuário
          console.log("Nome do usuário:", this.userName);  // Exiba o nome do usuário
        },
        (error) => {
          console.error('Erro ao buscar o nome do usuário:', error);
        }
      );
    } else {
      console.error('userId não encontrado no quizResult.');
    }

    if (this.quizInfo?.match) {
      // Busque os detalhes do match
      this.testService.getMatchByCode(this.quizInfo.match).subscribe(
        (match) => {
          this.testService.matchDetails = match; // Salva os dados retornados
          console.log('Detalhes do Match:', this.testService.matchDetails); // Verifica no console os dados
        },
        (error) => {
          console.error('Erro ao buscar os detalhes do match:', error);
        }
      );
    } else {
      console.error('Match ID não está definido em quizInfo.');
    }
  }

  start() {

    this.router.navigate(['/player/quiz']);
  }
}
