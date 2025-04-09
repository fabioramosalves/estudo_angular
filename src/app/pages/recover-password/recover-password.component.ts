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
  selector: 'app-recover-password',
  templateUrl: './recover-password.component.html',
  styleUrls: ['./recover-password.component.css'],
  standalone: true,
  imports: [
    ReactiveFormsModule,
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
export class RecoverPasswordComponent {
  recuperarForm: FormGroup;
  errorMessage: string = '';
  hidePassword = true;
  isLoading = false;
  emailSent = false;

  constructor(
    private fb: FormBuilder,
    private loginService: LoginService,
    private router: Router,
    private translate: TranslateService,
    private alertService: AlertService
  ) {
    this.recuperarForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  onBackToLogin() {
    this.router.navigate(['/login'])
  }

  resetForm() {
    this.recuperarForm.reset();
    this.emailSent = false;
  }

  onSubmit() {

    if (this.recuperarForm.invalid) return;

    this.isLoading = true;

    const { email } = this.recuperarForm.value;

    this.loginService.recover(email).subscribe({
      next: () => {
        this.alertService.showAlert('Senha redefinida com sucesso!', 'success')
        this.emailSent = true;
        this.isLoading = false;
      },
      error: () => this.alertService.showAlert('Erro ao redefinir a senha.', 'error')
    });
  }

}