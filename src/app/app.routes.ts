import { Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { SignUpComponent } from './auth/signup/signup.component';
import { AuthGuard } from './shared/services/auth-guard.service';
import { AdminComponent } from './module-admin/admin/admin.component';
import { PlayerComponent } from './module-player/player/player.component';
import { QuestionListComponent } from './module-admin/components/question-list/question-list.component';
import {
  QuestionAnswerFormComponent,
} from './module-admin/components/question-list/question-answer-form/question-answer-form.component';
import { GroupQuestionListComponent } from './module-admin/components/question-group-list/group-question-list.component';
import {
  QuestionGroupItemComponent,
} from './module-admin/components/question-group-list/question-group-item/question-group-item.component';
import { JoinComponent } from './module-player/components/join/join.component';
import { InfoComponent } from './module-player/components/info/info.component';
import { MatchComponent } from './module-player/components/match/match.component';
import { ScoreComponent } from './module-player/components/score/score.component';

export const routes: Routes = [
  {
    path: '',
    component: LoginComponent,
  },
  {
    path: 'signup',
    component: SignUpComponent,
  },
  {
    path: 'player',
    component: PlayerComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: '',
        redirectTo: 'join',
        pathMatch: 'full',
      },
      {
        path: 'join',
        component: JoinComponent,
        data: { title: 'Autenticação' },
      },
      {
        path: 'info',
        component: InfoComponent,
        data: { title: 'Sala de Espera' },
      },
      {
        path: 'match',
        component: MatchComponent,
        data: { title: 'Respostas' },
      },
      {
        path: 'score',
        component: ScoreComponent,
        data: { title: 'Total de respostas certas' },
      },
    ],
  },
  {
    path: 'admin',
    component: AdminComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: '',
        redirectTo: 'question',
        pathMatch: 'full',
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
        path: 'question-groups/edit/:id',
        component: QuestionGroupItemComponent,
        data: { title: 'Editar Quizz' },
      },
    ],
  },
];
