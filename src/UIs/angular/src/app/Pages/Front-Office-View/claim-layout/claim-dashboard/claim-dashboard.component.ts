
import { Component, computed, EventEmitter, inject, OnInit, Output, signal } from "@angular/core";
import { CommonModule } from "@angular/common";
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration, ChartType } from 'chart.js';
import { RouterModule } from "@angular/router";
import {
  Claim,
  ClaimsSummary
} from "src/app/core/Models/claims/claims.interface";
import { ClaimRecordsComponent } from "../claim-records/claim-records.component";
import { ClaimService } from "src/app/core/Services/claim/claim.service";

@Component({
  selector: "app-claim-dashboard",
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ClaimRecordsComponent,
    BaseChartDirective
  ],
  styleUrl: "./claim-dashboard.component.css",
  templateUrl: "./claim-dashboard.component.html",
})
export class ClaimDashboardComponent implements OnInit {


  private claimsService = inject(ClaimService);
  // Claims Data chart line chart configuration
  lineChartType: 'line' | 'bar' = 'line';

  lineChartData: ChartConfiguration<'line'>['data'] = {
    labels: [],
    datasets: []
  };

  barChartData: ChartConfiguration<'bar'>['data'] = {
    labels: [],
    datasets: []
  };


  chartLegend = [
    { label: 'Approved', color: '#1F9D55' },
    { label: 'Pending', color: '#E8A317' },
    { label: 'Denied', color: '#DC3545' },
    { label: 'Needs Action', color: '#7C3AED' }
  ];


  trendMonths = signal<number>(6);

  updateTrendChart(claims: Claim[]): void {
    const months = this.trendMonths();
    const today = new Date();

    // Last selected months
    const monthList = Array.from({ length: months }, (_, index) => {
      const date = new Date(
        today.getFullYear(),
        today.getMonth() - (months - 1 - index),
        1
      );

      return {
        year: date.getFullYear(),
        month: date.getMonth(),
        key: `${date.getFullYear()}-${date.getMonth()}`,
        label: date.toLocaleDateString('en-US', { month: 'short' })
      };
    });

    const statuses = [
      'Approved',
      'Pending',
      'Denied',
      'Needs Action'
    ];

    const statusColors: Record<string, string> = {
      Approved: '#1F9D55',
      Pending: '#E8A317',
      Denied: '#DC3545',
      'Needs Action': '#7C3AED'
    };


    const chartValues = statuses.map(status => {
      const values = monthList.map(monthInfo => {
        return claims.filter(claim => {
          const date = new Date(claim.submitedDate);

          return (
            !isNaN(date.getTime()) &&
            date.getFullYear() === monthInfo.year &&
            date.getMonth() === monthInfo.month &&
            claim.status === status
          );
        }).length;
      });

      return { status, values };
    });

    const labels = monthList.map(month => month.label);

    // Line Chart Data
    this.lineChartData = {
      labels,
      datasets: chartValues.map(item => ({
        label: item.status,
        data: item.values,
        borderColor: statusColors[item.status],
        backgroundColor: statusColors[item.status],
        borderWidth: 3,
        fill: false,
        tension: 0.25,
        pointRadius: 4,
        pointHoverRadius: 6,
        pointBackgroundColor: statusColors[item.status],
        pointBorderColor: statusColors[item.status]
      }))
    };

    // Bar Chart Data
    this.barChartData = {
      labels,
      datasets: chartValues.map(item => ({
        label: item.status,
        data: item.values,
        backgroundColor: statusColors[item.status],
        borderColor: statusColors[item.status],
        borderWidth: 1,
        borderRadius: 4
      }))
    };
  }

  changeTrendChart(type: 'line' | 'bar'): void {
    this.lineChartType = type;
  }
  lineChartOptions: ChartConfiguration<'line'>['options'] = {
    responsive: true,
    maintainAspectRatio: false,

    layout: {
      padding: {
        top: 10,
        bottom: 5
      }
    },

    plugins: {
      legend: {
        display: true,
        position: 'bottom',
        align: 'start',
        labels: {
          boxWidth: 8,
          boxHeight: 8,
          padding: 12,
          usePointStyle: true,
          color: '#666666',
          borderRadius: 4,
          pointStyle: 'list',

          font: {
            size: 14.5
          }
        }
      },

      tooltip: {
        enabled: true
      }
    },

    scales: {
      x: {
        grid: {
          display: true,
          color: '#E5E7EB'
        },
        ticks: {
          color: '#666666'
        }
      },

      y: {
        beginAtZero: true,
        suggestedMax: 50,
        ticks: {
          stepSize: 10,
          color: '#666666'
        },
        grid: {
          color: '#E5E7EB'
        }
      }
    }
  };

