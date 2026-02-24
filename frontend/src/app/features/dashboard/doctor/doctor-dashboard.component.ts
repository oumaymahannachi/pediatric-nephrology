import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';
import { DoctorService } from '../../../core/services/doctor.service';
import { LucideAngularModule } from 'lucide-angular';
import { Appointment } from '../../../core/models/appointment.model';
import { ApexOptions, NgApexchartsModule } from 'ng-apexcharts';

@Component({
  selector: 'app-doctor-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, LucideAngularModule, NgApexchartsModule],
  templateUrl: './doctor-dashboard.component.html',
  styleUrl: './doctor-dashboard.component.scss',
  host: { '[class.nav-collapsed]': 'navCollapsed' }
})
export class DoctorDashboardComponent implements OnInit {
  currentUser$ = this.auth.currentUser$;
  activeTab = 'dashboard';
  navCollapsed = false;

  loading = true;
  stats = { patients: 0, appointments: 0, pendingAppointments: 0 };
  patients: any[] = [];
  appointments: Appointment[] = [];
  pendingAppointments: Appointment[] = [];

  rescheduleId = '';
  rescheduleDate = '';
  rescheduleNotes = '';
  showRescheduleModal = false;

  alertMsg = '';
  alertType: 'success' | 'error' = 'success';

  cards = [
    { background: 'bg-c-blue', title: 'Total Patients', icon: 'baby', text: 'Active Cases', number: '0' },
    { background: 'bg-c-green', title: 'Appointments', icon: 'calendar', text: 'This Month', number: '0' },
    { background: 'bg-c-yellow', title: 'Pending', icon: 'clock', text: 'Awaiting Response', number: '0' },
    { background: 'bg-c-red', title: 'Completed', icon: 'check-circle', text: 'This Month', number: '0' }
  ];

  chartOptions!: Partial<ApexOptions>;
  chartOptions_1!: Partial<ApexOptions>;
  chartOptions_2!: Partial<ApexOptions>;
  chartOptions_3!: Partial<ApexOptions>;

