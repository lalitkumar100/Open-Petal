import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { ErrorDialog } from '../services/error-dialog';
import { StorageService } from '../services/storage.service';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { environment } from '../../../environments/environment';

export const apiInterceptor: HttpInterceptorFn = (req, next) => {
  const storage = inject(StorageService);
  const errorDialog = inject(ErrorDialog);
  const token = storage.getItem<string>('auth_token');

  let url = req.url;
  // Prepend base url to relative paths
  if (!url.startsWith('http')) {
    const baseUrl = `${environment.apiUrl}/${environment.apiVersion}`;
    url = `${baseUrl}${url.startsWith('/') ? '' : '/'}${url}`;
  }

  let setHeaders: any = {};
  if (token) {
    setHeaders['Authorization'] = `Bearer ${token}`;
  }

  req = req.clone({
    url,
    setHeaders
  });

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      // Skip global error dialogs for auth endpoints
      if (!req.url.includes('/auth/')) {
        if (error.status === 403) {
          errorDialog.showAccessDenied();
        } else if (error.status === 401) {
          errorDialog.showUnauthorized();
        } else if (error.status === 0 || error.status >= 500) {
          errorDialog.showServerDown();
        }
      }
      return throwError(() => error);
    })
  );
};
