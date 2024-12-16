import { Component,OnInit  } from '@angular/core';
import {MatButton, MatIconButton} from "@angular/material/button";
import {MatIcon} from "@angular/material/icon";
import {NgClass, NgIf} from "@angular/common";
import {ActivatedRoute, NavigationEnd, Router, RouterOutlet} from "@angular/router";
import {
  QuestionAnswerFormComponent
} from '../../components/question-list/question-answer-form/question-answer-form.component';
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
  selector: 'app-admin',
  standalone: true,
  imports: [
    NgClass,
    RouterOutlet,
    QuestionAnswerFormComponent,
    GroupQuestionListComponent,
    QuestionGroupItemComponent,
    MatButton,
    MatIconButton,
    MatIcon,
    NgIf
  ],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.scss'
})
export class AdminComponent implements OnInit {
  public menuList: Menu[] = [
    { title: 'QUIZZ', route: 'question-groups', isCurrent: false },
    { title: 'PERGUNTAS', route: 'question', isCurrent: false },
    { title: 'MATCH', route: 'match', isCurrent: false },
  ];

  constructor(private router: Router, private route: ActivatedRoute) {}

  ngOnInit(): void {
    // Listener para capturar a navegação completa
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.updateMenuState();
      }
    });

    // Inicializa o menu com o estado correto
    this.updateMenuState();
  }

  private updateMenuState(): void {
    const currentRoute = this.router.url.split('?')[0]; // Ignora os parâmetros de consulta (query params)
    this.menuList.forEach((menu) => {
      menu.isCurrent = currentRoute.endsWith(menu.route); // Verifica se a URL termina com a rota do menu
    });
  }

  public changeMenu(menu: Menu): void {
    // Atualiza o estado do menu imediatamente antes da navegação
    this.menuList.forEach((m) => (m.isCurrent = m === menu));

    // Navega para a rota
    this.router.navigate([menu.route], { relativeTo: this.route }).then();
  }

  public isLoggedIn(): boolean {
    return !!sessionStorage.getItem('auth-token');
  }

  public deslogar(): void {
    sessionStorage.clear();
    this.router.navigate(['/login']);
  }

  public trackByRoute(index: number, item: Menu): string {
    return item.route;
  }
}
