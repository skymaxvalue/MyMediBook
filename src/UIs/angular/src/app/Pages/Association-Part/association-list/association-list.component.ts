import { CommonModule } from "@angular/common";
import { Component, computed, OnInit, signal } from "@angular/core";
import { Router } from "@angular/router";
import { Store } from "@ngrx/store";
import { AppState } from "src/app/Store/app.state";
import { getAllAssociates } from "src/app/Store/Doctor/doctor.action";
import { selectGelAllAssociate } from "src/app/Store/Doctor/doctor.selectors";

interface AssociateSchedule {
  associateId: number;
  firstName: string;
  lastName: string;
  gender: string;
  dateOfBirth: string;
  roleId: number;
  roleName: string;
  departmentId: number;
  departmentName: string;
  specialityId: number;
  specialityName: string;
  designationId: number;
  designationName: string;
  isActive: boolean;
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

  constructor(private router: Router, private store: Store<AppState>) {
    this.store.dispatch(getAllAssociates())
  }

  ngOnInit(): void {

    this.loadRows();
    this.getSelectorData()
  }


  sortedSchedules = computed(() => {
    const rows = [...this.schedules()];

    const column = this.sortColumn();

    if (column === null) return rows;

    // sorting logic

    return rows;
  });
  getSelectorData() {
    this.store.select(selectGelAllAssociate).subscribe((res: any) => {
      if (res) {
        this.schedules.set(res)
      }
    })
  }
  loadRows() {

    // const defaultRows: AssociateSchedule[] = [
    //   {
    //     associateId: 1,
    //     name: 'Kumar Sekhar',
    //     dept: 'Cardiology',
    //     spec: 'EP',
    //     from: '2026-04-24',
    //     to: '2026-05-24',
    //     time: '64 Hours'
    //   },
    //   {
    //     id: 2,
    //     name: 'Julia Doe',
    //     dept: 'Neurology',
    //     spec: 'Epilepsy',
    //     from: '2026-04-24',
    //     to: '2026-05-24',
    //     time: '90 Hours'
    //   }
    // ];

    const data = localStorage.getItem(this.STORAGE_KEY);

    // const rows = data ? JSON.parse(data) : defaultRows;

    // this.schedules.set(rows);
  }
  saveRows() {
    localStorage.setItem(
      this.STORAGE_KEY,
      JSON.stringify(this.schedules())
    );
  }

  edit(id: any, index: number) {
    // this.router.navigate([
    //   '/associate/dashboard/update-association',
    //   row.associateId
    // ]);

    this.router.navigate([`/associate/dashboard/update-association/`, id]);
    // localStorage.setItem(
    //   'associateScheduleSelected',
    //   JSON.stringify({
    //     ...row,
    //     index
    //   })
    // );

    // this.router.navigate(['/associate/dashboard/update-association']);
  }

  openDelete(row: AssociateSchedule) {

    this.deleteRow = row;

    this.showDeleteModal = true;
  }

  deleteConfirmed() {

    if (!this.deleteRow) return;
    this.schedules.update(rows =>
      rows.filter((x: any) => x.associateId !== this.deleteRow!.associateId)
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