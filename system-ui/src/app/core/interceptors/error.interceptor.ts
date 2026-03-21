import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { ToastService } from '../../shared/services/toast.service';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const toastService = inject(ToastService);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401) {
        toastService.show('SYSTEM DISCONNECTED: UNAUTHORIZED', 'warning');
        router.navigate(['/']);
      } else if (error.status === 500) {
        toastService.show('SYSTEM ERROR', 'warning');
      } else if (error.error instanceof ErrorEvent || error.status === 0) {
        toastService.show('Connection lost', 'warning');
      } else {
        toastService.show(`HTTP ERROR ${error.status}`, 'warning');
      }
      return throwError(() => error);
    })
  );
};
