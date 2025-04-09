import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { LoginService } from '../../services/login.service';
import { CommonModule } from '@angular/common';
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
  selector: 'app-reset-password',
  standalone: true,
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css'],
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
export class ResetPasswordComponent implements OnInit {
  redefinirSenhaForm: FormGroup;
  hash: string = '';
  passwordStrength: number = 0;
  isLoading = false;
  
  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private loginService: LoginService,
    private translate: TranslateService,
    private router: Router,
    private alertService: AlertService
  ) {
    this.redefinirSenhaForm = this.fb.group({
      password: ['', [Validators.required, Validators.minLength(8)]],
      passwordConfirm: ['', [Validators.required]]
    });
  }

  ngOnInit() {
    this.hash = this.route.snapshot.paramMap.get('hash') || '';
  }

  onBackToLogin() {
    this.router.navigate(['/login'])
  }

  verificarForcaSenha() {
    const password = this.redefinirSenhaForm.get('password')?.value || '';
    let forca = 0;

    if (password.length >= 8) forca += 1;
    if (/[A-Z]/.test(password)) forca += 1;
    if (/[a-z]/.test(password)) forca += 1;
    if (/[0-9]/.test(password)) forca += 1;
    if (/[\W]/.test(password)) forca += 1;

    this.passwordStrength = forca;
  }

  redefinirSenha() {
    if (this.redefinirSenhaForm.valid) {
      const { password, passwordConfirm } = this.redefinirSenhaForm.value;
      if (password !== passwordConfirm) {
        this.alertService.showAlert('As senhas não coincidem!', 'warning');
        return;
      }

      this.loginService.updatePassword(password, this.hash).subscribe({
        next: () => this.alertService.showAlert('Senha redefinida com sucesso!', 'success'),
        error: () => this.alertService.showAlert('Erro ao redefinir a senha.', 'error')
      });
    }
  }
}
