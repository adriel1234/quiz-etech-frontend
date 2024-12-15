import { Component, OnInit, inject } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import {ActivatedRoute, Router} from '@angular/router';
import { MatRadioModule } from '@angular/material/radio';
import {TestService} from '../../../services/test.service';
import {QuizService} from './quiz.service';
import {FormsModule} from '@angular/forms';
import {NgForOf, NgIf} from '@angular/common';
import {QuestionService} from '../../../shared/services/question.service';
import {MatchUser, MatchUserTest} from '../../../shared/models/match-user.model';
import {Option} from '../../../shared/models/option.model';
import {Question} from '../../../shared/models/question.model';


@Component({
  selector: 'app-match',
  standalone: true,
  imports: [
    MatButton,
    MatFormField,
    MatInput,
    MatLabel,
    MatRadioModule,
    FormsModule,
    NgForOf,
    NgIf,
  ],
  templateUrl: './match.component.html',
  styleUrls: ['./match.component.scss'] // Corrigido: estilo é um array
})
export class MatchComponent implements OnInit {
  testService = inject(TestService);
  router = inject(Router);
  quizResult!: MatchUser;
  quiz!: MatchUserTest;
  quizData: any;
  match: number = 0;
  questions: Question[] = [];
  currentQuestionIndex = 0; // Começa pela primeira pergunta
  currentQuestionNo: number = 0;
  currentSelectionOptionId: number = 0;
  selectedOptions: { [questionId: number]: string | null } = {}; // Respostas do usuário

  constructor(
    private quizService: QuizService,
  ) {
  }

  ngOnInit(): void {
    console.log("match");
    this.quizResult = this.testService.quizResult;

    // Acessando os detalhes do match
    this.quizData = this.testService.matchDetails;

    const questionGroupId = this.testService.matchDetails.question_group;
    console.log(this.quizData);  // Exibe todos os dados do match
    console.log(questionGroupId);  // Exibe o valor de 'question_group'

    // Busca todas as questões pelo grupo
    this.quizService.getQuestionsByGroup(questionGroupId).subscribe((questions) => {
      this.questions = questions;
      console.log("tamanho questions", questions.length);
      console.log('Questions fetched:', this.questions);
    });
  }

  get currentQuestion() {
    return this.questions[this.currentQuestionNo];
  }

  updateSelectedOption(questionId: number, optionId: number): void {
    if (optionId !== null) {
      this.selectedOptions[questionId] = this.currentSelectedOptionId;
      console.log("updateSelectedOption")
      console.log(this.selectedOptions);

    }
  }

  currentSelectedOptionId: any = false;


  next(): void {
    this.updateSelectedOption(this.currentQuestionNo, this.currentSelectionOptionId)
    console.log("lentgh", this.questions.length);
    console.log("currentQuestion", this.currentQuestionNo);
    console.log(this.currentQuestion)
    console.log("currentSelectionOptionId", this.currentSelectionOptionId);

    if (this.currentQuestionIndex < this.questions.length - 1) {
      // Avança para a próxima pergunta
      this.currentQuestionIndex++;

    } else {
      console.log('Fim do quiz. Respostas:', this.selectedOptions);
      // Aqui você pode salvar as respostas finais ou exibir um resumo
    }

    this.currentQuestionNo++
  }

  onDescriptionChange(option: any) {
    const updatedOption = {...option, description: this.currentSelectionOptionId};
    // Update the data source with the updated option
  }

  // Função para registrar a opção selecionada
  onOptionSelected(questionId: number, optionId: number): void {
    console.log(`Questão ID: ${questionId}, Opção Selecionada: ${optionId}`);

    // Atualiza a seleção para a questão correspondente
    this.selectedOptions[questionId] = this.currentSelectedOptionId;
    console.log('Opções selecionadas:', this.selectedOptions);
  }

  submit() {
    this.calculateResult()
    this.router.navigateByUrl("player/score")

  }

  calculateResult() {
    let points = 0; // Inicializa os pontos
    let rightQuestions = 0; // Inicializa as questões corretas
    let wrongQuestions = 0; // Inicializa as questões incorretas
    let id = 0

    // Itera sobre as questões e verifica as respostas
    this.questions.forEach((question: any) => {
      // Obtemos a descrição da opção selecionada pelo usuário diretamente do objeto `selectedOptions`
      const selectedOptionDescription = this.selectedOptions[id]; // Resposta do usuário
      // Encontramos a opção correta da questão
      const correctOption = question.options.find((option: any) => option.correct === true); // Opção correta
      id++;
      // Logs para depuração
      console.log("Questão:", question.description);
      console.log("Selecionada (descrição):", selectedOptionDescription);
      console.log("Correta (descrição):", correctOption?.description);

      // Verificação se a descrição da resposta selecionada é igual à da resposta correta
      if (correctOption && selectedOptionDescription === correctOption.description) {
        rightQuestions++;
        points += question.points || 1;
      } else {
        wrongQuestions++;
      }
    });

    // Atualiza o resultado no objeto `quizResult`
    this.quizResult.points = points;
    this.quizResult.rightQuestions = rightQuestions;
    this.quizResult.wrongQuestions = wrongQuestions;

    // Logs finais do resultado
    console.log("Resultado calculado:");
    console.log("Pontos:", points);
    console.log("Questões corretas:", rightQuestions);
    console.log("Questões incorretas:", wrongQuestions);
  }
}