  barChartOptions: ChartConfiguration<'bar'>['options'] = {
    responsive: true,
    maintainAspectRatio: false,

    plugins: {
      legend: {
        display: true,
        position: 'bottom',
        align: 'start',
        labels: {
          boxWidth: 8,
          boxHeight: 8,
          padding: 12,
          usePointStyle: true,
          color: '#666666',
          font: {
            size: 14.5
          }
        }
      },
      tooltip: {
        enabled: true
      }
    },

    scales: {
      x: {
        grid: {
          display: true,
          color: '#E5E7EB'
        },
        ticks: {
          color: '#666666'
        }
      },
      y: {
        beginAtZero: true,
        suggestedMax: 50,
        ticks: {
          stepSize: 10,
          color: '#666666'
        },
        grid: {
          color: '#E5E7EB'
        }
      }
    }
  };


  doughnutChartType: 'doughnut' = 'doughnut';

  doughnutChartData: ChartConfiguration<'doughnut'>['data'] = {
    labels: ['Approved', 'Pending', 'Denied', 'Needs Action'],
    datasets: [
      {
        data: [0, 0, 0, 0],
        backgroundColor: [
          '#1F9D55',
          '#E8A317',
          '#DC3545',
          '#7C3AED'
        ],
        borderWidth: 0,
        hoverOffset: 6
      }
    ]
  };

