import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {QuestionGroupService} from '../../shared/services/question.group.service';

@Component({
  selector: 'app-question-group-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './question-group-list.component.html',
  styleUrls: ['./question-group-list.component.scss'],
})
export class QuestionGroupListComponent implements OnInit {
  questionGroups: any[] = [];

  constructor(private questionGroupService: QuestionGroupService) {}

  ngOnInit(): void {
    this.loadQuestionGroups();
  }

  loadQuestionGroups(): void {
    this.questionGroupService.getQuestionGroups().subscribe(
      (data) => (this.questionGroups = data),
      (error) => console.error('Error fetching QuestionGroups', error)
    );
  }
}
