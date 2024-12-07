import { Component, OnInit } from '@angular/core';
import { NgForOf, NgIf } from '@angular/common';

@Component({
  selector: 'app-player',
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.scss'],
  imports: [
    NgIf,
    NgForOf
  ],
  standalone: true
})
export class PlayerComponent implements OnInit {
  questions = [
    {
      question: 'Qual é a capital do Brasil?',
      options: ['São Paulo', 'Rio de Janeiro', 'Brasília', 'Salvador'],
      correctAnswer: 'Brasília',
    },
    {
      question: 'Qual é o maior planeta do sistema solar?',
      options: ['Terra', 'Júpiter', 'Marte', 'Saturno'],
      correctAnswer: 'Júpiter',
    },
  ];

  currentQuestionIndex = 0;
  currentQuestion: any = null;
  selectedOption: string | null = null;
  feedback: string | null = null;

  ngOnInit() {
    this.loadQuestion();
  }

  loadQuestion() {
    this.currentQuestion = this.questions[this.currentQuestionIndex] || null;
    this.selectedOption = null;
    this.feedback = null;
  }

  selectOption(option: string) {
    this.selectedOption = option;
  }

  submitAnswer() {
    if (!this.selectedOption) return;

    this.feedback =
      this.selectedOption === this.currentQuestion.correctAnswer
        ? 'Resposta correta!'
        : 'Resposta errada!';

    setTimeout(() => {
      this.nextQuestion();
    }, 2000);
  }

  nextQuestion() {
    this.currentQuestionIndex++;
    if (this.currentQuestionIndex < this.questions.length) {
      this.loadQuestion();
    } else {
      this.feedback = 'Você concluiu o quiz!';
      this.currentQuestion = null;
    }
  }
}
