import {Routes} from '@angular/router';
import {LoginComponent} from './pages/login/login.component';
import {SignUpComponent} from './pages/signup/signup.component';
// import {UserComponent} from './pages/user/user.component';
import {AuthGuard} from './shared/services/auth-guard.service';
import {
  QuestionAnswerFormComponent
} from './components/question-list/question-answer-form/question-answer-form.component';
import {QuestionListComponent} from './components/question-list/question-list.component';
import {
  QuestionGroupItemComponent
} from './components/question-group-list/question-group-item/question-group-item.component';
import {GroupQuestionListComponent} from './components/question-group-list/group-question-list.component';
import {AdminComponent} from './pages/admin/admin.component';
import {MatchComponent} from './components/match/match.component';
import {MatchItemComponent} from './components/match/match-item/match-item.component';

export const routes: Routes = [
  {
    path: '',
    component: LoginComponent
  },
  {
    path: 'login',
    component: LoginComponent,
    data: { title: 'Login Page' },
  },
  {
    path: 'signup',
    component: SignUpComponent,
    data: { title: 'Login Page' },
  },
  {
    path: 'admin',
    component: AdminComponent,
    data: { title: 'Admin' },
    canActivate: [AuthGuard],
    children: [
      {
        path: '',
        redirectTo: 'question',
        pathMatch: 'full'
      },
      {
        path: 'question',
        component: QuestionListComponent,
        data: { title: 'Perguntas' },
      },
      {
        path: 'question/:action',
        component: QuestionAnswerFormComponent,
        data: { title: 'Cadastrar Pergunta' },
      },
      {
        path: 'question/edit/:id',
        component: QuestionAnswerFormComponent,
        data: { title: 'Editar Pergunta' },
      },
      {
        path: 'question-groups',
        component: GroupQuestionListComponent,
        data: { title: 'Quizz' },
      },
      {
        path: 'question-groups/:action',
        component: QuestionGroupItemComponent,
        data: { title: 'Cadastrar Quizz' },
      },
      {
        path: 'question-groups/:action/:id',
        component: QuestionGroupItemComponent,
        data: { title: 'Editar Quizz' },
      },
      {
        path: 'match',
        component: MatchComponent,
        data: { title: 'Match Quizz' },
      }
      ,
      {
        path: 'match/:action',
        component: MatchItemComponent,
        data: { title: 'Match Criar' },
      },
      {
        path: 'match/:action/:id',
        component: MatchItemComponent,
        data: { title: 'Editar Match' },
      },

    ]
  }
];
