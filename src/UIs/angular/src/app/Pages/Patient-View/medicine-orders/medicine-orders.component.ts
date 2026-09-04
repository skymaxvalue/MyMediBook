import { CommonModule } from "@angular/common";
import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { FormsModule } from "@angular/forms";

import { MedicineOrder } from "src/app/core/Models/Patient-Model";

import jsPDF from "jspdf";
import html2canvas from "html2canvas";

import { Store } from "@ngrx/store";
import { AppState } from "src/app/Store/app.state";

import { getAllMecineDetailByPatientID } from "src/app/Store/Patient/patient.action";

import { ToastService } from "src/app/shared/Components/Toaster/toast.service";

import { selectGetAllMedicineDetailsOfPatient } from "src/app/Store/Patient/patient.selectors";
import { PdfService } from "src/app/core/Services/pdf.service";


@Component({
  selector: "app-medicine-orders",
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: "./medicine-orders.component.html",
  styleUrl: "./medicine-orders.component.css",
})
export class MedicineOrdersComponent implements OnInit {
  @ViewChild('prescriptionPdf')
  prescriptionPdf!: ElementRef<HTMLElement>;
  currentPage = 1;

  readonly perPage = 5;



  isShowDetailMedicin = false;

  searchText = "";

  sortValue = "";



  loginUser = JSON.parse(
    localStorage.getItem("user") || "null"
  );




  selectedOrder: MedicineOrder | null = null;



  orders: MedicineOrder[] = [];

  filteredOrders: MedicineOrder[] = [];
  currentYear = new Date().getFullYear();

  constructor(
    private store: Store<AppState>,
    private toast: ToastService,
    private pdfService: PdfService

  ) {



    if (this.loginUser?.refId) {

      this.store.dispatch(
        getAllMecineDetailByPatientID({
          patientId: this.loginUser.refId
        })
      );

    } else {

      console.error("Patient ID not found in localStorage");

    }

  }


  // ==============================
  // NG ON INIT
  // ==============================

  ngOnInit(): void {

    this.store
      .select(selectGetAllMedicineDetailsOfPatient)
      .subscribe((res: MedicineOrder[] | null) => {

        console.log("Medicine API Response:", res);


        if (res && Array.isArray(res)) {

          this.orders = res.map(order => ({

            ...order,

            // UI fields
            refill: false,

            image: "assets/images/user.png"

          }));


          this.filteredOrders = [
            ...this.orders
          ];


          this.applyFilters();

        }

      });

  }


  async downloadPrescriptionPdf(): Promise<void> {

    if (!this.prescriptionPdf) {
      console.error('Prescription PDF element not found');
      return;
    }

    try {

      await this.pdfService.downloadPdf(
        this.prescriptionPdf.nativeElement,
        'Prescription-Order-Summary.pdf'
      );

    } catch (error) {

      console.error(
        'Error while generating prescription PDF:',
        error
      );

    }
  }
  get pagedOrders(): MedicineOrder[] {

    const start =
      (this.currentPage - 1) *
      this.perPage;

    return this.filteredOrders.slice(
      start,
      start + this.perPage
    );

  }


  get totalOrders(): number {

    return this.orders.length;

  }


  get readyOrders(): number {

    return this.orders.filter(
      x => x.orderStatus === "Ready"
    ).length;

  }


  get transitOrders(): number {

    return this.orders.filter(
      x => x.orderStatus === "In Transit"
    ).length;

  }

  clearSearch(): void {

    this.searchText = "";

    this.applyFilters();

  }


  onSearchChange(): void {

    this.applyFilters();

  }


  onSortChange(): void {

    this.applyFilters();

  }


