import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LoginResponse } from '../../types/login-response.type';
import {catchError, tap, throwError} from 'rxjs';
import {Router} from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  apiUrl: string= "http://localhost:8000/api/token/"

  constructor(private httpClient: HttpClient,private router: Router) { }

  login(username: string, password: string){
    return this.httpClient.post<LoginResponse>(this.apiUrl, { username, password }).pipe(
      tap((value) => {
        sessionStorage.setItem("auth-token", value.access);
        sessionStorage.setItem("refresh-token", value.refresh);
        this.router.navigate(['/user']);
      }),
      catchError((error) => {
        console.error("Login error:", error.error); // Mostra detalhes do erro
        return throwError(error);
      })
    );
  }


  signup(name:string, email: string, password: string){
    return this.httpClient.post<LoginResponse>(this.apiUrl+"register/", { name,email, password }).pipe(
      tap((value:LoginResponse) => {
        sessionStorage.setItem("auth-token", value.token)
        sessionStorage.setItem("username", value.name)
      })
    )
  }
}
