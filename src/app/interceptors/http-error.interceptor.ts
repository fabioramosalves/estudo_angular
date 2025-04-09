import { HttpInterceptorFn } from '@angular/common/http';
import { HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';
import { AlertService } from '../services/alert.service';

export const httpErrorInterceptor: HttpInterceptorFn = (req, next): Observable<any> => {
  const alertService = inject(AlertService);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status >= 400 && error.status < 600) {
        const message =
          error.error?.message || `Erro ${error.status}: ${error.statusText || 'Ocorreu um erro inesperado.'}`;
        alertService.showAlert(message, 'error');
      }

      return throwError(() => new Error(error.message || 'Erro desconhecido'));
    })
  );
};
