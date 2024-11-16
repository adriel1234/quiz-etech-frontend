import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { SignUpComponent } from './pages/signup/signup.component';
import {UserComponent} from './pages/user/user.component';
import {AuthGuard} from './shared/services/auth-guard.service';
import {QuestionAnswerFormComponent} from './components/question-list/question-answer-form/question-answer-form.component';
import {QuestionListComponent} from './components/question-list/question-list.component';
import {QuestionGroupItemComponent} from './components/question-group-list/question-group-item/question-group-item.component';
import {GroupQuestionListComponent} from './components/question-group-list/group-question-list.component';

export const routes: Routes = [
  {
    path: '',
    component: LoginComponent
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'signup',
    component: SignUpComponent
  },
  {
    path: 'user',
    component: UserComponent,
    // canActivate: [AuthGuard]
  },
  {
    path: 'question/:action',
    component: QuestionAnswerFormComponent,
    // canActivate: [AuthGuard]
  },
  {
    path: 'question',
    component: QuestionListComponent,
    // canActivate: [AuthGuard]
  },
  {
    path: 'question-groups',
    component: GroupQuestionListComponent,
    // canActivate: [AuthGuard]
  },
  {
    path: 'question-groups/:action',
    component: QuestionGroupItemComponent,
    // canActivate: [AuthGuard]
  }
];
