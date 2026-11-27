import {
  Component, computed,
  EventEmitter,
  input,
  Output,
  effect,
  output,
  signal
} from "@angular/core";
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, RouterLink } from '@angular/router';
import { Claim } from 'src/app/core/Models/claims/claims.interface';
import { CLAIMS_DATA } from '../claim-dashboard/data/claims.data';
@Component({
  imports: [CommonModule, RouterModule, RouterLink],
  selector: "app-claim-records",
  styleUrl: "./claim-records.component.css",
  templateUrl: "./claim-records.component.html",
})
export class ClaimRecordsComponent {

  // Input Data

  @Output() headingChange = new EventEmitter<{
    title: string;
    description: string;
  }>();
  claims = input<Claim[]>([...CLAIMS_DATA]);
  filteredClaimsChange = output<Claim[]>();
  showDashboardButton = input(false);

  // Search and Filters
  searchTerm = signal<string>('');
  selectedStatus = signal<string>('All');
  selectedPayer = signal<string>('All');

  // Date Filters
  fromDate = signal<string>('');
  toDate = signal<string>('');

  // Sorting
  sortColumn = signal<keyof Claim>('claimDate');
  sortDirection = signal<'asc' | 'desc'>('desc');

  // Pagination
  currentPage = signal<number>(1);
  pageSize = signal<number>(5);

  // Status Options
  statuses = [
    'All',
    'Pending',
    'Approved',
    'Denied',
    'Needs Action'
  ];

  // Payer Options

  constructor(private route: ActivatedRoute) {
    this.route.url.subscribe(() => {
      this.pageSize.set(
        this.route.snapshot.routeConfig?.path === 'all' ? 10 : 5
      );
    });
    effect(() => {
      this.filteredClaimsChange.emit(this.filteredClaims());
    });
  }
  payers = computed(() => {
    const uniquePayers = this.claims().map(
      claim => claim.payer
    );

    return ['All', ...new Set(uniquePayers)];
  });

  // Filter and Sort Records
  filteredClaims = computed(() => {
    const search = this.searchTerm().trim().toLowerCase();
    const status = this.selectedStatus();
    const payer = this.selectedPayer();

    return this.claims()
      .filter(claim => {
        const matchesSearch =
          !search ||
          claim.id.toLowerCase().includes(search) ||
          claim.patientName.toLowerCase().includes(search) ||
          claim.patientId.toLowerCase().includes(search);

        const matchesStatus =
          status === 'All' || claim.status === status;

        const matchesPayer =
          payer === 'All' || claim.payer === payer;

        const matchesFromDate =
          !this.fromDate() ||
          claim.claimDate >= this.fromDate();

        const matchesToDate =
          !this.toDate() ||
          claim.claimDate <= this.toDate();

        return (
          matchesSearch &&
          matchesStatus &&
          matchesPayer &&
          matchesFromDate &&
          matchesToDate
        );
      })
      .sort((a, b) => {
        const column = this.sortColumn();
        const direction = this.sortDirection();

        const valueA = a[column];
        const valueB = b[column];

        let comparison = 0;

        if (
          typeof valueA === 'number' &&
          typeof valueB === 'number'
        ) {
          comparison = valueA - valueB;
        } else {
          comparison = String(valueA ?? '').localeCompare(
            String(valueB ?? '')
          );
        }

        return direction === 'asc'
          ? comparison
          : -comparison;
      });
  });

  // Pagination
  totalPages = computed(() =>
    Math.max(
      1,
      Math.ceil(
        this.filteredClaims().length / this.pageSize()
      )
    )
  );

  navigate() {
    this.headingChange.emit({
      title: 'All Claims',
      description: 'Search, filter, and review all recorded claims.'
    });
  }

  paginatedClaims = computed(() => {
    const start =
      (this.currentPage() - 1) * this.pageSize();

    return this.filteredClaims().slice(
      start,
      start + this.pageSize()
    );
  });

  // Search
  onSearch(value: string): void {
    this.searchTerm.set(value);
    this.currentPage.set(1);
  }

  // Status Filter
  onStatusChange(value: string): void {
    this.selectedStatus.set(value);
    this.currentPage.set(1);
  }

  // Payer Filter
  onPayerChange(value: string): void {
    this.selectedPayer.set(value);
    this.currentPage.set(1);
  }

  // Date Filters
  onFromDateChange(value: string): void {
    this.fromDate.set(value);
    this.currentPage.set(1);
  }

  onToDateChange(value: string): void {
    this.toDate.set(value);
    this.currentPage.set(1);
  }

  // Clear Filters
  clearFilters(): void {
    this.searchTerm.set('');
    this.selectedStatus.set('All');
    this.selectedPayer.set('All');
    this.fromDate.set('');
    this.toDate.set('');
    this.currentPage.set(1);
  }

  // Sorting
  sortBy(column: keyof Claim): void {
    if (this.sortColumn() === column) {
      this.sortDirection.update(direction =>
        direction === 'asc' ? 'desc' : 'asc'
      );
    } else {
      this.sortColumn.set(column);
      this.sortDirection.set('asc');
    }
  }

  // Pagination Actions
  changePage(page: number): void {
    if (page >= 1 && page <= this.totalPages()) {
      this.currentPage.set(page);
    }
  }

  previousPage(): void {
    this.changePage(this.currentPage() - 1);
  }

  nextPage(): void {
    this.changePage(this.currentPage() + 1);
  }

  getPageNumbers(): number[] {
    return Array.from(
      { length: this.totalPages() },
      (_, index) => index + 1
    );
  }

  onPageSizeChange(value: string): void {
    const size = Number(value);

    if (size > 0) {
      this.pageSize.set(size);
      this.currentPage.set(1);
    }
  }

  // Record Information
  showingStart(): number {
    return this.filteredClaims().length === 0
      ? 0
      : (this.currentPage() - 1) * this.pageSize() + 1;
  }

  showingEnd(): number {
    return Math.min(
      this.currentPage() * this.pageSize(),
      this.filteredClaims().length
    );
  }

  // Formatting
  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 2
    }).format(amount);
  }

  formatDate(date: string): string {
    if (!date) {
      return '-';
    }

    return new Date(date).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  }

  getStatusClass(status: string): string {
    switch (status?.trim().toLowerCase()) {
      case 'approved':
        return 'cl-badge--approved';

      case 'pending':
        return 'cl-badge--pending';

      case 'denied':
        return 'cl-badge--denied';

      case 'needs action':
      case 'requires attention':
        return 'cl-badge--action';

      default:
        return 'cl-badge--other';
    }
  }

  getStatusIcon(status: string): string {
    switch (status?.trim().toLowerCase()) {
      case 'approved':
        return '✓';

      case 'pending':
        return '◷';

      case 'denied':
        return '✕';

      case 'needs action':
      case 'requires attention':
        return '⚠';

      default:
        return '•';
    }
  }

  getStatusLabel(status: string): string {
    return status === 'Requires Attention' ? 'Needs Action' : status;
  }
}

