import { CommonModule } from "@angular/common";
import { Component, computed, OnInit, signal } from "@angular/core";
import { Router } from "@angular/router";
import { Store } from "@ngrx/store";
import { AppState } from "src/app/Store/app.state";
import { getAllAssociates } from "src/app/Store/Doctor/doctor.action";

interface AssociateSchedule {
  id: number;
  name: string;
  dept: string;
  spec: string;
  from: string;
  to: string;
  time: string;
}


@Component({
  selector: "app-association-list",
  imports: [CommonModule],
  templateUrl: "./association-list.component.html",
  styleUrl: "./association-list.component.css",
})
export class AssociationListComponent implements OnInit {
  schedules = signal<AssociateSchedule[]>([]);

  sortColumn = signal<number | null>(null);
  ascending = signal(true);
  readonly STORAGE_KEY = 'associateScheduleDatabaseRows';



  deleteRow: AssociateSchedule | null = null;

  showDeleteModal = false;

  sortDirection: { [key: number]: boolean } = {};

  constructor(private router: Router, private store: Store<AppState>) { }

  ngOnInit(): void {
    // this.store.dispatch(getAllAssociates())
    this.loadRows();
  }

  sortedSchedules = computed(() => {
    const rows = [...this.schedules()];

    const column = this.sortColumn();

    if (column === null) return rows;

    // sorting logic

    return rows;
  });
  loadRows() {

    const defaultRows: AssociateSchedule[] = [
      {
        id: 1,
        name: 'Kumar Sekhar',
        dept: 'Cardiology',
        spec: 'EP',
        from: '2026-04-24',
        to: '2026-05-24',
        time: '64 Hours'
      },
      {
        id: 2,
        name: 'Julia Doe',
        dept: 'Neurology',
        spec: 'Epilepsy',
        from: '2026-04-24',
        to: '2026-05-24',
        time: '90 Hours'
      }
    ];

    const data = localStorage.getItem(this.STORAGE_KEY);

    const rows = data ? JSON.parse(data) : defaultRows;

    this.schedules.set(rows);
  }
  saveRows() {
    localStorage.setItem(
      this.STORAGE_KEY,
      JSON.stringify(this.schedules())
    );
  }

  edit(row: AssociateSchedule, index: number) {

    localStorage.setItem(
      'associateScheduleSelected',
      JSON.stringify({
        ...row,
        index
      })
    );

    this.router.navigate(['/associate/dashboard/update-association']);
  }

  openDelete(row: AssociateSchedule) {

    this.deleteRow = row;

    this.showDeleteModal = true;
  }

  deleteConfirmed() {

    if (!this.deleteRow) return;
    this.schedules.update(rows =>
      rows.filter(x => x.id !== this.deleteRow!.id)
    );

    this.saveRows();

    this.closeModal();
  }

  closeModal() {

    this.showDeleteModal = false;

    this.deleteRow = null;
  }

  sort(column: number) {

    this.sortDirection[column] = !this.sortDirection[column];

    const asc = this.sortDirection[column];

    const fields = [
      'name',
      'dept',
      'spec',
      'from',
      'to',
      'time'
    ];

    const field = fields[column];

    const rows = [...this.schedules()];

    rows.sort((a: any, b: any) => {

      let valA = a[field];

      let valB = b[field];

      if (column === 3 || column === 4) {

        valA = new Date(valA).getTime();

        valB = new Date(valB).getTime();
      }

      if (column === 5) {

        valA = parseInt(valA);

        valB = parseInt(valB);
      }

      if (typeof valA === 'string') {

        valA = valA.toLowerCase();

        valB = valB.toLowerCase();
      }

      return asc
        ? valA > valB ? 1 : -1
        : valA < valB ? 1 : -1;
    });
  }

}