import { Component } from '@angular/core';
import {QuestionAnswerFormComponent} from '../../components/question-list/question-answer-form/question-answer-form.component';
import {NavigationExtras, Router, RouterOutlet} from '@angular/router';
import {NgClass} from '@angular/common';


import {MatButton} from '@angular/material/button';
import {GroupQuestionListComponent} from '../../components/question-group-list/group-question-list.component';
import {
  QuestionGroupItemComponent
} from '../../components/question-group-list/question-group-item/question-group-item.component';

interface Menu {
  title: string;
  route: string;
  isCurrent: boolean;
}

@Component({
  selector: 'app-user',
  standalone: true,
  imports: [
    NgClass,
    RouterOutlet,
    QuestionAnswerFormComponent,
    GroupQuestionListComponent,
    QuestionGroupItemComponent,
    MatButton
  ],
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss'],
})
export class UserComponent {
  public menuList: Menu[] = [
    { title: 'GRUPO DE PERGUNTAS', route: '/question-groups', isCurrent: false },
    { title: 'QUESTÕES', route: '/question', isCurrent: false },
  ];

  constructor(private router: Router) {
    this.changeMenu(this.menuList[0]); // Define o primeiro menu como ativo
  }

  public changeMenu(menu: Menu): void {
    this.menuList.forEach((m) => (m.isCurrent = m.route === menu.route));
    this.goToPage(menu.route);
  }

  public goToPage(route: string): void {
    this.router.navigate([route]).then();
  }
}
