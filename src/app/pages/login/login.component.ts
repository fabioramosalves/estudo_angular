import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { LoginService } from '../../services/login.service';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { LoadingOverlayComponent } from '../../components/loading/loading.component';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { AlertService } from '../../services/alert.service';
import { AlertComponent } from '../../components/alert/alert.component';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  standalone: true,
  imports: [ReactiveFormsModule,
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatFormFieldModule,
    MatCardModule,
    MatSnackBarModule,
    LoadingOverlayComponent,
    TranslateModule,
    AlertComponent
  ]
})
export class LoginComponent {
  loginForm: FormGroup;
  errorMessage: string = '';
  hidePassword = true;
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private loginService: LoginService,
    private router: Router,
    private translate: TranslateService,
    private alertService: AlertService
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  onForgotPassword() {
    this.router.navigate(['/recover-password']);
  }

  onSubmit() {

    if (this.loginForm.invalid) return;

    this.isLoading = true;
    
    const { email, password } = this.loginForm.value;

    this.loginService.login(email, password).subscribe(response => {
      
      if (response.access_token) {
        localStorage.setItem('token', response.access_token)
        this.router.navigate(['/dashboard'])
      } else {
        this.alertService.showAlert(this.translate.instant('LOGIN.ERROR_MESSAGE'), 'error');
        this.isLoading = false
        return
      }
    }, error => {
      this.alertService.showAlert(this.translate.instant('LOGIN.CACHE_ERROR_MESSAGE'), 'error');
      this.isLoading = false
      return
    });
  }
}