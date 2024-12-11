import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http'; // Import HttpClientModule
import { BookingComponent } from '../booking/booking.component';
import { AuthService } from '../services/auth.service';
import { LoginService } from '../login/auth.service';

@Component({
  selector: 'app-home',
  standalone: true,
  
  imports: [
    RouterOutlet,
    CommonModule,
    ButtonModule,
    DialogModule,
    FormsModule,
    HttpClientModule, // Add HttpClientModule
    BookingComponent,
  ],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  isDialogVisible: boolean = false;
  isMenuOpen = false;
  showLoginForm: boolean = false; // Controls the visibility of the login form


  
  constructor(private authService: AuthService,private router: Router,private http: HttpClient,private loginService: LoginService) {}
  loginData = {
    email: '',
    password: '',
  };
toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }
  showBookingDialog(): void {
    this.isDialogVisible = true;
  }

  loginWith(): void {
    this.showLoginForm = true; // Show the login form
  }
  Booking(): void {
    this.showLoginForm =false; // Show the login form
  }
  onLoginSuccess(): void {
    const backendEndpoint = 'http://localhost:3000/auth/login';

    // withCredentials: true if HTTP-only cookie is involved
    this.http.post<{ user: any; accessToken: string }>(backendEndpoint, this.loginData, { withCredentials: true })
      .subscribe(
        (response) => {
          console.log('Login successful', response);

          
          // Store the user data and access token in memory

          this.loginService.setAuthData(response.user, response.accessToken);

          // Navigate to a protected page
          this.router.navigate(['/dashboard']);
        },
        (error) => {
          console.error('Login failed', error);
        }
      );
    this.showLoginForm = false; // Hide the login form
  }

  scrollToSection(sectionId: string): void {
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }
}