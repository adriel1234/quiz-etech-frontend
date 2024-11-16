import { Component } from '@angular/core';
import {QuestionAnswerFormComponent} from '../../components/question-list/question-answer-form/question-answer-form.component';
import {NavigationExtras, Router, RouterOutlet} from '@angular/router';
import {NgClass} from '@angular/common';
import { QuestionGroupListComponent } from '../../components/question-group-list/question-group-list.component';
import { QuestionGroupCreateComponent } from '../../components/question-group-create/question-group-create.component';
import {MatButton} from '@angular/material/button';

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
    QuestionGroupListComponent,
    QuestionGroupCreateComponent,
    MatButton
  ],
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss'],
})
export class UserComponent {
  public menuList: Menu[] = [
    { title: 'Criar grupo', route: '/question-groups/create', isCurrent: false },
    { title: 'grupos de perguntas', route: '/question-groups', isCurrent: false },
    { title: 'QUESTÕES', route: '/q1', isCurrent: false },
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
