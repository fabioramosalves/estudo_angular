import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { ConfigService } from './config.service';
import { AuthResponse } from '../models/interfaces/auth-response';

@Injectable({ providedIn: 'root' })
export class LoginService {
  private readonly tokenKey = 'token';

  constructor(
    private http: HttpClient, 
    private router: Router, 
    private configService: ConfigService
  ) {}

  login(email: string, password: string): Observable<AuthResponse> {
    
    return this.http.post<AuthResponse>(`${this.configService.userApiUrl}/auth/login`, { email, password }).pipe(
      tap(response => {
        localStorage.setItem(this.tokenKey, response.access_token)        
      })
    );
  }

  recover(email: string): Observable<any> {
    return this.http.post<any>(`${this.configService.userApiUrl}/auth/recover`, { email }).pipe(
      tap(response => {
        localStorage.setItem(this.tokenKey, response.access_token)        
      })
    );
  }

  updatePassword(password: string, hash: string): Observable<any> {
    return this.http.post<any>(`${this.configService.userApiUrl}/auth/recover`, { password, hash }).pipe(
      tap(response => {
        localStorage.setItem(this.tokenKey, response.access_token)        
      })
    );
  }

  logout(): void {
    localStorage.removeItem(this.tokenKey);
    this.router.navigate(['/login'])
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem(this.tokenKey);
  }

  isLocalHostEnv(): boolean {
    return window.location.hostname === 'localhost'
  }
}