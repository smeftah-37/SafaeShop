import { Component, OnInit } from '@angular/core';
import { ReservationService } from '../services/reservation.service';
import { TableModule } from 'primeng/table';  // for p-table
import { ButtonModule } from 'primeng/button';  // for p-button
import { InputTextModule } from 'primeng/inputtext';  // for p-inputText
import { TagModule } from 'primeng/tag';  // for p-tag
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { HTTP_INTERCEPTORS, HttpClient, HttpClientModule } from '@angular/common/http';
import { Router } from '@angular/router';
import { LoginService } from '../login/auth.service';
import { AuthInterceptor } from '../login/auth.interceptor';
interface Reservation {
  id: number;
  name: string;
  date: string;
  time: string;
  barber: { name: string };
  user: { name: string };
}

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashbord.component.html',
  styleUrls: ['./dashbord.component.css'],
  standalone: true,
  imports: [
    InputIconModule,
    IconFieldModule,
    FormsModule,
    CommonModule,
    TableModule,
    ButtonModule,
    InputTextModule,
    TagModule,
    HttpClientModule,
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    }
  ],
})
export class DashboardComponent implements OnInit {
  // Initialize with 10 default reservations
  reservations: Reservation[] = [
    { id: 1, name: 'Reservation 1', date: '2024-12-10', time: '09:00', barber: { name: 'John Barber' }, user: { name: 'Alice' } },
    { id: 2, name: 'Reservation 2', date: '2024-12-10', time: '09:30', barber: { name: 'John Barber' }, user: { name: 'Bob' } },
    { id: 3, name: 'Reservation 3', date: '2024-12-10', time: '10:00', barber: { name: 'Jane Barber' }, user: { name: 'Charlie' } },
    { id: 4, name: 'Reservation 4', date: '2024-12-10', time: '10:30', barber: { name: 'Jane Barber' }, user: { name: 'Diana' } },
    { id: 5, name: 'Reservation 5', date: '2024-12-10', time: '11:00', barber: { name: 'Mike Barber' }, user: { name: 'Eve' } },
    { id: 6, name: 'Reservation 6', date: '2024-12-10', time: '11:30', barber: { name: 'Mike Barber' }, user: { name: 'Frank' } },
    { id: 7, name: 'Reservation 7', date: '2024-12-10', time: '12:00', barber: { name: 'Sara Barber' }, user: { name: 'Grace' } },
    { id: 8, name: 'Reservation 8', date: '2024-12-10', time: '12:30', barber: { name: 'Sara Barber' }, user: { name: 'Hank' } },
    { id: 9, name: 'Reservation 9', date: '2024-12-10', time: '13:00', barber: { name: 'John Barber' }, user: { name: 'Irene' } },
    { id: 10, name: 'Reservation 10', date: '2024-12-10', time: '13:30', barber: { name: 'John Barber' }, user: { name: 'Jack' } }
  ];
  selectedReservations: Reservation[] = [];
  loading = false;
  searchValue: string = '';

  constructor(private router: Router, private authService: LoginService) {}

  ngOnInit(): void {
    // No fetching needed since we are using default values.
  }

  GoToHome() {
    this.router.navigate(['/']);
  }

  logout() {
    this.authService.logout();
  }

  clear(dt: any) {
    dt.clear();
  }

  onInput(event: Event) {
    const input = event.target as HTMLInputElement;
    this.searchValue = input.value;
  }
}
