import {
  ChangeDetectionStrategy,
  Component,
  computed,
  ElementRef,
  signal,
  ViewChild
} from '@angular/core';

import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { Store } from '@ngrx/store';
import { AppState } from 'src/app/Store/app.state';

import { LabResultModel } from 'src/app/core/Models/lab-result.model';

import { getMyLabResults } from 'src/app/Store/Lab-Results/lab-result.actions';
import { selectMyAllLabResultList } from 'src/app/Store/Lab-Results/lab-result.selcetors';
import { PdfService } from 'src/app/core/Services/pdf.service';

// IMPORTANT:
// इथे तुमच्या project मधील actual selector import करा.
// उदाहरण:
// import { selectMyLabResults } from 'src/app/Store/Lab-Results/lab-result.selectors';


type SortField =
  | 'patientName'
  | 'testName'
  | 'reportDate'
  | '';

type SortDirection =
  | 'asc'
  | 'desc';


@Component({
  selector: 'app-lab-result',

  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule
  ],

  templateUrl: './lab-result.component.html',
  styleUrl: './lab-result.component.css',

  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LabResultComponent {
  @ViewChild('labReportPdf')
  labReportPdf!: ElementRef<HTMLElement>;
  loginUser = JSON.parse(
    localStorage.getItem('user') || 'null'
  );


  results = signal<LabResultModel[]>([]);

  searchText = signal('');

  selectedSort = signal('');

  sortField = signal<SortField>('');

  sortDirection = signal<SortDirection>('asc');

  currentPage = signal(1);

  readonly pageSize = 5;

  selectedResult = signal<LabResultModel | null>(null);

  showModal = signal(false);


  constructor(
    private store: Store<AppState>,
    private pdfService: PdfService
  ) {

    this.store.dispatch(
      getMyLabResults({
        patientId: this.loginUser.refId
      })
    );

  }


  ngOnInit(): void {




    this.store
      .select(selectMyAllLabResultList)
      .subscribe((res: LabResultModel[]) => {

        if (res && Array.isArray(res)) {
          this.results.set(res);
          this.currentPage.set(1);
        }

      });


  }



  totalTests = computed(() =>
    this.results().length
  );


  enteredTests = computed(() =>
    this.results().filter(
      x => x.resultStatus === 'Entered'
    ).length
  );




  normalTests = computed(() =>
    this.results().filter(
      x => this.getStatusText(x) === 'Normal'
    ).length
  );


  criticalTests = computed(() =>
    this.results().filter(
      x => this.getStatusText(x) === 'Critical'
    ).length
  );


  pendingTests = computed(() =>
    this.results().filter(
      x =>
        x.resultStatus?.toLowerCase() === 'pending'
    ).length
  );


  reportsReady = computed(() =>
    this.results().filter(
      x =>
        x.resultStatus?.toLowerCase() !== 'pending'
    ).length
  );




  filteredResults = computed(() => {

    const keyword =
      this.searchText()
        .trim()
        .toLowerCase();

    let data = [...this.results()];


    // SEARCH
    if (keyword) {

      data = data.filter(item =>

        item.patientName
          ?.toLowerCase()
          .includes(keyword)

        ||

        item.testName
          ?.toLowerCase()
          .includes(keyword)

        ||

        item.testCode
          ?.toLowerCase()
          .includes(keyword)

        ||

        item.labName
          ?.toLowerCase()
          .includes(keyword)

        ||

        item.resultId
          ?.toString()
          .includes(keyword)

      );

    }




    const field = this.sortField();


    if (field) {

      data.sort((a, b) => {

        let valueA: any = a[field];

        let valueB: any = b[field];


        if (field === 'reportDate') {

          valueA =
            new Date(valueA).getTime();

          valueB =
            new Date(valueB).getTime();

        }

        else {

          valueA =
            (valueA ?? '')
              .toString()
              .toLowerCase();

          valueB =
            (valueB ?? '')
              .toString()
              .toLowerCase();

        }


        if (valueA === valueB) {
          return 0;
        }


        const result =
          valueA > valueB ? 1 : -1;


        return this.sortDirection() === 'asc'
          ? result
          : -result;

      });

    }


    return data;

  });



  totalPages = computed(() =>
    Math.max(
      1,
      Math.ceil(
        this.filteredResults().length /
        this.pageSize
      )
    )
  );


  paginatedResults = computed(() => {

    const start =
      (this.currentPage() - 1) *
      this.pageSize;


    return this.filteredResults()
      .slice(
        start,
        start + this.pageSize
      );

  });



  onSearch(value: string): void {

    this.searchText.set(value);

    this.currentPage.set(1);

  }


  async downloadLabReport(): Promise<void> {

    if (!this.selectedResult()) {
      return;
    }

    const element = this.labReportPdf.nativeElement;

    await this.pdfService.downloadPdf(
      element,
      `Lab-Report-${this.selectedResult()?.testCode || 'Report'}.pdf`
    );
  }

  sortBy(value: string): void {

    this.selectedSort.set(value);


    switch (value) {

      case 'nameAsc':

        this.sortField.set('patientName');

        this.sortDirection.set('asc');

        break;


      case 'nameDesc':

        this.sortField.set('patientName');

        this.sortDirection.set('desc');

        break;


      case 'newest':

        this.sortField.set('reportDate');

        this.sortDirection.set('desc');

        break;


      case 'oldest':

        this.sortField.set('reportDate');

        this.sortDirection.set('asc');

        break;


      case 'testAsc':

        this.sortField.set('testName');

        this.sortDirection.set('asc');

        break;


      case 'testDesc':

        this.sortField.set('testName');

        this.sortDirection.set('desc');

        break;


      default:

        this.sortField.set('');

        break;

    }


    this.currentPage.set(1);

  }



  sortColumn(field: SortField): void {

    if (!field) {
      return;
    }


    if (this.sortField() === field) {

      this.sortDirection.set(

        this.sortDirection() === 'asc'
          ? 'desc'
          : 'asc'

      );

    }

    else {

      this.sortField.set(field);

      this.sortDirection.set('asc');

    }


    this.currentPage.set(1);

  }



  getArrow(field: SortField): string {

    if (this.sortField() !== field) {

      return '▼';

    }


    return this.sortDirection() === 'asc'
      ? '▲'
      : '▼';

  }



  nextPage(): void {

    if (
      this.currentPage() <
      this.totalPages()
    ) {

      this.currentPage.update(
        page => page + 1
      );

    }

  }


  previousPage(): void {

    if (
      this.currentPage() > 1
    ) {

      this.currentPage.update(
        page => page - 1
      );

    }

  }



  openDetails(
    item: LabResultModel
  ): void {

    this.selectedResult.set(item);

    this.showModal.set(true);

  }


  closeModal(): void {

    this.showModal.set(false);

    this.selectedResult.set(null);

  }


  getStatusText(
    item: LabResultModel
  ): string {

    return item.resultStatus || 'Entered';

  }


  getStatusClass(
    item: LabResultModel
  ): string {

    const status =
      this.getStatusText(item)
        .toLowerCase();


    if (status === 'normal') {

      return 'status-normal';

    }


    if (status === 'critical') {

      return 'status-critical';

    }


    if (status === 'pending') {

      return 'status-pending';

    }


    return 'status-entered';

  }

  getResultStatus(
    item: LabResultModel
  ): 'Normal' | 'Critical' | 'Pending' {


    if (!item.resultValue || !item.referenceRange) {
      return 'Pending';
    }

    const value = parseFloat(item.resultValue);

    if (isNaN(value)) {
      return 'Pending';
    }

    const range = item.referenceRange
      .replace(/,/g, '')
      .toLowerCase()
      .trim();


    const rangeMatch = range.match(
      /(\d+(?:\.\d+)?)\s*-\s*(\d+(?:\.\d+)?)/
    );

    if (rangeMatch) {

      const min = parseFloat(rangeMatch[1]);
      const max = parseFloat(rangeMatch[2]);

      return value >= min && value <= max
        ? 'Normal'
        : 'Critical';
    }


    const lessMatch = range.match(
      /<\s*(\d+(?:\.\d+)?)/
    );

    if (lessMatch) {

      const max = parseFloat(lessMatch[1]);

      return value < max
        ? 'Normal'
        : 'Critical';
    }

    // Example: > 40 mg/dL
    const greaterMatch = range.match(
      />\s*(\d+(?:\.\d+)?)/
    );

    if (greaterMatch) {

      const min = parseFloat(greaterMatch[1]);

      return value > min
        ? 'Normal'
        : 'Critical';
    }

    return 'Pending';
  }



  formatDate(date: string): string {

    if (!date) {
      return '';
    }


    return new Date(date)
      .toLocaleDateString(
        'en-GB',
        {
          day: '2-digit',
          month: 'short',
          year: 'numeric'
        }
      );

  }

}