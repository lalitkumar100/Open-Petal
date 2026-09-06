import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { ErrorDialog } from '../services/error-dialog';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const errorDialog = inject(ErrorDialog);
  const token = authService.getToken();

  if (token) {
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 403) {
        errorDialog.showAccessDenied();
      } else if (error.status === 401) {
        errorDialog.showUnauthorized();
      } else if (error.status === 0 || error.status >= 500) {
        // Status 0 happens when the backend is completely unreachable (e.g. server down)
        // >= 500 happens when the server responds with a server error
        
        // Skip global dialog for auth endpoints so they can show inline errors
        if (!req.url.includes('/auth/')) {
          errorDialog.showServerDown();
        }
      }
      return throwError(() => error);
    })
  );
};
