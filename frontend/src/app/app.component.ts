import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';


import { HTTP_INTERCEPTORS, HttpClient, HttpClientModule } from '@angular/common/http'; // Import HttpClientModule
import { AuthInterceptor } from './login/auth.interceptor';
import { LoginService } from './login/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  
  imports: [
    RouterOutlet,

  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true // Apply AuthInterceptor globally
    }
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  constructor(private http: HttpClient,private userService:LoginService ){}
  OnInit()
  {
    this.http.get('http://localhost:3000/auth/user/', { withCredentials: true })
    .subscribe(
      response => {
        this.userService.setUser(response);
         // No token needed if using cookies, or set if returned
      },
      error => {
        console.log('No valid session found', error);
        this.userService.setAuthData(null, '');
      }
    );
  }

}