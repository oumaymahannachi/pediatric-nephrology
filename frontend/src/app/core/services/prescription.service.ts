import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  Prescription,
  PrescriptionCreateRequest,
  ApiResponse
} from '../models/prescription.models';

@Injectable({ providedIn: 'root' })
export class PrescriptionService {
  private readonly API = `${environment.apiUrl}/prescriptions`;

  constructor(private http: HttpClient) {}

  creerPrescription(request: PrescriptionCreateRequest): Observable<ApiResponse<Prescription>> {
    return this.http.post<ApiResponse<Prescription>>(this.API, request);
  }

  getPrescriptionsPatient(patientId: string): Observable<ApiResponse<Prescription[]>> {
    return this.http.get<ApiResponse<Prescription[]>>(`${this.API}/patient/${patientId}`);
  }

  getPrescription(id: string): Observable<ApiResponse<Prescription>> {
    return this.http.get<ApiResponse<Prescription>>(`${this.API}/${id}`);
  }

  renouvelerPrescription(id: string): Observable<ApiResponse<Prescription>> {
    return this.http.post<ApiResponse<Prescription>>(`${this.API}/${id}/renouveler`, {});
  }

  getMesPrescriptions(): Observable<ApiResponse<Prescription[]>> {
    return this.http.get<ApiResponse<Prescription[]>>(`${this.API}/moi`);
  }
}
