import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { SignUpComponent } from './pages/signup/signup.component';
import {UserComponent} from './pages/user/user.component';
import {AuthGuard} from './shared/services/auth-guard.service';
import {QuestionAnswerFormComponent} from './components/question-list/question-answer-form/question-answer-form.component';
import {QuestionGroupListComponent} from './components/question-group-list/question-group-list.component';
import {QuestionGroupCreateComponent} from './components/question-group-create/question-group-create.component';
import {QuestionListComponent} from './components/question-list/question-list.component';

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
    path: 'question',
    component: QuestionAnswerFormComponent,
    // canActivate: [AuthGuard]
  },
  {
    path: 'q1',
    component: QuestionListComponent,
    // canActivate: [AuthGuard]
  },
  {
    path: 'question-groups',
    component: QuestionGroupListComponent,
    // canActivate: [AuthGuard]
  },
  {
    path: 'question-groups/create',
    component: QuestionGroupCreateComponent,
    // canActivate: [AuthGuard]
  }
];
