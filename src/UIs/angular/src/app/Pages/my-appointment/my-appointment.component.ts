import { CommonModule } from "@angular/common";
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import {
  Component,
  computed,
  EventEmitter,
  Input,
  Output,
  signal
} from "@angular/core";


interface FamilyMember {
  id: number;
  name: string;
  relation: string;
}
@Component({
  selector: "app-my-appointment",
  standalone: true,
  imports: [CommonModule, FormsModule, NgSelectModule],
  templateUrl: "./my-appointment.component.html",
  styleUrl: "./my-appointment.component.css",
})


export class MyAppointmentComponent {

  @Input() tableData: any[] = [];
  @Output() goToSpecialitie = new EventEmitter<void>();
  sortColumn = signal('');
  sortDirection = signal<'asc' | 'desc'>('asc');

  searchText = '';

  selectedMember = signal<FamilyMember | null>(null);
  currentPage = signal(1);
  pageSize = signal(5);

  paginatedAppointments = computed(() => {
    const data = this.filteredAppointments();

    const start =
      (this.currentPage() - 1) * this.pageSize();

    const end = start + this.pageSize();

    return data.slice(start, end);
  });

  familyMembers = [
    {
      id: 1,
      name: 'Self',
      relation: 'Self'
    },
    {
      id: 2,
      name: 'Ramesh',
      relation: 'Father'
    },
    {
      id: 3,
      name: 'Sunita',
      relation: 'Mother'
    },
    {
      id: 4,
      name: 'Rahul',
      relation: 'Brother'
    },
    {
      id: 5,
      name: 'Raman',
      relation: 'Son'
    }
  ];

  totalPages = computed(() => {
    return Math.ceil(
      this.filteredAppointments().length /
      this.pageSize()
    );
  });

  previousPage() {
    if (this.currentPage() > 1) {
      this.currentPage.update(page => page - 1);
    }
  }
  nextPage() {
    if (this.currentPage() < this.totalPages()) {
      this.currentPage.update(page => page + 1);
    }
  }
  // SORT FUNCTION
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
  clearSelection() {
    this.selectedMember.set(null);
  }

  filteredAppointments = computed(() => {

    const member = this.selectedMember();

    if (!member) {
      return this.sortedTableData(); // Show all appointments
    }

    return this.sortedTableData().filter(
      item => item.patientName === member.name
    );

  });

  filteredFamilyMembers = computed(() => {

    const search = this.searchText.toLowerCase();

    if (!search) {
      return this.familyMembers;
    }

    return this.familyMembers.filter(member =>
      member.name.toLowerCase().includes(search)
    );

  });
  selectMember(member: FamilyMember) {
    this.selectedMember.set(member);
  }
  sortedTableData = computed(() => {

    let data = [...this.tableData];

    const member = this.selectedMember();

    if (member) {
      data = data.filter(
        item => item.patientName === member.name
      );
    }

    const column = this.sortColumn();
    const direction = this.sortDirection();

    if (!column) {
      return data;
    }

    return data.sort((a: any, b: any) => {

      const valueA =
        a[column]?.toString().toLowerCase() || '';

      const valueB =
        b[column]?.toString().toLowerCase() || '';

      return direction === 'asc'
        ? valueA.localeCompare(valueB)
        : valueB.localeCompare(valueA);

    });

  });


  getSortIcon(column: string): string {

    if (this.sortColumn() !== column) {
      return '▼';
    }

    return this.sortDirection() === 'asc'
      ? '▲'
      : '▼';

  }
  goToSpecialities() {
    // Implement navigation to the specialities page
    this.goToSpecialitie.emit();
  }



}