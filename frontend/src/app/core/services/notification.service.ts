import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  Notification,
  NotificationCreateRequest
} from '../models/notification.models';
import { ApiResponse } from '../models/prescription.models';

@Injectable({ providedIn: 'root' })
export class NotificationService {
  private readonly API = `${environment.apiUrl}/notifications`;
  
  private notificationCountSubject = new BehaviorSubject<number>(0);
  notificationCount$ = this.notificationCountSubject.asObservable();

  constructor(private http: HttpClient) {}

  creerNotification(request: NotificationCreateRequest): Observable<ApiResponse<Notification>> {
    return this.http.post<ApiResponse<Notification>>(this.API, request);
  }

  getNotificationsNonLues(): Observable<ApiResponse<Notification[]>> {
    return this.http.get<ApiResponse<Notification[]>>(`${this.API}/non-lues`);
  }

  getNombreNotificationsNonLues(): Observable<ApiResponse<number>> {
    return this.http.get<ApiResponse<number>>(`${this.API}/compteur`).pipe(
      tap(response => this.notificationCountSubject.next(response.data))
    );
  }

  marquerCommeLue(id: string): Observable<ApiResponse<void>> {
    return this.http.put<ApiResponse<void>>(`${this.API}/${id}/lue`, {}).pipe(
      tap(() => this.refreshNotificationCount())
    );
  }

  marquerToutCommeLu(): Observable<ApiResponse<void>> {
    return this.http.put<ApiResponse<void>>(`${this.API}/tout-lu`, {}).pipe(
      tap(() => this.notificationCountSubject.next(0))
    );
  }

  refreshNotificationCount(): void {
    this.getNombreNotificationsNonLues().subscribe();
  }
}