  constructor(private auth: AuthService, private doctorService: DoctorService) {
    this.chartOptions = {
      chart: { height: 205, type: 'line', toolbar: { show: false } },
      dataLabels: { enabled: false },
      stroke: { width: 2, curve: 'smooth' },
      series: [
        { name: 'Checkups', data: [20, 50, 30, 60, 30, 50] },
        { name: 'Follow-ups', data: [60, 30, 65, 45, 67, 35] }
      ],
      legend: { position: 'top' },
      xaxis: {
        type: 'datetime',
        categories: ['1/11/2000', '2/11/2000', '3/11/2000', '4/11/2000', '5/11/2000', '6/11/2000'],
        axisBorder: { show: false }
      },
      yaxis: { show: true, min: 10, max: 70 },
      colors: ['#73b4ff', '#59e0c5'],
      fill: {
        type: 'gradient',
        gradient: {
          shade: 'light', gradientToColors: ['#4099ff', '#2ed8b6'],
          shadeIntensity: 0.5, type: 'horizontal', opacityFrom: 1, opacityTo: 1, stops: [0, 100]
        }
      },
      grid: { borderColor: '#cccccc3b' }
    };
    this.chartOptions_1 = {
      chart: { height: 150, type: 'donut' },
      dataLabels: { enabled: false },
      plotOptions: { pie: { donut: { size: '75%' } } },
      labels: ['New', 'Return'],
      series: [39, 10],
      legend: { show: false },
      tooltip: { theme: 'dark' },
      grid: { padding: { top: 20, right: 0, bottom: 0, left: 0 } },
      colors: ['#4680ff', '#2ed8b6'],
      fill: { opacity: [1, 1] },
      stroke: { width: 0 }
    };
    this.chartOptions_2 = {
      chart: { height: 150, type: 'donut' },
      dataLabels: { enabled: false },
      plotOptions: { pie: { donut: { size: '75%' } } },
      labels: ['New', 'Return'],
      series: [20, 15],
      legend: { show: false },
      tooltip: { theme: 'dark' },
      grid: { padding: { top: 20, right: 0, bottom: 0, left: 0 } },
      colors: ['#fff', '#2ed8b6'],
      fill: { opacity: [1, 1] },
      stroke: { width: 0 }
    };
    this.chartOptions_3 = {
      chart: { type: 'area', height: 145, sparkline: { enabled: true } },
      dataLabels: { enabled: false },
      colors: ['#ff5370'],
      fill: {
        type: 'gradient',
        gradient: {
          shade: 'dark', gradientToColors: ['#ff869a'],
          shadeIntensity: 1, type: 'horizontal', opacityFrom: 1, opacityTo: 0.8, stops: [0, 100, 100, 100]
        }
      },
      stroke: { curve: 'smooth', width: 2 },
      series: [{ data: [45, 35, 60, 50, 85, 70] }],
      yaxis: { min: 5, max: 90 },
      tooltip: { fixed: { enabled: false }, x: { show: false }, marker: { show: false } }
    };
  }

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.loading = true;
    this.doctorService.getDashboard().subscribe({
      next: (data: any) => {
        this.stats = {
          patients: data.patientsCount || 0,
          appointments: data.appointmentsCount || 0,
          pendingAppointments: data.pendingAppointmentsCount || 0
        };
        this.cards[0].number = String(this.stats.patients);
        this.cards[1].number = String(this.stats.appointments);
        this.cards[2].number = String(this.stats.pendingAppointments);
        this.loading = false;
      },
      error: () => { this.loading = false; }
    });
    this.doctorService.getPatients().subscribe({ next: (p: any[]) => this.patients = p });
    this.doctorService.getAppointments().subscribe({ next: (a: Appointment[]) => this.appointments = a });
    this.doctorService.getPendingAppointments().subscribe({ next: (a: Appointment[]) => this.pendingAppointments = a });
  }

  toggleNav(): void { this.navCollapsed = !this.navCollapsed; }
  setTab(tab: string): void { this.activeTab = tab; }

  acceptAppointment(id: string): void {
    this.doctorService.acceptAppointment(id).subscribe({
      next: () => { this.showAlert('Appointment accepted', 'success'); this.loadData(); },
      error: () => this.showAlert('Failed to accept', 'error')
    });
  }

  refuseAppointment(id: string): void {
    if (!confirm('Refuse this appointment?')) return;
    this.doctorService.refuseAppointment(id).subscribe({
      next: () => { this.showAlert('Appointment refused', 'success'); this.loadData(); },
      error: () => this.showAlert('Failed to refuse', 'error')
    });
  }

  openReschedule(apt: Appointment): void {
    this.rescheduleId = apt.id!;
    this.rescheduleDate = '';
    this.rescheduleNotes = '';
    this.showRescheduleModal = true;
  }

  submitReschedule(): void {
    if (!this.rescheduleDate) return;
    this.doctorService.rescheduleAppointment(this.rescheduleId, this.rescheduleDate, this.rescheduleNotes).subscribe({
      next: () => {
        this.showRescheduleModal = false;
        this.showAlert('Appointment rescheduled', 'success');
        this.loadData();
      },
      error: () => this.showAlert('Failed to reschedule', 'error')
    });
  }

  completeAppointment(id: string): void {
    this.doctorService.completeAppointment(id).subscribe({
      next: () => { this.showAlert('Appointment completed', 'success'); this.loadData(); },
      error: () => this.showAlert('Failed to complete', 'error')
    });
  }

  getStatusClass(status: string): string {
    const map: Record<string, string> = {
      PENDING: 'warning', ACCEPTED: 'success', REFUSED: 'danger',
      RESCHEDULED: 'info', COMPLETED: 'muted', CANCELLED: 'muted'
    };
    return map[status] || '';
  }

  logout(): void { this.auth.logout(); }

  private showAlert(msg: string, type: 'success' | 'error'): void {
    this.alertMsg = msg;
    this.alertType = type;
    setTimeout(() => this.alertMsg = '', 4000);
  }
}
