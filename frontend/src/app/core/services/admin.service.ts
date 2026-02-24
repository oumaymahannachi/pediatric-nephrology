import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { UserProfile, ApiMessage } from '../models/auth.models';
import { Child } from '../models/child.model';
import { Appointment } from '../models/appointment.model';

@Injectable({ providedIn: 'root' })
export class AdminService {
  private readonly API = `${environment.apiUrl}/admin`;

  constructor(private http: HttpClient) {}

  getDashboard(): Observable<any> {
    return this.http.get<any>(`${this.API}/dashboard`);
  }

  getAllUsers(): Observable<UserProfile[]> {
    return this.http.get<UserProfile[]>(`${this.API}/users`);
  }

  getUser(id: string): Observable<UserProfile> {
    return this.http.get<UserProfile>(`${this.API}/users/${id}`);
  }

  getUsersByRole(role: string): Observable<UserProfile[]> {
    return this.http.get<UserProfile[]>(`${this.API}/users/role/${role}`);
  }

  banUser(id: string): Observable<ApiMessage> {
    return this.http.put<ApiMessage>(`${this.API}/users/${id}/ban`, {});
  }

  unbanUser(id: string): Observable<ApiMessage> {
    return this.http.put<ApiMessage>(`${this.API}/users/${id}/unban`, {});
  }

  updateUser(id: string, data: Partial<UserProfile>): Observable<UserProfile> {
    return this.http.put<UserProfile>(`${this.API}/users/${id}`, data);
  }

  deleteUser(id: string): Observable<ApiMessage> {
    return this.http.delete<ApiMessage>(`${this.API}/users/${id}`);
  }

  getDoctorPatients(doctorId: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.API}/doctors/${doctorId}/patients`);
  }

  getAllAppointments(): Observable<Appointment[]> {
    return this.http.get<Appointment[]>(`${this.API}/appointments`);
  }

  getAllChildren(): Observable<Child[]> {
    return this.http.get<Child[]>(`${this.API}/children`);
  }
}
