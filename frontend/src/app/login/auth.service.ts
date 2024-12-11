import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, switchMap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  private userSubject = new BehaviorSubject<any | null>(null);

  user$ = this.userSubject.asObservable();

  constructor(private http: HttpClient, private router: Router) {}

  getUser(): any | null {
    return this.userSubject.value;
  }

  getAccessToken(): string | null {
    const token = localStorage.getItem('access_token');
    console.log('Token retrieved from localStorage:', token);
    return token;
  
}

  isAuthenticated(): boolean {
    return this.getAccessToken() !== null;
  }

  // Set user and token in memory
  setAuthData(user: any, accessToken: string) {
    this.userSubject.next(user);
    localStorage.setItem('access_token', accessToken);

  }
  setUser(user: any) {
    this.userSubject.next(user);

  }
  initializeUser(): void {
    // Attempt to restore session from HTTP-only cookie
    this.http.get<{ user: any }>('/auth/me', { withCredentials: true })
      .subscribe(
        response => {
          this.setAuthData(response.user, ''); // No token needed if using cookies, or set if returned
        },
        error => {
          console.log('No valid session found', error);
          this.setAuthData(null, '');
        }
      );
  }
  refreshAccessToken(): Observable<void> {
    return this.http.post<any>('/auth/refresh-token', {}).pipe(
      switchMap((response) => {
        localStorage.setItem('access_token', response.accessToken);

        return Promise.resolve();
      })
    );
  }
  logout(): void {
    this.userSubject.next(null);
    localStorage.setItem('access_token', '');
    this.router.navigate(['/']);
  }
}
