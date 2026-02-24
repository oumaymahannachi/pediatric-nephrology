import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';
import { AdminService } from '../../../core/services/admin.service';
import { UserProfile } from '../../../core/models/auth.models';
import { LucideAngularModule } from 'lucide-angular';
import { ApexOptions, NgApexchartsModule } from 'ng-apexcharts';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, ReactiveFormsModule, LucideAngularModule, NgApexchartsModule],
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.scss',
  host: { '[class.nav-collapsed]': 'navCollapsed' }
})
export class AdminDashboardComponent implements OnInit {
  currentUser$ = this.authService.currentUser$;
  currentUserId = '';
  activeTab = 'dashboard';
  navCollapsed = false;
  loading = true;

  stats = { totalUsers: 0, doctors: 0, parents: 0, infirmiers: 0, children: 0, appointments: 0 };
  users: UserProfile[] = [];
  filteredUsers: UserProfile[] = [];
  searchQuery = '';
  roleFilter = '';

  currentPage = 1;
  pageSize = 8;

  showEditModal = false;
  editingUser: UserProfile | null = null;
  editForm!: FormGroup;
  editSaving = false;

  alertMsg = '';
  alertType: 'success' | 'error' = 'success';

  cards = [
    { background: 'bg-c-blue', title: 'Total Users', icon: 'users', text: 'Accounts', number: '0' },
    { background: 'bg-c-green', title: 'Doctors', icon: 'stethoscope', text: 'Active', number: '0' },
    { background: 'bg-c-yellow', title: 'Parents', icon: 'heart', text: 'Families', number: '0' },
    { background: 'bg-c-red', title: 'Nurses', icon: 'syringe', text: 'Staff', number: '0' }
  ];

  chartOptions!: Partial<ApexOptions>;
  chartOptions_1!: Partial<ApexOptions>;
  chartOptions_2!: Partial<ApexOptions>;
  chartOptions_3!: Partial<ApexOptions>;

  constructor(
    private authService: AuthService,
    private adminService: AdminService,
    private fb: FormBuilder
  ) {
    this.editForm = this.fb.group({
      fullName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      cin: ['', [Validators.required, Validators.pattern(/^\d{8}$/)]],
      phone: [''],
      specialization: [''],
      serviceUnit: ['']
    });
    this.chartOptions = {
      chart: { height: 205, type: 'line', toolbar: { show: false } },
      dataLabels: { enabled: false },
      stroke: { width: 2, curve: 'smooth' },
      series: [
        { name: 'Users', data: [20, 50, 30, 60, 30, 50] },
        { name: 'Appointments', data: [60, 30, 65, 45, 67, 35] }
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
      labels: ['Doctors', 'Parents'],
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
      labels: ['Active', 'Banned'],
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

  ngOnInit() {
    this.currentUser$.subscribe(u => { if (u) this.currentUserId = u.id; });
    this.loadData();
  }

  toggleNav(): void { this.navCollapsed = !this.navCollapsed; }

  loadData() {
    this.loading = true;
    this.adminService.getDashboard().subscribe({
      next: (s: any) => {
        this.stats = {
          totalUsers: s.totalUsers || 0,
          doctors: s.doctorsCount || 0,
          parents: s.parentsCount || 0,
          infirmiers: s.nursesCount || 0,
          children: s.childrenCount || 0,
          appointments: s.appointmentsCount || 0
        };
        this.cards[0].number = String(this.stats.totalUsers);
        this.cards[1].number = String(this.stats.doctors);
        this.cards[2].number = String(this.stats.parents);
        this.cards[3].number = String(this.stats.infirmiers);
        this.loading = false;
      },
      error: () => this.loading = false
    });
    this.adminService.getAllUsers().subscribe({
      next: u => {
        this.users = u;
        this.applyFilters();
      }
    });
  }

  setTab(tab: string) {
    this.activeTab = tab;
    if (tab === 'users' && this.users.length === 0) {
      this.adminService.getAllUsers().subscribe(u => {
        this.users = u;
        this.applyFilters();
      });
    }
  }

  applyFilters() {
    let list = this.users.filter(u => u.id !== this.currentUserId);
    if (this.roleFilter) {
      list = list.filter(u => u.role === this.roleFilter);
    }
    if (this.searchQuery.trim()) {
      const q = this.searchQuery.toLowerCase();
      list = list.filter(u =>
        u.fullName.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q) ||
        (u.cin && u.cin.includes(q))
      );
    }
    this.filteredUsers = list;
    this.currentPage = 1;
  }

  get totalPages(): number {
    return Math.ceil(this.filteredUsers.length / this.pageSize);
  }

  get paginatedUsers(): UserProfile[] {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.filteredUsers.slice(start, start + this.pageSize);
  }

  get pageNumbers(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }

  goToPage(page: number) {
    if (page >= 1 && page <= this.totalPages) this.currentPage = page;
  }

  banUser(id: string) {
    this.adminService.banUser(id).subscribe({
      next: () => {
        const u = this.users.find(x => x.id === id);
        if (u) u.status = 'BANNED';
        this.applyFilters();
        this.showAlert('User banned successfully', 'success');
      },
      error: () => this.showAlert('Failed to ban user', 'error')
    });
  }

  unbanUser(id: string) {
    this.adminService.unbanUser(id).subscribe({
      next: () => {
        const u = this.users.find(x => x.id === id);
        if (u) u.status = 'ACTIVE';
        this.applyFilters();
        this.showAlert('User unbanned successfully', 'success');
      },
      error: () => this.showAlert('Failed to unban user', 'error')
    });
  }

  openEditUser(user: UserProfile) {
    this.editingUser = user;
    this.editForm.patchValue({
      fullName: user.fullName,
      email: user.email || '',
      cin: user.cin || '',
      phone: user.phone || '',
      specialization: user.specialization || '',
      serviceUnit: user.serviceUnit || ''
    });
    this.showEditModal = true;
  }

  saveEditUser() {
    if (!this.editingUser || this.editForm.invalid) return;
    this.editSaving = true;
    this.adminService.updateUser(this.editingUser.id!, this.editForm.value).subscribe({
      next: updated => {
        const idx = this.users.findIndex(u => u.id === this.editingUser!.id);
        if (idx >= 0) this.users[idx] = { ...this.users[idx], ...updated };
        this.applyFilters();
        this.showEditModal = false;
        this.editSaving = false;
        this.showAlert('User updated successfully', 'success');
      },
      error: () => {
        this.editSaving = false;
        this.showAlert('Failed to update user', 'error');
      }
    });
  }

  deleteUser(id: string) {
    this.adminService.deleteUser(id).subscribe({
      next: () => {
        this.users = this.users.filter(u => u.id !== id);
        this.applyFilters();
        this.showAlert('User deleted successfully', 'success');
      },
      error: () => this.showAlert('Failed to delete user', 'error')
    });
  }

  getRoleBadgeClass(role: string): string {
    switch (role) {
      case 'ADMIN': return 'admin';
      case 'DOCTOR': return 'doctor';
      case 'PARENT': return 'parent';
      case 'INFIRMIER': return 'nurse';
      default: return 'default';
    }
  }

  getStatusClass(status: string): string {
    return status === 'ACTIVE' ? 'active' : 'banned';
  }

  showAlert(msg: string, type: 'success' | 'error') {
    this.alertMsg = msg;
    this.alertType = type;
    setTimeout(() => this.alertMsg = '', 4000);
  }

  logout() {
    this.authService.logout();
  }
}
