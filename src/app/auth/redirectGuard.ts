import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './auth.service';

export const redirectGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const isLoggedIn = authService.isLoggedIn();
  const targetRoute = isLoggedIn ? '/dashboard' : '/login';

  if (state.url === targetRoute) {
    return true;
  }

  router.navigate([targetRoute]);
  return false;
};
