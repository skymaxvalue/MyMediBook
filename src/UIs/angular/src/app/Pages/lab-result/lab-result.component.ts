
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  signal
} from '@angular/core';
import { CommonModule } from '@angular/common';



import { LabResult } from "src/app/Models/lab-result.model";

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LabResultService } from 'src/app/Services/lab-result.service';
export const LAB_RESULTS: LabResult[] = [

  {
    id: 1,
    patient: 'Ramesh',
    test: 'Blood Test',
    code: 'B101',
    date: '2026-05-01',
    result: 'Insufficient',
    range: '90 - 110',
    status: 'Normal',
    lab: 'Lab Corp',
    image: 'assets/images/user.png'
  },

  {
    id: 2,
    patient: 'Self',
    test: 'Urine Test',
    code: 'B209',
    date: '2026-05-02',
    result: 'Hemolyzed',
    range: '5 - 12',
    status: 'Critical',
    lab: 'Lab Corp',
    image: 'assets/images/user.png'
  },

  {
    id: 3,
    patient: 'Anita',
    test: 'Thyroid Panel',
    code: 'T401',
    date: '2026-05-03',
    result: 'Pending',
    range: 'Awaiting',
    status: 'Pending',
    lab: 'Health Lab',
    image: 'assets/images/user.png'
  }

]

type SortField = 'patient' | 'test' | 'date' | '';
type SortDirection = 'asc' | 'desc';

@Component({
  selector: "app-lab-result",

  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: "./lab-result.component.html",
  styleUrl: "./lab-result.component.css",
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class LabResultComponent {

  constructor(private service: LabResultService) { }


  selectedSort = signal('');
  selectedReport = signal<any | null>(null);
  results = this.service.getResults();

  searchText = signal('');

  sortField = signal<SortField>('');

  sortDirection = signal<SortDirection>('asc');

  currentPage = signal(1);

  readonly pageSize = 5;

  selectedResult = signal<LabResult | null>(null);

  showModal = signal(false);


  totalTests = computed(() => this.results().length);

  normalTests = computed(() =>
    this.results().filter(x => x.status === 'Normal').length
  );

  criticalTests = computed(() =>
    this.results().filter(x => x.status === 'Critical').length
  );

  pendingTests = computed(() =>
    this.results().filter(x => x.status === 'Pending').length
  );

  reportsReady = computed(() =>
    this.results().filter(x => x.status !== 'Pending').length
  );


  filteredResults = computed(() => {

    const keyword = this.searchText().trim().toLowerCase();

    let data = [...this.results()];

    if (keyword) {

      data = data.filter(item =>

        item.patient.toLowerCase().includes(keyword) ||

        item.test.toLowerCase().includes(keyword) ||

        item.code.toLowerCase().includes(keyword) ||

        item.lab.toLowerCase().includes(keyword)

      );

    }

    const field = this.sortField();

    if (field) {

      data.sort((a, b) => {

        let valueA: any = a[field];

        let valueB: any = b[field];

        if (field === 'date') {

          valueA = new Date(valueA).getTime();

          valueB = new Date(valueB).getTime();

        } else {

          valueA = valueA.toLowerCase();

          valueB = valueB.toLowerCase();

        }

        return this.sortDirection() === 'asc'
          ? valueA > valueB ? 1 : -1
          : valueA < valueB ? 1 : -1;

      });

    }

    return data;

  });
  sortBy(value: string) {

    this.selectedSort.set(value);

    switch (value) {

      case 'nameAsc':
        this.sortField.set('patient');
        this.sortDirection.set('asc');
        break;

      case 'nameDesc':
        this.sortField.set('patient');
        this.sortDirection.set('desc');
        break;

      case 'newest':
        this.sortField.set('date');
        this.sortDirection.set('desc');
        break;

      case 'oldest':
        this.sortField.set('date');
        this.sortDirection.set('asc');
        break;

      case 'testAsc':
        this.sortField.set('test');
        this.sortDirection.set('asc');
        break;

      case 'testDesc':
        this.sortField.set('test');
        this.sortDirection.set('desc');
        break;
    }

    this.currentPage.set(1);

  }

  sortColumn(field: SortField) {

    if (this.sortField() === field) {

      this.sortDirection.set(
        this.sortDirection() === 'asc'
          ? 'desc'
          : 'asc'
      );

    } else {

      this.sortField.set(field);
      this.sortDirection.set('asc');

    }

  }
  totalPages = computed(() =>
    Math.ceil(this.filteredResults().length / this.pageSize)
  );

  paginatedResults = computed(() => {

    const start = (this.currentPage() - 1) * this.pageSize;

    return this.filteredResults().slice(start, start + this.pageSize);

  });


  getArrow(field: SortField): string {

    if (this.sortField() !== field) {

      return '▼';

    }

    return this.sortDirection() === 'asc'
      ? '▲'
      : '▼';

  }
  onSearch(value: string) {

    this.searchText.set(value);

    this.currentPage.set(1);

  }


  sort(field: SortField) {

    if (this.sortField() === field) {

      this.sortDirection.set(

        this.sortDirection() === 'asc'
          ? 'desc'
          : 'asc'

      );

    } else {

      this.sortField.set(field);

      this.sortDirection.set('asc');

    }

  }


  nextPage() {

    if (this.currentPage() < this.totalPages()) {

      this.currentPage.update(x => x + 1);

    }

  }

  previousPage() {

    if (this.currentPage() > 1) {

      this.currentPage.update(x => x - 1);

    }

  }

  openDetails(item: LabResult) {

    this.selectedResult.set(item);

    this.showModal.set(true);

  }

  closeModal() {

    this.showModal.set(false);

    this.selectedResult.set(null);

  }

  // -----------------------
  // Status Class
  // -----------------------

  getStatusClass(status: string) {

    switch (status) {

      case 'Normal':
        return 'status-normal';

      case 'Critical':
        return 'status-critical';

      case 'Pending':
        return 'status-pending';

      default:
        return '';

    }

  }

  // -----------------------
  // Format Date
  // -----------------------

  formatDate(date: string) {

    return new Date(date).toLocaleDateString('en-GB', {

      day: '2-digit',

      month: 'short',

      year: 'numeric'

    });

  }

}