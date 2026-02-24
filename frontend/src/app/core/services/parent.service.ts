import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Child, DoctorInfo } from '../models/child.model';
import { Appointment } from '../models/appointment.model';
import { ApiMessage } from '../models/auth.models';

@Injectable({ providedIn: 'root' })
export class ParentService {
  private readonly API = `${environment.apiUrl}/parent`;

  constructor(private http: HttpClient) {}

  getDashboard(): Observable<any> {
    return this.http.get<any>(`${this.API}/dashboard`);
  }

  getChildren(): Observable<Child[]> {
    return this.http.get<Child[]>(`${this.API}/children`);
  }

  addChild(child: Partial<Child>): Observable<Child> {
    return this.http.post<Child>(`${this.API}/children`, child);
  }

  updateChild(id: string, child: Partial<Child>): Observable<Child> {
    return this.http.put<Child>(`${this.API}/children/${id}`, child);
  }

  deleteChild(id: string): Observable<ApiMessage> {
    return this.http.delete<ApiMessage>(`${this.API}/children/${id}`);
  }

  assignDoctor(childId: string, doctorId: string): Observable<Child> {
    return this.http.post<Child>(`${this.API}/children/${childId}/doctors/${doctorId}`, {});
  }

  removeDoctor(childId: string, doctorId: string): Observable<Child> {
    return this.http.delete<Child>(`${this.API}/children/${childId}/doctors/${doctorId}`);
  }

  getAvailableDoctors(): Observable<DoctorInfo[]> {
    return this.http.get<DoctorInfo[]>(`${this.API}/doctors`);
  }

  getAppointments(): Observable<Appointment[]> {
    return this.http.get<Appointment[]>(`${this.API}/appointments`);
  }

  createAppointment(apt: Partial<Appointment>): Observable<Appointment> {
    return this.http.post<Appointment>(`${this.API}/appointments`, apt);
  }

  cancelAppointment(id: string): Observable<ApiMessage> {
    return this.http.delete<ApiMessage>(`${this.API}/appointments/${id}`);
  }
}
