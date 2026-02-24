import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, NavigationEnd, RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription, filter } from 'rxjs';
import { AuthService } from '../../../core/services/auth.service';
import { ParentService } from '../../../core/services/parent.service';
import { LucideAngularModule } from 'lucide-angular';
import { Child } from '../../../core/models/child.model';
import { Appointment } from '../../../core/models/appointment.model';
import { PrescriptionListComponent } from '../../prescriptions/prescription-list.component';
import { TraitementListComponent } from '../../traitements/traitement-list.component';
import { NotificationListComponent } from '../../notifications/notification-list.component';

@Component({
  selector: 'app-parent-dashboard',
  standalone: true,
  imports: [
    CommonModule, 
    RouterModule, 
    FormsModule, 
    ReactiveFormsModule, 
    LucideAngularModule,
    PrescriptionListComponent,
    TraitementListComponent,
    NotificationListComponent
  ],
  templateUrl: './parent-dashboard.component.html',
  styleUrl: './parent-dashboard.component.scss',
})
export class ParentDashboardComponent implements OnInit, OnDestroy {
  currentUser$ = this.auth.currentUser$;
  mobileMenuOpen = false;
  userMenuOpen = false;
  activeTab = 'dashboard';
  childRouteActive = false;
  private routeSub!: Subscription;

  loading = true;
  stats = { children: 0, appointments: 0 };
  children: Child[] = [];
  appointments: Appointment[] = [];
  availableDoctors: any[] = [];

  showChildModal = false;
  editingChild: Child | null = null;
  childForm!: FormGroup;
  childSaving = false;

  showApptModal = false;
  apptForm!: FormGroup;
  apptSaving = false;

  showDoctorModal = false;
  selectedChildForDoctor: Child | null = null;

  alertMsg = '';
  alertType: 'success' | 'error' = 'success';

  constructor(
    private auth: AuthService,
    private router: Router,
    private parentService: ParentService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.checkChildRoute(this.router.url);
    this.routeSub = this.router.events
      .pipe(filter((e): e is NavigationEnd => e instanceof NavigationEnd))
      .subscribe(e => this.checkChildRoute(e.urlAfterRedirects));

    this.childForm = this.fb.group({
      fullName: ['', Validators.required],
      dateOfBirth: ['', Validators.required],
      gender: ['', Validators.required],
      notes: ['']
    });

    this.apptForm = this.fb.group({
      childId: ['', Validators.required],
      doctorId: ['', Validators.required],
      dateTime: ['', Validators.required],
      reason: ['', Validators.required],
      parentNotes: ['']
    });

    this.loadData();
  }

  ngOnDestroy(): void {
    this.routeSub?.unsubscribe();
  }

  private checkChildRoute(url: string): void {
    this.childRouteActive = url !== '/parent' && url.startsWith('/parent/');
  }

  loadData(): void {
    this.loading = true;
    this.parentService.getDashboard().subscribe({
      next: (data: any) => {
        this.stats = { children: data.childrenCount || 0, appointments: data.appointmentsCount || 0 };
        this.loading = false;
      },
      error: () => { this.loading = false; }
    });
    this.parentService.getChildren().subscribe({ next: (c: Child[]) => this.children = c });
    this.parentService.getAppointments().subscribe({ next: (a: Appointment[]) => this.appointments = a });
    this.parentService.getAvailableDoctors().subscribe({ next: (d: any[]) => this.availableDoctors = d });
  }

  setTab(tab: string): void {
    this.activeTab = tab;
    this.mobileMenuOpen = false;
    if (this.childRouteActive) this.router.navigate(['/parent']);
  }

  toggleMobileMenu(): void { this.mobileMenuOpen = !this.mobileMenuOpen; }
  toggleUserMenu(): void { this.userMenuOpen = !this.userMenuOpen; }
  logout(): void { this.auth.logout(); }

  openAddChild(): void {
    this.editingChild = null;
    this.childForm.reset();
    this.showChildModal = true;
  }

  openEditChild(child: Child): void {
    this.editingChild = child;
    this.childForm.patchValue({
      fullName: child.fullName,
      dateOfBirth: child.dateOfBirth,
      gender: child.gender,
      notes: child.notes
    });
    this.showChildModal = true;
  }

  saveChild(): void {
    if (this.childForm.invalid) return;
    this.childSaving = true;
    const data = this.childForm.value;
    const obs = this.editingChild
      ? this.parentService.updateChild(this.editingChild.id!, data)
      : this.parentService.addChild(data);
    obs.subscribe({
      next: () => {
        this.showChildModal = false;
        this.childSaving = false;
        this.showAlert(this.editingChild ? 'Child updated' : 'Child added', 'success');
        this.loadData();
      },
      error: () => { this.childSaving = false; this.showAlert('Failed to save child', 'error'); }
    });
  }

  deleteChild(child: Child): void {
    if (!confirm('Delete ' + child.fullName + '?')) return;
    this.parentService.deleteChild(child.id!).subscribe({
      next: () => { this.showAlert('Child deleted', 'success'); this.loadData(); },
      error: () => this.showAlert('Failed to delete child', 'error')
    });
  }

  openDoctorModal(child: Child): void {
    this.selectedChildForDoctor = child;
    this.showDoctorModal = true;
  }

  assignDoctor(doctorId: string): void {
    if (!this.selectedChildForDoctor) return;
    this.parentService.assignDoctor(this.selectedChildForDoctor.id!, doctorId).subscribe({
      next: () => { this.showDoctorModal = false; this.showAlert('Doctor assigned', 'success'); this.loadData(); },
      error: () => this.showAlert('Failed to assign doctor', 'error')
    });
  }

  removeDoctor(child: Child, doctorId: string): void {
    this.parentService.removeDoctor(child.id!, doctorId).subscribe({
      next: () => { this.showAlert('Doctor removed', 'success'); this.loadData(); },
      error: () => this.showAlert('Failed to remove doctor', 'error')
    });
  }

  openApptModal(): void {
    this.apptForm.reset();
    this.showApptModal = true;
  }

  saveAppointment(): void {
    if (this.apptForm.invalid) return;
    this.apptSaving = true;
    this.parentService.createAppointment(this.apptForm.value).subscribe({
      next: () => {
        this.showApptModal = false;
        this.apptSaving = false;
        this.showAlert('Appointment created', 'success');
        this.loadData();
      },
      error: () => { this.apptSaving = false; this.showAlert('Failed to create appointment', 'error'); }
    });
  }

  cancelAppointment(id: string): void {
    if (!confirm('Cancel this appointment?')) return;
    this.parentService.cancelAppointment(id).subscribe({
      next: () => { this.showAlert('Appointment cancelled', 'success'); this.loadData(); },
      error: () => this.showAlert('Failed to cancel appointment', 'error')
    });
  }

  getDoctorName(doctorId: string): string {
    const d = this.availableDoctors.find(doc => doc.id === doctorId);
    return d ? d.fullName : doctorId;
  }

  getChildName(childId: string): string {
    const c = this.children.find(ch => ch.id === childId);
    return c ? c.fullName : childId;
  }

  getStatusClass(status: string): string {
    const map: Record<string, string> = {
      PENDING: 'warning', ACCEPTED: 'success', REFUSED: 'danger',
      RESCHEDULED: 'info', COMPLETED: 'muted', CANCELLED: 'muted'
    };
    return map[status] || '';
  }

  private showAlert(msg: string, type: 'success' | 'error'): void {
    this.alertMsg = msg;
    this.alertType = type;
    setTimeout(() => this.alertMsg = '', 4000);
  }
}
