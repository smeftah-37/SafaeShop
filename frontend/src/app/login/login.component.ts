// import { CommonModule } from '@angular/common';
// import { HttpClient, HttpClientModule } from '@angular/common/http';
// import { Component } from '@angular/core';
// import { FormsModule } from '@angular/forms';
// import { Router } from '@angular/router';
// import { AuthService } from './auth.service';

// @Component({
//   selector: 'app-login',
//   standalone: true,
//   imports: [CommonModule,FormsModule,    HttpClientModule, // Add this
//   ],
//   templateUrl: './login.component.html',
//   styleUrl: './login.component.css'
// })
// export class LoginComponent {
//   loginData = {
//     email: '',
//     password: '',
//   };

//   constructor(private http: HttpClient,private router: Router, private authService: AuthService) {}

//   onLogin() {
//     const backendEndpoint = 'http://localhost:3000/auth/login';

//     // withCredentials: true if HTTP-only cookie is involved
//     this.http.post<{ user: any; accessToken: string }>(backendEndpoint, this.loginData, { withCredentials: true })
//       .subscribe(
//         (response) => {
//           console.log('Login successful', response);
//           alert('Login Successful!');

//           // Store the user data and access token in memory
//           this.authService.setAuthData(response.user, response.accessToken);

//           // Navigate to a protected page
//           this.router.navigate(['/dashboard']);
//         },
//         (error) => {
//           console.error('Login failed', error);
//           alert('Login Failed! Please check your email or password.');
//         }
//       );
//   }
// }