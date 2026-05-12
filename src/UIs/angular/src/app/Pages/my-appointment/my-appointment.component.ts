import { CommonModule } from "@angular/common";
import {
  Component,
  computed,
  Input,
  signal
} from "@angular/core";

@Component({
  selector: "app-my-appointment",
  standalone: true,
  imports: [CommonModule],
  templateUrl: "./my-appointment.component.html",
  styleUrl: "./my-appointment.component.css",
})
export class MyAppointmentComponent {

  @Input() tableData: any[] = [];

  sortColumn = signal('');
  sortDirection = signal<'asc' | 'desc'>('asc');

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

  sortedTableData = computed(() => {

    const column = this.sortColumn();
    const direction = this.sortDirection();

    return [...this.tableData].sort((a: any, b: any) => {

      if (!column) {
        return 0;
      }

      const valueA =
        a[column]
          ?.toString()
          .toLowerCase() || '';

      const valueB =
        b[column]
          ?.toString()
          .toLowerCase() || '';

      if (direction === 'asc') {
        return valueA.localeCompare(valueB);
      }

      return valueB.localeCompare(valueA);

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

}