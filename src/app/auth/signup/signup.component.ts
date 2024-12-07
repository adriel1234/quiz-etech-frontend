import { Component } from '@angular/core';
import { FormControl, FormGroup, FormRecord, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoginService } from '../../shared/services/login.service';
import { ToastrService } from 'ngx-toastr';
import {
  DefaultLoginLayoutComponent
} from '../../module-admin/components/default-login-layout/default-login-layout.component';
import {PrimaryInputComponent} from '../../module-admin/components/primary-input/primary-input.component';

interface SignupForm {
  name: FormControl,
  email: FormControl,
  password: FormControl,
  passwordConfirm: FormControl
}

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [
    DefaultLoginLayoutComponent,
    ReactiveFormsModule,
    PrimaryInputComponent
  ],
  providers: [
    LoginService
  ],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.scss'
})
export class SignUpComponent {
  signupForm!: FormGroup<SignupForm>;

  constructor(
    private router: Router,
    private loginService: LoginService,
    private toastService: ToastrService
  ){
    this.signupForm = new FormGroup({
      name: new FormControl('', [Validators.required, Validators.minLength(3)]),
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required, Validators.minLength(6)]),
      passwordConfirm: new FormControl('', [Validators.required, Validators.minLength(6)]),
    })
  }

  submit() {
    if (this.signupForm.value.password !== this.signupForm.value.passwordConfirm) {
      this.toastService.error("Passwords do not match!");
      return;
    }

    this.loginService.signup(
      this.signupForm.value.name,
      this.signupForm.value.email,
      this.signupForm.value.password
    ).subscribe({
      next: () => this.toastService.success("Registration successful!"),
      error: () => this.toastService.error("Unexpected error! Please try again later.")
    });
  }

  navigate(){
    this.router.navigate(["login"])
  }
}
