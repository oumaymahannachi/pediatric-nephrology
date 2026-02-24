import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  TraitementChronique,
  TraitementCreateRequest
} from '../models/traitement.models';
import { ApiResponse } from '../models/prescription.models';

@Injectable({ providedIn: 'root' })
export class TraitementService {
  private readonly API = `${environment.apiUrl}/traitements`;

  constructor(private http: HttpClient) {}

  creerTraitement(request: TraitementCreateRequest): Observable<ApiResponse<TraitementChronique>> {
    return this.http.post<ApiResponse<TraitementChronique>>(this.API, request);
  }

  getTraitementsActifs(patientId: string): Observable<ApiResponse<TraitementChronique[]>> {
    return this.http.get<ApiResponse<TraitementChronique[]>>(`${this.API}/patient/${patientId}/actifs`);
  }

  enregistrerRenouvellement(
    id: string,
    prescriptionId: string,
    pharmacienId: string
  ): Observable<ApiResponse<TraitementChronique>> {
    const params = new HttpParams()
      .set('prescriptionId', prescriptionId)
      .set('pharmacienId', pharmacienId);
    return this.http.post<ApiResponse<TraitementChronique>>(`${this.API}/${id}/renouveler`, null, { params });
  }

  enregistrerObservance(
    id: string,
    date: string,
    pris: boolean,
    heurePrise?: number,
    commentaire?: string
  ): Observable<ApiResponse<void>> {
    let params = new HttpParams()
      .set('date', date)
      .set('pris', pris.toString());
    
    if (heurePrise !== undefined) {
      params = params.set('heurePrise', heurePrise.toString());
    }
    if (commentaire) {
      params = params.set('commentaire', commentaire);
    }

    return this.http.post<ApiResponse<void>>(`${this.API}/${id}/observance`, null, { params });
  }

  marquerBilanRealise(
    id: string,
    type: string,
    dateRealisation: string,
    resultat?: string
  ): Observable<ApiResponse<void>> {
    let params = new HttpParams().set('dateRealisation', dateRealisation);
    
    if (resultat) {
      params = params.set('resultat', resultat);
    }

    return this.http.post<ApiResponse<void>>(`${this.API}/${id}/bilans/${type}/realise`, null, { params });
  }

  getMesTraitementsActifs(): Observable<ApiResponse<TraitementChronique[]>> {
    return this.http.get<ApiResponse<TraitementChronique[]>>(`${this.API}/moi/actifs`);
  }
}
