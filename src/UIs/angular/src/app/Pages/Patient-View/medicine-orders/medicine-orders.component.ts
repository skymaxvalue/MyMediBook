import { CommonModule } from "@angular/common";
import { Component } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { MedicineOrder } from "src/app/core/Models/Patient-Model";
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { Store } from "@ngrx/store";
import { AppState } from "src/app/Store/app.state";
import { getAllMecineDetailByPatientID } from "src/app/Store/Patient/patient.action";
import { ToastService } from "src/app/shared/Components/Toaster/toast.service";

@Component({
  selector: "app-medicine-orders",
  imports: [CommonModule, FormsModule],
  templateUrl: "./medicine-orders.component.html",
  styleUrl: "./medicine-orders.component.css",
})
export class MedicineOrdersComponent {
  currentPage = 1;
  readonly perPage = 5;
  isShowDetailMedicin: boolean = false;
  searchText = '';
  sortValue = '';
  loginUser = JSON.parse(localStorage.getItem('user') || "null")
  selectedOrder: MedicineOrder | null = null;

  orders: MedicineOrder[] = [
    {
      id: 1,
      patient: 'Ramesh',
      medicine: 'Amoxicillin',
      strength: '500mg',
      instructions: '1 Tablet Morning | 1 Tablet Night',
      date: '2026-04-21',
      doctor: 'Dr. Arun',
      status: 'Ready',
      address: 'ABC Pharmacy',
      image: 'assets/images/user.png',
      refill: false
    },
    {
      id: 2,
      patient: 'Self',
      medicine: 'Zovirax',
      strength: '200mg',
      instructions: '1 Tablet Morning',
      date: '2026-05-01',
      doctor: 'Dr. Tarun',
      status: 'In Transit',
      address: 'CBC Pharmacy',
      image: 'assets/images/user.png',
      refill: true
    },
    {
      id: 3,
      patient: 'Suresh',
      medicine: 'Paracetamol',
      strength: '650mg',
      instructions: 'After Food',
      date: '2026-03-15',
      doctor: 'Dr. Mehta',
      status: 'Ready',
      address: 'City Care Pharmacy',
      image: 'assets/images/user.png',
      refill: true
    },
    {
      id: 4,
      patient: 'Anjali',
      medicine: 'Azithromycin',
      strength: '250mg',
      instructions: 'Once Daily',
      date: '2026-02-10',
      doctor: 'Dr. Patel',
      status: 'In Transit',
      address: 'LifeLine Pharmacy',
      image: 'assets/images/user.png',
      refill: false
    },
    {
      id: 5,
      patient: 'Vikram',
      medicine: 'Cetrizine',
      strength: '10mg',
      instructions: 'Night before sleep',
      date: '2026-01-22',
      doctor: 'Dr. Shah',
      status: 'Ready',
      address: 'MedPlus Pharmacy',
      image: 'assets/images/user.png',
      refill: true
    },
    {
      id: 6,
      patient: 'Priya',
      medicine: 'Metformin',
      strength: '500mg',
      instructions: 'Twice Daily',
      date: '2026-04-05',
      doctor: 'Dr. Kulkarni',
      status: 'In Transit',
      address: 'Apollo Pharmacy',
      image: 'assets/images/user.png',
      refill: false
    },
    {
      id: 7,
      patient: 'Amit',
      medicine: 'Ibuprofen',
      strength: '400mg',
      instructions: 'After Meal',
      date: '2026-03-28',
      doctor: 'Dr. Joshi',
      status: 'Ready',
      address: 'HealthPlus Pharmacy',
      image: 'assets/images/user.png',
      refill: true
    },
    {
      id: 8,
      patient: 'Neha',
      medicine: 'Dolo 650',
      strength: '650mg',
      instructions: 'When needed',
      date: '2026-05-10',
      doctor: 'Dr. Deshmukh',
      status: 'In Transit',
      address: 'Wellness Pharmacy',
      image: 'assets/images/user.png',
      refill: false
    },
    {
      id: 9,
      patient: 'Rahul',
      medicine: 'Omeprazole',
      strength: '20mg',
      instructions: 'Before Breakfast',
      date: '2026-02-18',
      doctor: 'Dr. Patil',
      status: 'Ready',
      address: 'Care Pharmacy',
      image: 'assets/images/user.png',
      refill: true
    },
    {
      id: 10,
      patient: 'Sneha',
      medicine: 'Vitamin D3',
      strength: '60K IU',
      instructions: 'Weekly once',
      date: '2026-06-01',
      doctor: 'Dr. Kulkarni',
      status: 'In Transit',
      address: 'Metro Pharmacy',
      image: 'assets/images/user.png',
      refill: false
    }
  ];;

  filteredOrders: MedicineOrder[] = [];

  constructor(private store: Store<AppState>, private toast: ToastService) {

  }
  ngOnInit(): void {
    this.filteredOrders = [...this.orders];
    this.applyFilters();
    this.store.dispatch(getAllMecineDetailByPatientID({ patientId: this.loginUser.patientId }))
  }

  get pagedOrders(): MedicineOrder[] {
    const start = (this.currentPage - 1) * this.perPage;
    return this.filteredOrders.slice(start, start + this.perPage);
  }

  get totalOrders(): number {
    return this.orders.length;
  }

  get readyOrders(): number {
    return this.orders.filter(x => x.status === 'Ready').length;
  }

