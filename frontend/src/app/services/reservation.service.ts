import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root', // Ensure it's provided at the root level
})
export class ReservationService {
  private apiUrl = 'http://localhost:3000/reservations'; // Replace with your actual API endpoint

  constructor(private http: HttpClient) {}

  getAvailableSlots(date: string, barberId: number): Observable<string[]> {
    return this.http.get<string[]>(`${this.apiUrl}?date=${date}&barberId=${barberId}`);
  }

  createReservation(data: any): Observable<any> {
    return this.http.post(this.apiUrl, data);
  }


  getReservations(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }
}
