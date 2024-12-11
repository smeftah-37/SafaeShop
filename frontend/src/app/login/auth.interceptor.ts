import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { LoginService } from './auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private authService: LoginService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const accessToken = this.authService.getAccessToken();

    // Attach access token to request headers
    const clonedRequest = accessToken
      ? req.clone({ setHeaders: { Authorization: `Bearer ${accessToken}` } })
      : req;

    return next.handle(clonedRequest).pipe(
      catchError((error) => {
        // If access token is expired, try refreshing it
        if (error.status === 401) {
          return this.authService.refreshAccessToken().pipe(
            switchMap(() => {
              const newAccessToken = this.authService.getAccessToken();
              const newRequest = req.clone({
                setHeaders: { Authorization: `Bearer ${newAccessToken}` },
              });
              return next.handle(newRequest);
            }),
            catchError((refreshError) => {
              this.authService.logout();
              return throwError(refreshError);
            })
          );
        }

        return throwError(error);
      })
    );
  }
}