  doughnutChartOptions: ChartConfiguration<'doughnut'>['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '68%',

    animation: {
      duration: 0
    },


    transitions: {
      active: {
        animation: {
          duration: 0
        }
      }
    },

    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        enabled: true
      }
    }
  };


  loadClaimsTrend(months: number): void {
    this.claimsService.getClaimsTrend({ months }).subscribe({
      next: (data) => {
        const statusColors: Record<string, string> = {
          Approved: '#1F9D55',
          Pending: '#E8A317',
          Denied: '#DC3545',
          'Needs Action': '#7C3AED'
        };

        this.lineChartData = {
          labels: data.labels,
          datasets: Object.entries(data.series).map(
            ([status, values]) => ({
              label: status,
              data: data.series[status] ?? data.labels.map(() => 0),

              borderColor: statusColors[status],
              backgroundColor: statusColors[status],

              borderWidth: 3,
              fill: false,
              tension: 0.25,

              pointRadius: 4,
              pointHoverRadius: 6,
              pointBackgroundColor: statusColors[status],
              pointBorderColor: statusColors[status]
            }))

        };
      },
      error: (error) => {
        console.error('Error loading claims trend:', error);
      }
    });
  }

  onTrendRangeChange(value: string): void {
    this.trendMonths.set(Number(value));
    this.updateTrendChart(this.analyticsClaims());
  }
  claims = signal<Claim[]>([]);
  showAllClaims = false;
  // Filter Values
  searchTerm = signal<string>('');
  selectedStatus = signal<string>('All');
  selectedPayer = signal<string>('All');
  fromDate = signal<string>('');
  toDate = signal<string>('');

  // Sorting
  sortColumn = signal<keyof Claim>('claimDate');
  sortDirection = signal<'asc' | 'desc'>('desc');

  // Pagination
  currentPage = signal<number>(1);
  pageSize = signal<number>(5);

  // Dropdown Values
  statuses: string[] = [
    'All',
    'Pending',
    'Approved',
    'Denied',
    'Needs Action'
  ];

  ngOnInit(): void {
    this.loadClaims();
    // this.loadClaimsSummary();
    // this.loadClaimsTrend(6);
  }

  payers = computed(() => {
    const uniquePayers = this.claims().map(claim => claim.payer);
    return ['All', ...new Set(uniquePayers)];
  });

  // Summary Cards
  summary = signal<ClaimsSummary>({
    total: 0,
    pending: 0,
    approved: 0,
    denied: 0,
    needsAction: 0
  });

  analyticsClaims = signal<Claim[]>([]);

  loadClaims(): void {
    this.claimsService.getClaims().subscribe({
      next: (data) => {
        this.claims.set(data);
      },
      error: (error) => {
        console.error('Error loading claims:', error);
      }
    });
  }

  // Filter Claims
  filteredClaims = computed(() => {
    const search = this.searchTerm().trim().toLowerCase();
    const status = this.selectedStatus();
    const payer = this.selectedPayer();
    const from = this.fromDate();
    const to = this.toDate();

    let result = this.claims().filter(claim => {

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
        !from || claim.claimDate >= from;

      const matchesToDate =
        !to || claim.claimDate <= to;

      return (
        matchesSearch &&
        matchesStatus &&
        matchesPayer &&
        matchesFromDate &&
        matchesToDate
      );
    });

    // Sorting
    const column = this.sortColumn();
    const direction = this.sortDirection();

    result = [...result].sort((a, b) => {
      const valueA = a[column];
      const valueB = b[column];

      let comparison = 0;

      if (typeof valueA === 'number' && typeof valueB === 'number') {
        comparison = valueA - valueB;
      } else {
        comparison = String(valueA ?? '').localeCompare(
          String(valueB ?? '')
        );
      }

      return direction === 'asc' ? comparison : -comparison;
    });

    return result;
  });


  // Top 5 Payers based on filtered claims
  topPayers = computed(() => {
    const claims = this.analyticsClaims();

    const payerCounts = new Map<string, number>();

    claims.forEach(claim => {
      payerCounts.set(
        claim.payer,
        (payerCounts.get(claim.payer) ?? 0) + 1
      );
    });

    const payerList = Array.from(payerCounts.entries())
      .map(([payer, count]) => ({
        payer,
        count
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    const maxCount = payerList[0]?.count ?? 0;

    return payerList.map(payer => ({
      ...payer,
      percentage: maxCount
        ? (payer.count / maxCount) * 100
        : 0
    }));
  });
  onFilteredClaimsChange(filteredClaims: Claim[]): void {
    this.analyticsClaims.set(filteredClaims);

    // Update summary cards
    const summary: ClaimsSummary = {
      total: filteredClaims.length,
      pending: filteredClaims.filter(c => c.status === 'Pending').length,
      approved: filteredClaims.filter(c => c.status === 'Approved').length,
      denied: filteredClaims.filter(c => c.status === 'Denied').length,
      needsAction: filteredClaims.filter(c => c.status === 'Needs Action').length
    };

    this.summary.set(summary);

    // Update Doughnut Chart
    this.doughnutChartData = {
      labels: ['Approved', 'Pending', 'Denied', 'Needs Action'],
      datasets: [{
        data: [
          summary.approved,
          summary.pending,
          summary.denied,
          summary.needsAction
        ],
        backgroundColor: [
          '#1F9D55',
          '#E8A317',
          '#DC3545',
          '#7C3AED'
        ],
        borderWidth: 0,
        hoverOffset: 6
      }]
    };

    // Update Line Chart
    this.updateTrendChart(filteredClaims);
  }

  // Pagination
  totalPages = computed(() =>
    Math.max(
      1,
      Math.ceil(this.filteredClaims().length / this.pageSize())
    )
  );

  loadClaimsSummary(): void {
    this.claimsService.getClaimsSummary().subscribe({
      next: (data) => {
        this.summary.set({
          total: data.total,
          pending: data.byStatus['Pending'] ?? 0,
          approved: data.byStatus['Approved'] ?? 0,
          denied: data.byStatus['Denied'] ?? 0,
          needsAction: data.byStatus['Needs Action'] ?? 0
        });
        this.doughnutChartData = {
          labels: ['Approved', 'Pending', 'Denied', 'Needs Action'],
          datasets: [
            {
              data: [
                data.byStatus['Approved'] ?? 0,
                data.byStatus['Pending'] ?? 0,
                data.byStatus['Denied'] ?? 0,
                data.byStatus['Needs Action'] ?? 0
              ],
              backgroundColor: [
                '#1F9D55',
                '#E8A317',
                '#DC3545',
                '#7C3AED'
              ],
              borderWidth: 0,
              hoverOffset: 6
            }
          ]
        };

      },
      error: (error) => {
        console.error('Error loading claims summary:', error);
      }
    });
  }
  paginatedClaims = computed(() => {
    const startIndex =
      (this.currentPage() - 1) * this.pageSize();

    return this.filteredClaims().slice(
      startIndex,
      startIndex + this.pageSize()
    );
  });

  getClaimPercentage(count: number): number {
    const total = this.summary().total;

    if (!total) {
      return 0;
    }

    return Math.round((count / total) * 100);
  }
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

  // Clear All Filters
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
  previousPage(): void {
    this.changePage(this.currentPage() - 1);
  }

  nextPage(): void {
    this.changePage(this.currentPage() + 1);
  }

  changePage(page: number): void {
    if (page >= 1 && page <= this.totalPages()) {
      this.currentPage.set(page);
    }
  }

  getPageNumbers(): number[] {
    return Array.from(
      { length: this.totalPages() },
      (_, index) => index + 1
    );
  }

  // Pagination Information
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

  // Page Size Change
  onPageSizeChange(value: string): void {
    const size = Number(value);

    if (Number.isFinite(size) && size > 0) {
      this.pageSize.set(size);
      this.currentPage.set(1);
    }
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

  // Status CSS Class
  getStatusClass(status: string): string {
    switch (status) {
      case 'Approved':
        return 'approved';

      case 'Pending':
        return 'pending';

      case 'Denied':
        return 'denied';

      case 'Needs Action':
        return 'needs-action';

      default:
        return '';
    }
  }

  // Analytics Helpers
  getPayerCount(payer: string): number {
    return this.claims().filter(
      claim => claim.payer === payer
    ).length;
  }

  getPayerPercentage(payer: string): number {
    const total = this.claims().length;

    if (total === 0) {
      return 0;
    }

    return (this.getPayerCount(payer) / total) * 100;
  }
}