  get transitOrders(): number {
    return this.orders.filter(x => x.status === 'In Transit').length;
  }

  clearSearch(): void {
    this.searchText = '';
    this.applyFilters();
  }

  // searchOrders(): void {

  //   const value = this.searchText.toLowerCase();

  //   this.filteredOrders = this.orders.filter(order =>
  //     order.patient.toLowerCase().includes(value) ||
  //     order.medicine.toLowerCase().includes(value) ||
  //     order.doctor.toLowerCase().includes(value)
  //   );

  //   this.currentPage = 1;
  // }

  sortOrders(): void {

    switch (this.sortValue) {

      case 'nameAsc':
        this.filteredOrders.sort((a, b) =>
          a.patient.localeCompare(b.patient));
        break;

      case 'nameDesc':
        this.filteredOrders.sort((a, b) =>
          b.patient.localeCompare(a.patient));
        break;

      case 'ready':
        this.filteredOrders.sort((a, b) =>
          a.status === 'Ready' ? -1 : 1);
        break;

      case 'transit':
        this.filteredOrders.sort((a, b) =>
          a.status === 'In Transit' ? -1 : 1);
        break;

      case 'newest':
        this.filteredOrders.sort((a, b) =>
          new Date(b.date).getTime() -
          new Date(a.date).getTime());
        break;

      case 'oldest':
        this.filteredOrders.sort((a, b) =>
          new Date(a.date).getTime() -
          new Date(b.date).getTime());
        break;
    }
  }

  requestRefill(order: MedicineOrder): void {
    this.toast.info('Info', `Refill request submitted for ${order.medicine}`);
  }

  openMap(address: string): void {
    window.open(
      `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`,
      '_blank'
    );
  }

  downloadPDF() {

    const data = document.getElementById('printArea');

    if (!data) {
      return;
    }

    html2canvas(data, {
      scale: 2,
      useCORS: true
    }).then(canvas => {

      const imgWidth = 210;
      const pageHeight = 295;

      const imgHeight = canvas.height * imgWidth / canvas.width;

      let heightLeft = imgHeight;

      const contentDataURL = canvas.toDataURL('image/png');

      const pdf = new jsPDF('p', 'mm', 'a4');

      let position = 0;

      pdf.addImage(
        contentDataURL,
        'PNG',
        0,
        position,
        imgWidth,
        imgHeight
      );

      heightLeft -= pageHeight;

      while (heightLeft > 0) {
        position = heightLeft - imgHeight;

        pdf.addPage();

        pdf.addImage(
          contentDataURL,
          'PNG',
          0,
          position,
          imgWidth,
          imgHeight
        );

        heightLeft -= pageHeight;
      }

      pdf.save(`medicine-order of ${this.selectedOrder?.patient}.pdf`);

    });
  }

  printDetails() {

    const printContents = document.getElementById('printArea')?.innerHTML;

    if (!printContents) {
      return;
    }

    const popupWindow = window.open('', '_blank', 'width=900,height=700');

    popupWindow?.document.open();

    popupWindow?.document.write(`
    <html>
      <head>
        <title>${this.selectedOrder?.patient}</title>

        <style>

          body{
            font-family:Arial, sans-serif;
            padding:30px;
          }

          h2{
            text-align:center;
            margin-bottom:20px;
          }

          p{
            font-size:16px;
            margin-bottom:15px;
          }

          strong{
            font-weight:bold;
          }

        </style>

      </head>

      <body>

        ${printContents}

      </body>

    </html>
  `);

    popupWindow?.document.close();

    popupWindow?.focus();

    popupWindow?.print();

    popupWindow?.close();

  }

  showDetails(order: MedicineOrder): void {
    this.selectedOrder = order;
    this.isShowDetailMedicin = true;
  }
  closeMedicineDetails() {
    this.isShowDetailMedicin = false
  }

  nextPage(): void {

    if (
      this.currentPage <
      Math.ceil(this.filteredOrders.length / this.perPage)
    ) {
      this.currentPage++;
    }
  }

  onSearchChange(): void {
    this.applyFilters();
  }

  onSortChange(): void {
    this.applyFilters();
  }

  applyFilters(): void {

    let data = [...this.orders];

    // SEARCH
    const value = this.searchText.trim().toLowerCase();

    if (value) {
      data = data.filter(order =>
        order.patient.toLowerCase().includes(value) ||
        order.medicine.toLowerCase().includes(value) ||
        order.doctor.toLowerCase().includes(value)
      );
    }

    // SORT
    switch (this.sortValue) {

      case 'nameAsc':
        data.sort((a, b) => a.patient.localeCompare(b.patient));
        break;

      case 'nameDesc':
        data.sort((a, b) => b.patient.localeCompare(a.patient));
        break;

      case 'ready':
        data = data.filter(x => x.status === 'Ready');
        break;

      case 'transit':
        data = data.filter(x => x.status === 'In Transit');
        break;

      case 'newest':
        data.sort((a, b) =>
          new Date(b.date).getTime() - new Date(a.date).getTime()
        );
        break;

      case 'oldest':
        data.sort((a, b) =>
          new Date(a.date).getTime() - new Date(b.date).getTime()
        );
        break;
    }

    this.filteredOrders = data;
    this.currentPage = 1;
  }

  prevPage(): void {

    if (this.currentPage > 1) {
      this.currentPage--;
    }
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




}
