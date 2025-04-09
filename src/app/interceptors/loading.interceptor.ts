import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { finalize } from 'rxjs';
import { LoadingService } from '../services/loading.service';

export const httpLoadingInterceptor: HttpInterceptorFn = (req, next) => {
  const loadingService = inject(LoadingService);

  const ignoredUrlFragments = ['listcities', 'liststations', 'listproducts'];
  
  if (!ignoredUrlFragments.some(fragment => req.url.includes(fragment))) 
    loadingService.show()

  return next(req).pipe(
    finalize(() => loadingService.hide())
  );
};
