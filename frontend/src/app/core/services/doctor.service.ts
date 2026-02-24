import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Appointment } from '../models/appointment.model';

@Injectable({ providedIn: 'root' })
export class DoctorService {
  private readonly API = `${environment.apiUrl}/doctor`;

  constructor(private http: HttpClient) {}

  getDashboard(): Observable<any> {
    return this.http.get<any>(`${this.API}/dashboard`);
  }

  getPatients(): Observable<any[]> {
    return this.http.get<any[]>(`${this.API}/patients`);
  }

  getAppointments(): Observable<Appointment[]> {
    return this.http.get<Appointment[]>(`${this.API}/appointments`);
  }

  getPendingAppointments(): Observable<Appointment[]> {
    return this.http.get<Appointment[]>(`${this.API}/appointments/pending`);
  }

  acceptAppointment(id: string): Observable<Appointment> {
    return this.http.put<Appointment>(`${this.API}/appointments/${id}/accept`, {});
  }

  refuseAppointment(id: string, doctorNotes?: string): Observable<Appointment> {
    return this.http.put<Appointment>(`${this.API}/appointments/${id}/refuse`, { doctorNotes });
  }

  rescheduleAppointment(id: string, proposedDateTime: string, doctorNotes?: string): Observable<Appointment> {
    return this.http.put<Appointment>(`${this.API}/appointments/${id}/reschedule`, { proposedDateTime, doctorNotes });
  }

  completeAppointment(id: string): Observable<Appointment> {
    return this.http.put<Appointment>(`${this.API}/appointments/${id}/complete`, {});
  }
}