  applyFilters(): void {

    let data: MedicineOrder[] = [
      ...this.orders
    ];

    const value =
      this.searchText
        .trim()
        .toLowerCase();


    if (value) {

      data = data.filter(order =>

        order.patientName
          ?.toLowerCase()
          .includes(value)

        ||

        order.drugName
          ?.toLowerCase()
          .includes(value)

        ||

        order.doctorName
          ?.toLowerCase()
          .includes(value)

        ||

        order.orderId
          ?.toString()
          .includes(value)

      );

    }



    switch (this.sortValue) {


      // Name A-Z
      case "nameAsc":

        data.sort((a, b) =>
          a.patientName.localeCompare(
            b.patientName
          )
        );

        break;


      // Name Z-A
      case "nameDesc":

        data.sort((a, b) =>
          b.patientName.localeCompare(
            a.patientName
          )
        );

        break;


      // Ready
      case "ready":

        data = data.filter(
          x => x.orderStatus === "Ready"
        );

        break;


      // In Transit
      case "transit":

        data = data.filter(
          x => x.orderStatus === "In Transit"
        );

        break;


      // Newest
      case "newest":

        data.sort((a, b) =>

          new Date(b.createdDate).getTime() -

          new Date(a.createdDate).getTime()

        );

        break;


      // Oldest
      case "oldest":

        data.sort((a, b) =>

          new Date(a.createdDate).getTime() -

          new Date(b.createdDate).getTime()

        );

        break;

    }


    this.filteredOrders = data;

    this.currentPage = 1;

  }

  requestRefill(
    order: MedicineOrder
  ): void {

    this.toast.info(
      "Info",
      `Refill request submitted for ${order.drugName}`
    );

  }


  // ==============================
  // GOOGLE MAP
  // ==============================

  openMap(
    address: string
  ): void {

    const url =
      `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;

    window.open(
      url,
      "_blank"
    );

  }


  showDetails(
    order: MedicineOrder
  ): void {

    console.log(
      "Selected Order:",
      order
    );

    console.log(
      "Selected Order ID:",
      order.orderId
    );


    this.selectedOrder = order;

    this.isShowDetailMedicin = true;

  }


  closeMedicineDetails(): void {

    this.isShowDetailMedicin = false;

    this.selectedOrder = null;

  }


  nextPage(): void {

    const totalPages =
      Math.ceil(
        this.filteredOrders.length /
        this.perPage
      );


    if (
      this.currentPage <
      totalPages
    ) {

      this.currentPage++;

    }

  }


  prevPage(): void {

    if (
      this.currentPage > 1
    ) {

      this.currentPage--;

    }

  }


  formatDate(
    date: string
  ): string {

    if (!date) {
      return "";
    }


    return new Date(date).toLocaleDateString(
      "en-GB",
      {
        day: "2-digit",
        month: "short",
        year: "numeric"
      }
    );

  }

  downloadPDF(): void {

    const data =
      document.getElementById(
        "printArea"
      );


    if (!data) {

      console.error(
        "Print area not found"
      );

      return;

    }


    html2canvas(
      data,
      {
        scale: 2,
        useCORS: true
      }
    ).then(canvas => {


      const imgWidth = 210;

      const pageHeight = 295;


      const imgHeight =
        canvas.height *
        imgWidth /
        canvas.width;


      let heightLeft =
        imgHeight;


      const contentDataURL =
        canvas.toDataURL(
          "image/png"
        );


      const pdf =
        new jsPDF(
          "p",
          "mm",
          "a4"
        );


      let position = 0;


      pdf.addImage(
        contentDataURL,
        "PNG",
        0,
        position,
        imgWidth,
        imgHeight
      );


      heightLeft -= pageHeight;


      while (
        heightLeft > 0
      ) {

        position =
          heightLeft -
          imgHeight;


        pdf.addPage();


        pdf.addImage(
          contentDataURL,
          "PNG",
          0,
          position,
          imgWidth,
          imgHeight
        );


        heightLeft -= pageHeight;

      }


      pdf.save(
        `medicine-order-${this.selectedOrder?.orderId}.pdf`
      );

    });

  }



  printDetails(): void {

    const printContents =
      document
        .getElementById(
          "printArea"
        )
        ?.innerHTML;


    if (!printContents) {

      return;

    }


    const popupWindow =
      window.open(
        "",
        "_blank",
        "width=900,height=700"
      );


    popupWindow?.document.open();


    popupWindow?.document.write(`

      <html>

        <head>

          <title>
            Medicine Order ${this.selectedOrder?.orderId}
          </title>

          <style>

            body {
              font-family: Arial, sans-serif;
              padding: 30px;
            }

            h2 {
              text-align: center;
              margin-bottom: 20px;
            }

            p {
              font-size: 16px;
              margin-bottom: 15px;
            }

            strong {
              font-weight: bold;
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

}