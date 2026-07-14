import {
  Component,
  computed,
  signal,
  ViewChild,
  ElementRef,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

declare var bootstrap: any;
declare var html2pdf: any;

interface Bill {
  id: number;
  patient: string;
  visitDate: string;
  doctor: string;
  clinicAddress: string;
  totalCharge: number;
  insuranceCovered: number;
  adjustments: number;
  patientResponsibility: number;
  paymentDate: string;
  remainingBalance: number;
  image: string;
}
@Component({
  selector: "app-billing",
  imports: [CommonModule, FormsModule],
  templateUrl: "./billing.component.html",
  styleUrl: "./billing.component.css",
})
export class BillingComponent {
  @ViewChild('detailsModal')
  detailsModal!: ElementRef;

  @ViewChild('printArea')
  printArea!: ElementRef;

  bills = signal<Bill[]>([
    {
      id: 1,
      patient: 'Ramesh',
      visitDate: '2026-05-01',
      doctor: 'Dr. Arun',
      clinicAddress: 'ABC Medical Center',
      totalCharge: 500,
      insuranceCovered: 300,
      adjustments: 50,
      patientResponsibility: 150,
      paymentDate: '2026-05-05',
      remainingBalance: 0,
      image: '/assets/images/user.png'
    },
    {
      id: 2,
      patient: 'Self',
      visitDate: '2026-05-08',
      doctor: 'Dr. Tarun',
      clinicAddress: 'City Health Clinic',
      totalCharge: 1200,
      insuranceCovered: 800,
      adjustments: 100,
      patientResponsibility: 300,
      paymentDate: '2026-05-10',
      remainingBalance: 100,
      image: '/assets/images/user.png'
    }
  ]);


  searchText = signal('');

  sortValue = signal('');

  currentPage = signal(1);

  pageSize = signal(5);

  selectedBill = signal<Bill | null>(null);

  sortColumn = signal('');

  sortDirection = signal<'asc' | 'desc'>('asc');


  filteredBills = computed(() => {

    let data = [...this.bills()];

    const search = this.searchText().trim().toLowerCase();

    if (search) {

      data = data.filter(b =>
        b.patient.toLowerCase().includes(search) ||
        b.doctor.toLowerCase().includes(search) ||
        b.clinicAddress.toLowerCase().includes(search)
      );

    }

    switch (this.sortValue()) {

      case 'nameAsc':
        data.sort((a, b) => a.patient.localeCompare(b.patient));
        break;

      case 'nameDesc':
        data.sort((a, b) => b.patient.localeCompare(a.patient));
        break;

      case 'newest':
        data.sort(
          (a, b) =>
            new Date(b.visitDate).getTime() -
            new Date(a.visitDate).getTime()
        );
        break;

      case 'oldest':
        data.sort(
          (a, b) =>
            new Date(a.visitDate).getTime() -
            new Date(b.visitDate).getTime()
        );
        break;
    }

    const column = this.sortColumn();

    if (column) {

      data.sort((a: any, b: any) => {

        let valueA = a[column];
        let valueB = b[column];

        if (column === 'visitDate') {

          valueA = new Date(valueA).getTime();
          valueB = new Date(valueB).getTime();

        } else {

          valueA = String(valueA).toLowerCase();
          valueB = String(valueB).toLowerCase();

        }

        if (valueA === valueB) return 0;

        return this.sortDirection() === 'asc'
          ? valueA > valueB ? 1 : -1
          : valueA < valueB ? 1 : -1;

      });

    }

    return data;

  });


  paginatedBills = computed(() => {

    const start =
      (this.currentPage() - 1) * this.pageSize();

    return this.filteredBills().slice(
      start,
      start + this.pageSize()
    );

  });

  totalPages = computed(() =>
    Math.ceil(
      this.filteredBills().length /
      this.pageSize()
    )
  );


  searchBills() {

    this.currentPage.set(1);

  }

  sortBills() {

    this.currentPage.set(1);

  }

  sortTable(column: string) {

    if (this.sortColumn() === column) {

      this.sortDirection.set(
        this.sortDirection() === 'asc'
          ? 'desc'
          : 'asc'
      );

    } else {

      this.sortColumn.set(column);

      this.sortDirection.set('asc');

    }

  }

  previousPage() {

    if (this.currentPage() > 1) {

      this.currentPage.update(v => v - 1);

    }

  }

  nextPage() {

    if (this.currentPage() < this.totalPages()) {

      this.currentPage.update(v => v + 1);

    }

  }


  getSortIcon(column: string): string {

    if (this.sortColumn() !== column)
      return '▼';

    return this.sortDirection() === 'asc'
      ? '▲'
      : '▼';

  }

  formatDate(date: string): string {

    return new Date(date).toLocaleDateString(
      'en-GB',
      {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      }
    );

  }

  openMap(address: string) {

    window.open(
      `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`,
      '_blank'
    );

  }

  showDetails(bill: Bill) {

    this.selectedBill.set(bill);

    const modal = new bootstrap.Modal(
      this.detailsModal.nativeElement
    );

    modal.show();

  }


  downloadPDF() {

    html2pdf()
      .from(this.printArea.nativeElement)
      .set({
        margin: 10,
        filename: 'billing-invoice.pdf',
        image: {
          type: 'jpeg',
          quality: 1
        },
        html2canvas: {
          scale: 2
        },
        jsPDF: {
          unit: 'mm',
          format: 'a4',
          orientation: 'portrait'
        }
      })
      .save();

  }


  printBill() {

    window.print();

  }

}