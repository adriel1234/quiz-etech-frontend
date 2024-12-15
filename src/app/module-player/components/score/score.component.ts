import { Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule, JsonPipe } from '@angular/common';
import {BaseService} from '../../../shared/services/base.service';
import {QuizResult} from '../../../shared/models/quiz-result';

@Component({
  selector: 'app-score',
  standalone: true,
  imports: [
    JsonPipe,
    CommonModule
  ],
  templateUrl: './score.component.html',
  styleUrls: ['./score.component.scss'] // Corrigido para plural
})
export class ScoreComponent implements OnInit {
    ngOnInit(): void {
        throw new Error('Method not implemented.');
    }

}
