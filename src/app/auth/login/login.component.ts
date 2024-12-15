import { Component } from '@angular/core';
import { FormControl, FormGroup, FormRecord, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoginService } from '../../shared/services/login.service';
import { ToastrService } from 'ngx-toastr';
import {
  DefaultLoginLayoutComponent
} from '../../module-admin/components/default-login-layout/default-login-layout.component';
import {PrimaryInputComponent} from '../../module-admin/components/primary-input/primary-input.component';

interface LoginForm {
  email: FormControl,
  password: FormControl
}

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    DefaultLoginLayoutComponent,
    ReactiveFormsModule,
    PrimaryInputComponent
  ],
  providers: [
    LoginService
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  loginForm!: FormGroup<LoginForm>;

  constructor(
    private router: Router,
    private loginService: LoginService,
    private toastService: ToastrService
  ){
    this.loginForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required, Validators.minLength(6)])
    })
  }

  submit(){
    this.loginService.login(this.loginForm.value.email, this.loginForm.value.password).subscribe({
      next: () => this.toastService.success("Login feito com sucesso!"),
      error: () => this.toastService.error("Erro inesperado! Tente novamente mais tarde")
    })
  }

  navigate(){
    this.router.navigate(["signup"])
  }
}