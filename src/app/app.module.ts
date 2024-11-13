import { NgModule } from '@angular/core';
import { BrowserModule, provideClientHydration } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import {provideHttpClient} from '@angular/common/http';
import { HomeComponent } from './pages/home/home.component';
import { QuizzComponent } from './components/quizz/quizz.component';
import { QuizzItemComponent } from './components/quizz/quizz-item/quizz-item.component';
import { QuestionListComponent } from './components/question-list/question-list.component';
import { LoginComponent } from './pages/login/login.component';
import { DefaultLoginLayoutComponent } from './components/default-login-layout/default-login-layout.component';
import { PrimaryInputComponent } from './components/primary-input/primary-input.component';
import { RouterModule } from '@angular/router';
import { ToastrModule } from 'ngx-toastr';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {SignUpComponent} from './pages/signup/signup.component'; // Necessário para animações do Toastr

// Se você tiver um módulo de rotas

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    QuizzComponent,
    QuizzItemComponent,
    QuestionListComponent,
    LoginComponent,
    DefaultLoginLayoutComponent,
    PrimaryInputComponent,
    SignUpComponent

  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    ToastrModule.forRoot(),
    RouterModule,
  ],
  providers: [
    provideClientHydration(),
    provideHttpClient(),
  ],
  bootstrap: [LoginComponent]
})
export class AppModule { }
