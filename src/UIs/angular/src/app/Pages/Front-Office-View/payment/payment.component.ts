
import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  ViewEncapsulation
} from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Subject, takeUntil } from 'rxjs';
import { ISearchPatientRequestModel, ISearchPatientResponseModel } from 'src/app/core/Models/common/search-patient.model';

import * as PaymentActions from 'src/app/Store/Payment/payment.actions';
import * as PaymentSelectors from 'src/app/Store/Payment/payment.selectors';

interface Patient {
  id: string;
  mrn: string;
  firstName: string;
  lastName: string;
  dob: string;
  gender: string;
  phone: string;
  insurance?: string;
  memberId?: string;
  address?: string;
}

interface PaymentRecord {
  id: string;
  patientId: string;
  doctor: string;
  feeType: string;
  description: string;
  amount: number;
  status: 'Paid' | 'Unpaid';
  demo?: boolean;
  transactionRef?: string;
  paymentMethod?: string;
  paidAt?: string;
}

interface CardDetails {
  brand: string;
  last4: string;
  decline: boolean;
}

interface PaymentResult {
  ok: boolean;
  ref?: string;
  reason?: string;
  method: string;
}

interface ZipRule {
  label: string;
  placeholder: string;
  re: RegExp;
  msg: string;
}

@Component({
  selector: 'app-payment',
  standalone: true,
  imports: [],
  templateUrl: './payment.component.html',
  styleUrl: './payment.component.css',
  encapsulation: ViewEncapsulation.None
})
export class PaymentComponent implements AfterViewInit, OnDestroy {

  private readonly PATIENTS_KEY = 'labServicePatients_v1';
  private readonly RECORDS_KEY = 'paymentRecords_v1';
  private readonly COUNTER_KEY = 'paymentTransactionCounter_v1';
  readonly patients$ = this.store.select(PaymentSelectors.selectPatients);
  readonly loading$ = this.store.select(PaymentSelectors.selectPaymentLoading);
  readonly error$ = this.store.select(PaymentSelectors.selectPaymentError);
  private destroy$ = new Subject<void>();
  private readonly STEP_LABELS = [
    'Select Patient',
    'Payment',
    'Invoice Summary',
    'Confirmation'
  ];

  private readonly SUBTITLES = [
    'Search and select a patient to process payment.',
    'Complete the payment details to generate the invoice.',
    'Review the invoice before confirming the payment.',
    'Payment outcome'
  ];

  private readonly PROVIDERS: Record<string, string> = {
    card: 'Card',
    paypal: 'PayPal',
    venmo: 'Venmo',
    gpay: 'Google Pay'
  };

  private readonly ZIP_RULES: Record<string, ZipRule> = {
    US: {
      label: 'ZIP Code',
      placeholder: 'ZIP Code',
      re: /^\d{5}(-\d{4})?$/,
      msg: 'Enter a valid ZIP code (12345 or 12345-6789).'
    },
    IN: {
      label: 'PIN Code',
      placeholder: 'PIN Code',
      re: /^\d{6}$/,
      msg: 'Enter a valid 6-digit PIN code.'
    },
    GB: {
      label: 'Postcode',
      placeholder: 'Postcode',
      re: /^[A-Z]{1,2}\d[A-Z\d]? ?\d[A-Z]{2}$/i,
      msg: 'Enter a valid UK postcode.'
    },
    CA: {
      label: 'Postal Code',
      placeholder: 'Postal Code',
      re: /^[A-Z]\d[A-Z] ?\d[A-Z]\d$/i,
      msg: 'Enter a valid postal code (A1A 1A1).'
    },
    AU: {
      label: 'Postcode',
      placeholder: 'Postcode',
      re: /^\d{4}$/,
      msg: 'Enter a valid 4-digit postcode.'
    },
    SG: {
      label: 'Postal Code',
      placeholder: 'Postal Code',
      re: /^\d{6}$/,
      msg: 'Enter a valid 6-digit postal code.'
    },
    AE: {
      label: 'Postal Code',
      placeholder: 'Postal Code',
      re: /^[A-Za-z0-9 -]{3,10}$/,
      msg: 'Enter a valid postal code.'
    }
  };

  private state = {
    step: 1,
    patient: null as Patient | null,
    record: null as PaymentRecord | null,
    method: 'card',
    provider: 'card',
    card: null as CardDetails | null,
    cashConfirmed: false,
    processing: false,
    result: null as PaymentResult | null
  };

  private memoryRecords: PaymentRecord[] | null = null;
  private activeIndex = -1;
  private debounceTimer: ReturnType<typeof setTimeout> | null = null;
  private processingTimer: ReturnType<typeof setTimeout> | null = null;
  private modalReturnFocus: HTMLElement | null = null;
  private listeners: Array<() => void> = [];
  private modalKeyHandler?: (event: KeyboardEvent) => void;
  private hasSearched = false;
  searchResults: Patient[] = [];

  constructor(
    private readonly elementRef: ElementRef<HTMLElement>,
    private readonly router: Router,
    private readonly store: Store
  ) { }

  ngOnInit(): void {
    this.patients$
      .pipe(takeUntil(this.destroy$))
      .subscribe((patients: ISearchPatientResponseModel[]) => {

        this.searchResults = (patients || []).map(patient => ({
          id: String(patient.patientId),
          firstName: patient.firstName || '',
          lastName: patient.lastName || '',
          dob: patient.dateOfBirth || '',
          gender: patient.gender || '',
          phone: patient.phoneNumber || '',
          mrn: '',
          address: ''
        }));

        if (this.hasSearched) {
          this.renderResults(this.searchResults);
        }
      });
  }

  ngAfterViewInit(): void {
    this.initializePayment();
  }

  ngOnDestroy(): void {
    this.clearTimers();
    this.clearSensitive();

    this.listeners.forEach(remove => remove());
    this.listeners = [];

    if (this.modalKeyHandler) {
      document.removeEventListener('keydown', this.modalKeyHandler);
    }
  }

  private get root(): HTMLElement {
    return this.elementRef.nativeElement;
  }

  private $(id: string): HTMLElement {
    const element = this.root.querySelector<HTMLElement>('#' + id);

    if (!element) {
      throw new Error(`Payment element not found: #${id}`);
    }

    return element;
  }

  private optional(id: string): HTMLElement | null {
    return this.root.querySelector<HTMLElement>('#' + id);
  }

  private input(id: string): HTMLInputElement {
    return this.$(id) as HTMLInputElement;
  }

  private select(id: string): HTMLSelectElement {
    return this.$(id) as HTMLSelectElement;
  }

  private listen(
    target: EventTarget,
    eventName: string,
    handler: EventListener
  ): void {
    target.addEventListener(eventName, handler);

    this.listeners.push(() => {
      target.removeEventListener(eventName, handler);
    });
  }

  private initializePayment(): void {
    this.input('patientDobSearch').max = new Date()
      .toISOString()
      .slice(0, 10);

    this.initializeSearch();
    this.initializeRecords();
    this.initializeCardInputs();
    this.initializeNavigation();

    this.updateZipField();
    this.renderRecords();
    this.updateStepper();
  }

  private clearTimers(): void {
    if (this.debounceTimer) {
      clearTimeout(this.debounceTimer);
      this.debounceTimer = null;
    }

    if (this.processingTimer) {
      clearTimeout(this.processingTimer);
      this.processingTimer = null;
    }
  }

  // -------------------------------------------------------
  // COMMON HELPERS
  // -------------------------------------------------------

  private escape(value: unknown): string {
    return String(value ?? '').replace(/[&<>"']/g, char => {
      const entities: Record<string, string> = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;'
      };

      return entities[char];
    });
  }

  private money(amount: number): string {
    return 'Rs ' + Number(amount).toLocaleString('en-IN');
  }

  private formatDob(iso: string): string {
    if (!iso) return '—';

    const parts = String(iso).split('-');

    return parts.length === 3
      ? `${parts[2]}/${parts[1]}/${parts[0]}`
      : iso;
  }

  private fullName(patient: Patient): string {
    return `${patient.firstName} ${patient.lastName}`;
  }

  private digitsOf(value: string): string {
    return String(value || '').replace(/\D/g, '');
  }

  private normalizePhone(value: string): string {
    return String(value || '').replace(/\D/g, '');
  }

  private announce(message: string): void {
    const live = this.optional('payLive');

    if (!live) return;

    live.textContent = '';

    window.setTimeout(() => {
      if (live.isConnected) {
        live.textContent = message;
      }
    }, 30);
  }

  // -------------------------------------------------------
  // PATIENT DATA
  // -------------------------------------------------------

  private seedPatients(): Patient[] {
    return [
      {
        id: 'p1',
        mrn: 'MRN-000001',
        firstName: 'Rajesh',
        lastName: 'Sharma',
        dob: '1990-05-12',
        gender: 'Male',
        phone: '9998887770',
        insurance: 'Star Health',
        memberId: 'SH-778215'
      },
      {
        id: 'p2',
        mrn: 'MRN-000002',
        firstName: 'Harshit',
        lastName: 'Bhardwaj',
        dob: '1997-02-10',
        gender: 'Male',
        phone: '9123456780'
      },
      {
        id: 'p3',
        mrn: 'MRN-000003',
        firstName: 'Kavya',
        lastName: 'Bhardwaj',
        dob: '2000-07-21',
        gender: 'Female',
        phone: '9123456781'
      },
      {
        id: 'p4',
        mrn: 'MRN-000004',
        firstName: 'Meera',
        lastName: 'Sharma',
        dob: '2016-11-04',
        gender: 'Female',
        phone: '9876543210'
      },
      {
        id: 'p5',
        mrn: 'MRN-000005',
        firstName: 'Kabir',
        lastName: 'Sharma',
        dob: '2012-01-19',
        gender: 'Male',
        phone: '9876543210'
      },
      {
        id: 'p6',
        mrn: 'MRN-000006',
        firstName: 'Priya',
        lastName: 'Sharma',
        dob: '1985-03-22',
        gender: 'Female',
        phone: '9876543210',
        insurance: 'Care Plus',
        memberId: 'CP-552310'
      }
    ];
  }

  private loadPatients(): Patient[] {
    try {
      const raw = localStorage.getItem(this.PATIENTS_KEY);

      if (raw) {
        const parsed = JSON.parse(raw);

        if (Array.isArray(parsed)) {
          return parsed as Patient[];
        }
      }
    } catch {
      return this.seedPatients();
    }

    return this.seedPatients();
  }

  // -------------------------------------------------------
  // PAYMENT RECORD DATA
  // -------------------------------------------------------

  private seedRecords(): PaymentRecord[] {
    const create = (
      id: string,
      patientId: string,
      doctor: string,
      feeType: string,
      description: string,
      amount: number,
      status: 'Paid' | 'Unpaid'
    ): PaymentRecord => ({
      id,
      patientId,
      doctor,
      feeType,
      description,
      amount,
      status,
      demo: true,
      transactionRef: '',
      paymentMethod: '',
      paidAt: ''
    });

    return [
      create('PR-1001', 'p1', 'Dr Arunkumar', 'Consultation', 'Outpatient consultation', 900, 'Unpaid'),
      create('PR-1002', 'p1', 'Dr Sanjay', 'Consultation', 'Follow-up consultation', 500, 'Paid'),
      create('PR-1003', 'p2', 'Dr Sanjay', 'Consultation', 'Outpatient consultation', 500, 'Unpaid'),
      create('PR-1004', 'p3', 'Dr Arunkumar', 'Consultation', 'Outpatient consultation', 900, 'Unpaid'),
      create('PR-1005', 'p4', 'Dr Meena', 'Consultation', 'Paediatric consultation', 600, 'Unpaid'),
      create('PR-1006', 'p5', 'Dr Meena', 'Consultation', 'Paediatric consultation', 600, 'Paid'),
      create('PR-1007', 'p6', 'Dr Arunkumar', 'Consultation', 'Outpatient consultation', 900, 'Unpaid')
    ];
  }

  private getRecords(): PaymentRecord[] {
    try {
      const raw = localStorage.getItem(this.RECORDS_KEY);

      if (raw) {
        const parsed = JSON.parse(raw);

        if (Array.isArray(parsed)) {
          return parsed as PaymentRecord[];
        }
      }

      const seeded = this.seedRecords();

      localStorage.setItem(
        this.RECORDS_KEY,
        JSON.stringify(seeded)
      );

      return seeded;
    } catch {
      if (!this.memoryRecords) {
        this.memoryRecords = this.seedRecords();
      }

      return this.memoryRecords;
    }
  }

  private saveRecords(records: PaymentRecord[]): void {
    this.memoryRecords = records;

    try {
      localStorage.setItem(
        this.RECORDS_KEY,
        JSON.stringify(records)
      );
    } catch {
      throw new Error('storage');
    }
  }

  private findRecord(id: string): PaymentRecord | null {
    return this.getRecords().find(record => record.id === id) || null;
  }

  private markRecordPaid(
    id: string,
    patch: Partial<PaymentRecord>
  ): PaymentRecord {
    const records = this.getRecords();

    const record = records.find(item => item.id === id);

    if (!record) {
      throw new Error('missing');
    }

    if (record.status === 'Paid') {
      throw new Error('duplicate');
    }

    Object.assign(record, patch, {
      status: 'Paid'
    });

    this.saveRecords(records);

    return record;
  }

  private nextReference(): string {
    let next = 1;

    try {
      next =
        parseInt(localStorage.getItem(this.COUNTER_KEY) || '0', 10) + 1;

      localStorage.setItem(
        this.COUNTER_KEY,
        String(next)
      );
    } catch {
      next = Date.now() % 1000000;
    }

    return 'PAY-' + String(next).padStart(6, '0');
  }


  private setError(id: string, message: string): void {
    const input = this.optional(id) as HTMLInputElement | null;
    const error = this.optional(id + 'Error');

    if (input) {
      if (message) {
        input.setAttribute('aria-invalid', 'true');
      } else {
        input.removeAttribute('aria-invalid');
      }
    }

    if (error) {
      error.textContent = message;
      error.hidden = !message;
    }
  }

  private clearErrors(): void {
    [
      'cardNumber',
      'cardExpiry',
      'cardCvv',
      'cardName',
      'cardCountry',
      'cardZip',
      'cashConfirm'
    ].forEach(id => this.setError(id, ''));
  }

  private clearSensitive(): void {
    ['cardNumber', 'cardExpiry', 'cardCvv'].forEach(id => {
      const element = this.optional(id) as HTMLInputElement | null;

      if (element) {
        element.value = '';
      }
    });

    const brand = this.optional('cardBrand');

    if (brand) {
      brand.innerHTML = '<svg><use href="#i-card"></use></svg>';
    }

    const cvvHint = this.optional('cardCvvHint');

    if (cvvHint) {
      cvvHint.textContent = '3 digits (4 for American Express)';
    }
  }

  // -------------------------------------------------------
  // PATIENT SEARCH
  // -------------------------------------------------------

  private runSearch(): void {
    const lastName = this.input('patientLastNameSearch')
      .value.trim();

    const dob = this.input('patientDobSearch').value;

    const phone = this.normalizePhone(
      this.input('patientMobileSearch').value
    );

    const hasNameDob = !!lastName && !!dob;
    const hasMobile = !!phone;

    if ((!hasNameDob && !hasMobile) || (hasNameDob && hasMobile)) {
      this.searchResults = [];
      this.renderResults([]);

      this.announce(
        'Enter Last Name and Date of Birth, or Mobile Number.'
      );
      return;
    }

    const payload: ISearchPatientRequestModel = {
      name: hasNameDob ? lastName : null,
      dob: hasNameDob ? dob : null,
      mobileNo: hasMobile ? phone : null,
      fromDate: null,
      toDate: null
    };

    this.hasSearched = true;
    this.searchResults = [];
    this.renderResults([]);

    this.store.dispatch(
      PaymentActions.searchPatients({ payload })
    );
  }

  private setExpanded(open: boolean): void {
    ['patientLastNameSearch', 'patientMobileSearch'].forEach(id => {
      this.input(id).setAttribute(
        'aria-expanded',
        open ? 'true' : 'false'
      );
    });
  }

  private closeResults(): void {
    const results = this.$('patientSearchResults');

    results.classList.remove('show');
    results.innerHTML = '';
    results.removeAttribute('aria-activedescendant');

    this.activeIndex = -1;
    this.setExpanded(false);
  }

  private optionElements(): HTMLElement[] {
    return Array.from(
      this.$('patientSearchResults')
        .querySelectorAll<HTMLElement>('[role="option"]')
    );
  }

  private setActiveOption(index: number): void {
    const options = this.optionElements();

    if (!options.length) return;

    this.activeIndex =
      (index + options.length) % options.length;

    options.forEach((option, i) => {
      const active = i === this.activeIndex;

      option.classList.toggle('is-active', active);

      option.setAttribute(
        'aria-selected',
        active ? 'true' : 'false'
      );
    });

    const activeOption = options[this.activeIndex];

    this.$('patientSearchResults').setAttribute(
      'aria-activedescendant',
      activeOption.id
    );

    activeOption.scrollIntoView({
      block: 'nearest'
    });
  }

  private renderResults(patients: Patient[]): void {
    const results = this.$('patientSearchResults');

    this.activeIndex = -1;
    results.classList.add('show');
    this.setExpanded(true);

    if (!patients.length) {
      results.innerHTML =
        '<div class="pay-empty-result" role="status">No Matching Record Found</div>';

      results.removeAttribute('aria-activedescendant');
      return;
    }

    results.innerHTML = patients.map(patient => {
      const name = this.escape(this.fullName(patient));
      const id = this.escape(patient.id);

      return `
        <div
          class="pay-result-item"
          id="patient-option-${id}"
          role="option"
          aria-selected="false"
          data-id="${id}">

          <div class="pay-result-avatar" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="8" r="4"
                stroke="currentColor" stroke-width="1.7"/>
              <path d="M4 20c1.8-3.5 5-5 8-5s6.2 1.5 8 5"
                stroke="currentColor"
                stroke-width="1.7"
                stroke-linecap="round"/>
            </svg>
          </div>

          <div class="pay-result-info">
            <div class="pay-result-name">${name}</div>
            <div class="pay-result-meta">
              ${this.escape(patient.phone)} • MRN ${this.escape(patient.mrn)}
            </div>
          </div>

          <button
            type="button"
            class="pay-btn pay-btn--secondary pay-btn--sm pay-result-select"
            data-id="${id}"
            aria-label="Select ${name} as patient">
            Select Patient
          </button>
        </div>
      `;
    }).join('');
  }

  private initializeSearch(): void {
    const lastName = this.input('patientLastNameSearch');
    const dob = this.input('patientDobSearch');
    const mobile = this.input('patientMobileSearch');
    const results = this.$('patientSearchResults');

    this.listen(
      this.$('patientSearchBtn'),
      'click',
      ((event: Event) => {
        event.stopPropagation();

        if (this.debounceTimer) {
          clearTimeout(this.debounceTimer);
        }

        this.runSearch();
      }) as EventListener
    );

    this.listen(
      this.$('patientClearBtn'),
      'click',
      (() => this.clearPatient()) as EventListener
    );

    [lastName, dob, mobile].forEach(input => {
      this.listen(
        input,
        'input',
        (() => {
          if (this.debounceTimer) {
            clearTimeout(this.debounceTimer);
          }

          this.debounceTimer = setTimeout(() => {
            this.runSearch();
          }, 300);
        }) as EventListener
      );

      this.listen(
        input,
        'keydown',
        ((event: KeyboardEvent) => {
          const options = this.optionElements();

          if (event.key === 'Enter') {
            event.preventDefault();

            if (
              this.activeIndex >= 0 &&
              options[this.activeIndex]
            ) {
              this.selectPatientById(
                options[this.activeIndex].dataset['id'] || ''
              );
            } else {
              if (this.debounceTimer) {
                clearTimeout(this.debounceTimer);
              }

              this.runSearch();
            }
          } else if (event.key === 'Escape') {
            this.closeResults();
          } else if (
            event.key === 'ArrowDown' &&
            results.classList.contains('show')
          ) {
            event.preventDefault();
            this.setActiveOption(this.activeIndex + 1);
          } else if (
            event.key === 'ArrowUp' &&
            results.classList.contains('show')
          ) {
            event.preventDefault();
            this.setActiveOption(this.activeIndex - 1);
          }
        }) as EventListener
      );
    });

    this.listen(
      results,
      'click',
      ((event: Event) => {
        const target = event.target as HTMLElement;
        const item = target.closest<HTMLElement>('.pay-result-item');

        if (item?.dataset['id']) {
          this.selectPatientById(item.dataset['id']);
        }
      }) as EventListener
    );

    this.listen(
      this.root,
      'click',
      ((event: Event) => {
        const target = event.target as Node;

        const inside =
          results.contains(target) ||
          lastName.contains(target) ||
          dob.contains(target) ||
          mobile.contains(target) ||
          this.$('patientSearchBtn').contains(target) ||
          this.$('patientClearBtn').contains(target);

        if (!inside) {
          this.closeResults();
        }
      }) as EventListener
    );
  }

  // -------------------------------------------------------
  // PATIENT SELECTION
  // -------------------------------------------------------

  private resetTransaction(): void {
    this.state.record = null;
    this.state.card = null;
    this.state.cashConfirmed = false;
    this.state.result = null;

    this.input('cashConfirm').checked = false;

    this.clearErrors();
    this.clearSensitive();
  }

  private selectPatientById(id: string): void {
    const patient = this.loadPatients().find(item => item.id === id);

    if (!patient) return;

    if (
      !this.state.patient ||
      this.state.patient.id !== patient.id
    ) {
      this.resetTransaction();
    }

    this.state.patient = patient;

    this.input('patientLastNameSearch').value = patient.lastName;
    this.input('patientDobSearch').value = patient.dob;
    this.input('patientMobileSearch').value = patient.phone;

    this.closeResults();

    this.$('paySelectedName').textContent = this.fullName(patient);

    this.$('paySelectedMeta').textContent =
      `MRN ${patient.mrn} • ${patient.phone} • DOB ${this.formatDob(patient.dob)}`;

    this.$('paySelectedPatient').hidden = false;

    this.renderRecords();

    const firstRadio = this.root.querySelector<HTMLInputElement>(
      '#payRecordsBody input[type="radio"]:not(:disabled)'
    );

    firstRadio?.focus();

    this.announce(
      `${this.fullName(patient)} selected. ${this.patientRecords().length} payment record(s) found.`
    );
  }

  private clearPatient(): void {
    this.input('patientLastNameSearch').value = '';
    this.input('patientDobSearch').value = '';
    this.input('patientMobileSearch').value = '';

    this.state.patient = null;

    this.resetTransaction();

    this.$('paySelectedPatient').hidden = true;

    this.closeResults();
    this.renderRecords();
  }

  private patientRecords(): PaymentRecord[] {
    if (!this.state.patient) return [];

    return this.getRecords().filter(
      record => record.patientId === this.state.patient!.id
    );
  }

  // -------------------------------------------------------
  // PAYMENT RECORDS
  // -------------------------------------------------------

  private renderRecords(): void {
    const body = this.$('payRecordsBody');
    const hint = this.$('payRecordsHint');

    const records = this.patientRecords();

    if (
      this.state.record &&
      !records.some(record =>
        record.id === this.state.record!.id &&
        record.status === 'Unpaid'
      )
    ) {
      this.state.record = null;
    }

    if (!this.state.patient) {
      hint.textContent =
        'Select a patient to view and process payment.';

      body.innerHTML = `
        <tr>
          <td colspan="8" class="pay-table-empty">
            <strong>No patient selected.</strong><br>
            Search for a patient above and choose Select Patient to see their payment records.
          </td>
        </tr>
      `;
    } else if (!records.length) {
      hint.textContent =
        `No payment records for ${this.fullName(this.state.patient)}.`;

      body.innerHTML = `
        <tr>
          <td colspan="8" class="pay-table-empty">
            <strong>No payment records found.</strong><br>
            There is nothing to pay for this patient yet.
          </td>
        </tr>
      `;
    } else {
      hint.textContent =
        'Select an unpaid record to process payment.';

      const patient = this.state.patient;

      body.innerHTML = records.map(record => {
        const unpaid = record.status === 'Unpaid';

        const selected =
          this.state.record?.id === record.id;

        const classes =
          (selected ? 'is-selected ' : '') +
          (unpaid ? 'is-clickable' : 'is-disabled');

        return `
          <tr class="${classes}" data-id="${this.escape(record.id)}">
            <td class="pay-col-radio">
              <input
                type="radio"
                name="payRecord"
                value="${this.escape(record.id)}"
                ${selected ? 'checked' : ''}
                ${unpaid ? '' : 'disabled'}
                aria-label="Select payment record ${this.escape(record.id)} for ${this.escape(this.fullName(patient))}, ${this.escape(this.money(record.amount))}, ${this.escape(record.status)}">
            </td>

            <td>${this.escape(this.fullName(patient))}</td>
            <td>${this.escape(this.formatDob(patient.dob))}</td>
            <td>${this.escape(patient.address || '—')}</td>
            <td>${this.escape(patient.phone)}</td>
            <td>${this.escape(record.doctor)}</td>
            <td>${this.escape(this.money(record.amount))}</td>

            <td>
              <span class="pay-pill pay-pill--${unpaid ? 'unpaid' : 'paid'}">
                ${this.escape(record.status)}
              </span>
            </td>
          </tr>
        `;
      }).join('');
    }

    this.$('payContinue1').toggleAttribute(
      'disabled',
      !(this.state.patient && this.state.record)
    );
  }

  private initializeRecords(): void {
    const body = this.$('payRecordsBody');

    this.listen(
      body,
      'change',
      ((event: Event) => {
        const target = event.target as HTMLInputElement;

        if (target.name === 'payRecord') {
          this.selectRecord(target.value);
        }
      }) as EventListener
    );

    this.listen(
      body,
      'click',
      ((event: Event) => {
        const target = event.target as HTMLElement;

        if (target.tagName === 'INPUT') return;

        const row = target.closest<HTMLTableRowElement>(
          'tr.is-clickable'
        );

        if (row?.dataset['id']) {
          this.selectRecord(row.dataset['id']);
        }
      }) as EventListener
    );
  }

  private selectRecord(id: string): void {
    const record = this.findRecord(id);

    if (!record || record.status !== 'Unpaid') return;

    this.state.record = record;
    this.state.card = null;
    this.state.cashConfirmed = false;

    this.input('cashConfirm').checked = false;

    const error = this.$('payRecordError');

    error.hidden = true;
    error.textContent = '';

    this.renderRecords();

    const radio = this.root.querySelector<HTMLInputElement>(
      `#payRecordsBody input[value="${CSS.escape(record.id)}"]`
    );

    radio?.focus();
  }

  private continueFromStep1(): void {
    if (!this.state.patient || !this.state.record) return;

    const fresh = this.findRecord(this.state.record.id);

    if (!fresh || fresh.status !== 'Unpaid') {
      const error = this.$('payRecordError');

      error.textContent =
        'This record is already marked Paid and cannot be processed again.';

      error.hidden = false;

      this.state.record = null;
      this.renderRecords();

      return;
    }

    this.state.record = fresh;

    this.enterStep2(false);
  }

  // -------------------------------------------------------
  // CARD BRAND AND FORMATTING
  // -------------------------------------------------------

  private detectBrand(digits: string): string {
    if (/^4/.test(digits)) return 'Visa';

    if (/^(5[1-5]|2(2[2-9]|[3-6]\d|7[01]|720))/.test(digits)) {
      return 'Mastercard';
    }

    if (/^3[47]/.test(digits)) {
      return 'American Express';
    }

    return '';
  }

  private luhn(digits: string): boolean {
    let sum = 0;
    let alternate = false;

    for (let i = digits.length - 1; i >= 0; i--) {
      let number = parseInt(digits.charAt(i), 10);

      if (alternate) {
        number *= 2;

        if (number > 9) {
          number -= 9;
        }
      }

      sum += number;
      alternate = !alternate;
    }

    return sum % 10 === 0;
  }

  private updateBrand(digits: string): void {
    const brand = this.detectBrand(digits);
    const element = this.$('cardBrand');

    element.textContent = brand
      ? (brand === 'American Express' ? 'AMEX' : brand.toUpperCase())
      : '';

    if (!brand) {
      element.innerHTML = '<svg><use href="#i-card"></use></svg>';
    }
  }

  private updateCvvHint(digits: string): void {
    const amex = this.detectBrand(digits) === 'American Express';

    this.$('cardCvvHint').textContent = amex
      ? '4 digits for American Express'
      : '3 digits (4 for American Express)';
  }

  private formatCardNumber(raw: string): string {
    let digits = this.digitsOf(raw);

    const amex =
      this.detectBrand(digits) === 'American Express';

    digits = digits.slice(0, amex ? 15 : 16);

    if (amex) {
      return [
        digits.slice(0, 4),
        digits.slice(4, 10),
        digits.slice(10)
      ].filter(Boolean).join(' ');
    }

    return digits.replace(/(.{4})/g, '$1 ').trim();
  }

  private formatExpiry(raw: string): string {
    let digits = this.digitsOf(raw).slice(0, 4);

    if (digits.length === 1 && parseInt(digits, 10) > 1) {
      digits = '0' + digits;
    }

    if (digits.length > 2) {
      return digits.slice(0, 2) + ' / ' + digits.slice(2);
    }

    return digits;
  }

  // -------------------------------------------------------
  // CARD VALIDATIONS
  // -------------------------------------------------------

  private validateNumber(): boolean {
    const digits = this.digitsOf(
      this.input('cardNumber').value
    );

    const amex =
      this.detectBrand(digits) === 'American Express';

    let message = '';

    if (!digits) {
      message = 'Enter the card number.';
    } else if (digits.length !== (amex ? 15 : 16)) {
      message =
        `Card number must have ${amex ? 15 : 16} digits.`;
    } else if (!this.luhn(digits)) {
      message =
        'This card number is not valid. Check it and try again.';
    }

    this.setError('cardNumber', message);

    return !message;
  }

  private validateExpiry(): boolean {
    const digits = this.digitsOf(
      this.input('cardExpiry').value
    );

    let message = '';

    if (!digits) {
      message = 'Enter the expiry date.';
    } else if (digits.length < 4) {
      message = 'Enter the expiry date as MM / YY.';
    } else {
      const month = parseInt(digits.slice(0, 2), 10);
      const year = 2000 + parseInt(digits.slice(2), 10);

      const now = new Date();

      if (month < 1 || month > 12) {
        message = 'Month must be between 01 and 12.';
      } else if (
        year < now.getFullYear() ||
        (
          year === now.getFullYear() &&
          month < now.getMonth() + 1
        )
      ) {
        message = 'This card has expired.';
      } else if (year > now.getFullYear() + 20) {
        message = 'Enter a valid expiry year.';
      }
    }

    this.setError('cardExpiry', message);

    return !message;
  }

  private validateCvv(): boolean {
    const digits = this.digitsOf(
      this.input('cardCvv').value
    );

    const amex =
      this.detectBrand(
        this.digitsOf(this.input('cardNumber').value)
      ) === 'American Express';

    const required = amex ? 4 : 3;

    let message = '';

    if (!digits) {
      message = 'Enter the CVV.';
    } else if (digits.length !== required) {
      message = `CVV must have ${required} digits.`;
    }

    this.setError('cardCvv', message);

    return !message;
  }

  private validateName(): boolean {
    const value = this.input('cardName').value.trim();

    let message = '';

    if (!value) {
      message = 'Enter the cardholder name.';
    } else if (
      value.length < 2 ||
      !/^[A-Za-z\u00C0-\u024F][A-Za-z\u00C0-\u024F .'-]*$/.test(value)
    ) {
      message =
        'Enter the name exactly as it appears on the card.';
    }

    this.setError('cardName', message);

    return !message;
  }

  private validateCountry(): boolean {
    const message = this.select('cardCountry').value
      ? ''
      : 'Select a country.';

    this.setError('cardCountry', message);

    return !message;
  }

  private validateZip(): boolean {
    const rule =
      this.ZIP_RULES[this.select('cardCountry').value];

    const value = this.input('cardZip').value.trim();

    let message = '';

    if (!value) {
      message =
        `Enter the ${rule ? rule.label : 'postal code'}.`;
    } else if (rule && !rule.re.test(value)) {
      message = rule.msg;
    }

    this.setError('cardZip', message);

    return !message;
  }

  private validateCash(): boolean {
    const confirmed = this.input('cashConfirm').checked;

    this.setError(
      'cashConfirm',
      confirmed
        ? ''
        : 'Confirm that the cash has been received before continuing.'
    );

    return confirmed;
  }

  private updateZipField(): void {
    const rule =
      this.ZIP_RULES[this.select('cardCountry').value] || {
        label: 'Postal Code',
        placeholder: 'Postal Code'
      };

    this.$('cardZipLabel').textContent = rule.label;
    this.input('cardZip').placeholder = rule.placeholder;
  }

  // -------------------------------------------------------
  // CARD INPUT EVENTS
  // -------------------------------------------------------

  private initializeCardInputs(): void {
    const number = this.input('cardNumber');
    const expiry = this.input('cardExpiry');
    const cvv = this.input('cardCvv');
    const name = this.input('cardName');
    const zip = this.input('cardZip');
    const country = this.select('cardCountry');

    this.listen(
      number,
      'input',
      (() => {
        number.value = this.formatCardNumber(number.value);

        const digits = this.digitsOf(number.value);

        this.updateBrand(digits);
        this.updateCvvHint(digits);

        cvv.maxLength =
          this.detectBrand(digits) === 'American Express' ? 4 : 3;

        cvv.value = this.digitsOf(cvv.value).slice(0, cvv.maxLength);

        if (number.getAttribute('aria-invalid')) {
          this.validateNumber();
        }
      }) as EventListener
    );

    this.listen(
      expiry,
      'input',
      (() => {
        expiry.value = this.formatExpiry(expiry.value);

        if (expiry.getAttribute('aria-invalid')) {
          this.validateExpiry();
        }
      }) as EventListener
    );

    this.listen(
      cvv,
      'input',
      (() => {
        cvv.value = this.digitsOf(cvv.value)
          .slice(0, cvv.maxLength || 3);

        if (cvv.getAttribute('aria-invalid')) {
          this.validateCvv();
        }
      }) as EventListener
    );

    this.listen(
      name,
      'input',
      (() => {
        if (name.getAttribute('aria-invalid')) {
          this.validateName();
        }
      }) as EventListener
    );

    this.listen(
      zip,
      'input',
      (() => {
        zip.value = zip.value.toUpperCase();

        if (zip.getAttribute('aria-invalid')) {
          this.validateZip();
        }
      }) as EventListener
    );

    this.listen(
      country,
      'change',
      (() => {
        this.updateZipField();
        this.validateCountry();

        if (zip.value) {
          this.validateZip();
        }
      }) as EventListener
    );

    const blurValidations: Array<[HTMLElement, () => boolean]> = [
      [number, () => this.validateNumber()],
      [expiry, () => this.validateExpiry()],
      [cvv, () => this.validateCvv()],
      [name, () => this.validateName()],
      [zip, () => this.validateZip()]
    ];

    blurValidations.forEach(([element, validate]) => {
      this.listen(
        element,
        'blur',
        (() => {
          if ((element as HTMLInputElement).value) {
            validate();
          }
        }) as EventListener
      );
    });

    this.listen(
      this.$('payCardForm'),
      'keydown',
      ((event: KeyboardEvent) => {
        const target = event.target as HTMLElement;

        if (
          event.key === 'Enter' &&
          target.tagName === 'INPUT'
        ) {
          event.preventDefault();
          this.continueFromStep2();
        }
      }) as EventListener
    );

    this.root.querySelectorAll<HTMLInputElement>(
      'input[name="payMethod"]'
    ).forEach(radio => {
      this.listen(
        radio,
        'change',
        (() => {
          if (!radio.checked) return;

          this.state.method = radio.value;

          this.clearErrors();
          this.applyMethodUI();
        }) as EventListener
      );
    });

    this.root.querySelectorAll<HTMLInputElement>(
      'input[name="payProvider"]'
    ).forEach(radio => {
      this.listen(
        radio,
        'change',
        (() => {
          if (!radio.checked) return;

          this.state.provider = radio.value;

          this.clearErrors();
          this.applyMethodUI();
        }) as EventListener
      );
    });

    this.listen(
      this.input('cashConfirm'),
      'change',
      (() => {
        if (this.input('cashConfirm').checked) {
          this.setError('cashConfirm', '');
        }
      }) as EventListener
    );
  }

  // -------------------------------------------------------
  // PAYMENT METHOD UI
  // -------------------------------------------------------

  private methodLabel(): string {
    if (this.state.method === 'cash') {
      return 'Cash Payment (front desk)';
    }

    if (this.state.provider === 'card') {
      return this.state.card
        ? `Card Payment — ${this.state.card.brand || 'Card'} ending ${this.state.card.last4}`
        : 'Card Payment';
    }

    return `Card Payment — ${this.PROVIDERS[this.state.provider]} (prototype wallet)`;
  }

  private renderStep2Summary(): void {
    const patient = this.state.patient!;
    const record = this.state.record!;

    this.$('sumName').textContent = this.fullName(patient);
    this.$('sumDob').textContent = this.formatDob(patient.dob);
    this.$('sumPhone').textContent = patient.phone || '—';
    this.$('sumAddress').textContent = patient.address || 'Not on file';
    this.$('sumDoctor').textContent = record.doctor;
    this.$('sumFeeType').textContent = record.feeType;
    this.$('sumFee').textContent = this.money(record.amount);

    const feeLabel = this.root.querySelector(
      '.pay-summary__fee dt'
    );

    if (feeLabel) {
      feeLabel.textContent = record.feeType + ' Fee';
    }

    this.$('cashAmount').textContent = this.money(record.amount);

    this.$('cashConfirmText').textContent =
      `I confirm the front desk has received ${this.money(record.amount)} in cash from ${this.fullName(patient)}.`;
  }

  private applyMethodUI(): void {
    const isCard = this.state.method === 'card';

    const wallet =
      isCard && this.state.provider !== 'card';

    this.$('payCardSection').hidden = !isCard;
    this.$('payCashSection').hidden = isCard;

    this.$('payCardForm').hidden = wallet;
    this.$('payWalletNote').hidden = !wallet;

    this.$('payMethodCardLabel').classList.toggle(
      'is-selected',
      isCard
    );

    this.$('payMethodCashLabel').classList.toggle(
      'is-selected',
      !isCard
    );

    this.root.querySelectorAll<HTMLElement>(
      '.pay-provider'
    ).forEach(label => {
      const radio = label.querySelector<HTMLInputElement>('input');

      label.classList.toggle(
        'is-selected',
        !!radio?.checked
      );
    });

    if (wallet) {
      const name = this.PROVIDERS[this.state.provider];

      this.$('payWalletText').textContent =
        `${name} is not connected in this prototype. Continuing simulates a ${name} payment; no real account is contacted and no real charge is made.`;
    }

    this.$('payProviderTitle').textContent = wallet
      ? this.PROVIDERS[this.state.provider] + ' Payment'
      : 'Card Payment Details';
  }

  private enterStep2(showClearedNote: boolean): void {
    this.state.card = null;

    this.renderStep2Summary();

    this.clearErrors();
    this.clearSensitive();

    this.$('payCardClearedNote').hidden = !(
      showClearedNote &&
      this.state.method === 'card' &&
      this.state.provider === 'card'
    );

    this.applyMethodUI();

    this.goTo(2);
  }

  private continueFromStep2(): void {
    this.clearErrors();

    let firstInvalid = '';

    const check = (valid: boolean, id: string): void => {
      if (!valid && !firstInvalid) {
        firstInvalid = id;
      }
    };

    if (
      this.state.method === 'card' &&
      this.state.provider === 'card'
    ) {
      check(this.validateNumber(), 'cardNumber');
      check(this.validateExpiry(), 'cardExpiry');
      check(this.validateCvv(), 'cardCvv');
      check(this.validateName(), 'cardName');
      check(this.validateCountry(), 'cardCountry');
      check(this.validateZip(), 'cardZip');

      if (firstInvalid) {
        this.input(firstInvalid).focus();
        return;
      }

      const digits = this.digitsOf(
        this.input('cardNumber').value
      );

      this.state.card = {
        brand: this.detectBrand(digits),
        last4: digits.slice(-4),
        decline: digits === '4000000000000002'
      };
    } else if (this.state.method === 'cash') {
      if (!this.validateCash()) {
        this.input('cashConfirm').focus();
        return;
      }

      this.state.cashConfirmed = true;
      this.state.card = null;
    } else {
      this.state.card = null;
    }

    this.renderInvoice();
    this.goTo(3);
  }

  // -------------------------------------------------------
  // INVOICE
  // -------------------------------------------------------

  private row(label: string, value: string): string {
    return `
      <div class="pay-row">
        <dt>${this.escape(label)}</dt>
        <dd>${this.escape(value)}</dd>
      </div>
    `;
  }

  private renderInvoice(): void {
    const patient = this.state.patient!;
    const record = this.state.record!;

    this.$('invoiceRows').innerHTML =
      this.row('Invoice Reference', 'Assigned after successful payment') +
      this.row('Patient Name', this.fullName(patient)) +
      this.row('MRN', patient.mrn || '—') +
      this.row('Consulting Doctor', record.doctor) +
      this.row('Visit / Service', record.description) +
      this.row('Fee Type', record.feeType) +
      this.row('Original Fee', this.money(record.amount)) +
      this.row('Amount Due', this.money(record.amount)) +
      this.row('Payment Method', this.methodLabel());

    this.$('invoiceTotal').textContent =
      this.money(record.amount);

    this.$('invoiceNote').textContent =
      this.state.method === 'cash'
        ? 'Prototype: the cash hand-over was confirmed on the previous step. The record is marked Paid only after you choose Confirm Payment. No payment gateway is connected.'
        : 'Prototype: this payment is simulated in your browser. No payment gateway is connected and no real charge is made. The record is marked Paid only after you choose Confirm Payment.';

    const error = this.$('invoiceError');

    error.hidden = true;
    error.textContent = '';

    this.setProcessing(false);
  }

  // -------------------------------------------------------
  // STEPPER AND NAVIGATION
  // -------------------------------------------------------

  private updateStepper(): void {
    const items = this.root.querySelectorAll<HTMLElement>(
      '#payStepper .pay-step'
    );

    const outcome = this.state.result
      ? (this.state.result.ok ? 'ok' : 'fail')
      : '';

    items.forEach(item => {
      const number = parseInt(item.dataset['step'] || '0', 10);

      const button = item.querySelector<HTMLButtonElement>('button');

      if (!button) return;

      let status = 'upcoming';

      item.className = 'pay-step';

      button.removeAttribute('aria-current');

      if (outcome === 'ok') {
        item.classList.add('is-complete');
        status = 'completed';

        if (number === 4) {
          button.setAttribute('aria-current', 'step');
        }
      } else if (outcome === 'fail') {
        if (number < 4) {
          item.classList.add('is-complete');
          status = 'completed';
        } else {
          item.classList.add('is-failed');
          status = 'failed';

          button.setAttribute('aria-current', 'step');
        }
      } else if (number < this.state.step) {
        item.classList.add('is-complete');
        status = 'completed';
      } else if (number === this.state.step) {
        item.classList.add('is-current');
        status = 'current';

        button.setAttribute('aria-current', 'step');
      }

      button.disabled = !(
        number < this.state.step &&
        !outcome &&
        !this.state.processing
      );

      button.setAttribute(
        'aria-label',
        `Step ${number}: ${this.STEP_LABELS[number - 1]}, ${status}`
      );
    });

    this.$('payStepBadge').textContent =
      `Step ${this.state.step} of 4`;
  }

  private goTo(step: number): void {
    if (this.state.step === 2 && step !== 2) {
      this.clearSensitive();
    }

    this.state.step = step;

    this.root.querySelectorAll<HTMLElement>(
      '.pay-panel'
    ).forEach(panel => {
      panel.hidden =
        parseInt(panel.dataset['panel'] || '0', 10) !== step;
    });

    this.$('paySubtitle').textContent =
      this.state.result && !this.state.result.ok
        ? "We couldn't complete your payment."
        : this.state.result
          ? 'Your payment has been processed successfully.'
          : this.SUBTITLES[step - 1];

    this.updateStepper();

    if (step === 1) {
      this.renderRecords();
    }

    const panel = this.root.querySelector<HTMLElement>(
      `.pay-panel[data-panel="${step}"]`
    );

    panel?.focus();

    this.announce(
      `Step ${step} of 4: ${this.STEP_LABELS[step - 1]}`
    );
  }

  // -------------------------------------------------------
  // PAYMENT PROCESSING
  // -------------------------------------------------------

  private setProcessing(on: boolean): void {
    this.state.processing = on;

    this.$('payConfirm').toggleAttribute('disabled', on);
    this.$('payBack3').toggleAttribute('disabled', on);

    this.$('payConfirmLabel').textContent = on
      ? 'Processing payment…'
      : 'Confirm Payment';

    this.$('payPanel3Title').setAttribute(
      'aria-busy',
      on ? 'true' : 'false'
    );

    const panel = this.root.querySelector<HTMLElement>(
      '.pay-panel[data-panel="3"]'
    );

    panel?.setAttribute(
      'aria-busy',
      on ? 'true' : 'false'
    );

    this.updateStepper();
  }

  private confirmPayment(): void {
    if (this.state.processing || this.state.result) {
      return;
    }

    const error = this.$('invoiceError');

    error.hidden = true;

    const fresh = this.findRecord(this.state.record!.id);

    if (!fresh || fresh.status !== 'Unpaid') {
      error.textContent =
        'This record is already marked Paid, so it cannot be charged again.';

      error.hidden = false;
      return;
    }

    this.setProcessing(true);
    this.announce('Processing payment');

    this.processingTimer = setTimeout(() => {
      this.finishPayment();
    }, 1200);
  }

  private simulateOutcome(): {
    ok: boolean;
    reason?: string;
  } {
    if (
      this.state.method === 'card' &&
      this.state.provider === 'card' &&
      this.state.card?.decline
    ) {
      return {
        ok: false,
        reason: 'The simulated payment processor declined this card (prototype test decline). Wrong card number, expiry date, CVV, or name entered.'
      };
    }

    return { ok: true };
  }

  private finishPayment(): void {
    const outcome = this.simulateOutcome();

    const record = this.state.record!;
    const method = this.methodLabel();

    let finalOutcome: {
      ok: boolean;
      ref?: string;
      reason?: string;
    } = outcome;

    if (outcome.ok) {
      try {
        const reference = this.nextReference();

        const storedMethod =
          this.state.method === 'card' &&
            this.state.provider === 'card'
            ? `Card Payment — ${this.state.card?.brand || 'Card'}`
            : method;

        const saved = this.markRecordPaid(record.id, {
          transactionRef: reference,
          paymentMethod: storedMethod,
          paidAt: new Date().toISOString()
        });

        finalOutcome = {
          ok: true,
          ref: saved.transactionRef
        };
      } catch (error) {
        const message =
          error instanceof Error ? error.message : '';

        finalOutcome = {
          ok: false,
          reason: message === 'duplicate'
            ? 'This record was already paid, so a second payment was not created.'
            : 'The payment result could not be saved in this browser, so the record was not marked Paid.'
        };
      }
    }

    this.state.result = {
      ok: finalOutcome.ok,
      ref: finalOutcome.ref || '',
      reason: finalOutcome.reason || '',
      method
    };

    this.state.card = null;
    this.clearSensitive();

    this.state.processing = false;

    this.$('payConfirm').toggleAttribute('disabled', false);
    this.$('payBack3').toggleAttribute('disabled', false);

    this.$('payConfirmLabel').textContent = 'Confirm Payment';

    this.root.querySelector<HTMLElement>(
      '.pay-panel[data-panel="3"]'
    )?.setAttribute('aria-busy', 'false');

    this.showOutcome();
  }

  // -------------------------------------------------------
  // SUCCESS / FAILURE
  // -------------------------------------------------------

  private showOutcome(): void {
    const result = this.state.result!;
    const patient = this.state.patient!;
    const record = this.state.record!;

    this.$('payResultSuccess').hidden = !result.ok;
    this.$('payResultFailed').hidden = result.ok;

    if (result.ok) {
      this.$('successRows').innerHTML =
        this.row('Transaction Reference #', result.ref || '') +
        this.row('Patient Name', this.fullName(patient)) +
        this.row('Doctor Name', record.doctor) +
        this.row(record.feeType + ' Fee', this.money(record.amount)) +
        this.row('Payment Method', result.method);

      this.$('successProto').textContent =
        'Prototype: this reference was generated locally for demonstration. No real charge was made.';
    } else {
      this.$('failReason').textContent =
        result.reason || 'Payment failed.';

      this.$('failRows').innerHTML =
        this.row('Patient Name', this.fullName(patient)) +
        this.row('Doctor Name', record.doctor) +
        this.row(record.feeType + ' Fee', this.money(record.amount)) +
        this.row('Payment Method', result.method);
    }

    this.goTo(4);

    this.announce(
      result.ok
        ? `Payment successful. Reference ${result.ref}`
        : `Payment failed. ${result.reason}`
    );
  }

  // -------------------------------------------------------
  // CANCEL MODAL
  // -------------------------------------------------------

  private hasWork(): boolean {
    return !!(
      this.state.patient ||
      this.input('patientLastNameSearch').value.trim() ||
      this.input('patientDobSearch').value ||
      this.input('patientMobileSearch').value.trim()
    );
  }

  private openModal(): void {
    this.modalReturnFocus =
      document.activeElement as HTMLElement;

    this.$('payCancelModal').hidden = false;

    this.$('payCancelKeep').focus();

    this.modalKeyHandler = (event: KeyboardEvent) => {
      this.modalKeydown(event);
    };

    document.addEventListener(
      'keydown',
      this.modalKeyHandler
    );
  }

  private closeModal(): void {
    this.$('payCancelModal').hidden = true;

    if (this.modalKeyHandler) {
      document.removeEventListener(
        'keydown',
        this.modalKeyHandler
      );

      this.modalKeyHandler = undefined;
    }

    if (this.modalReturnFocus?.isConnected) {
      this.modalReturnFocus.focus();
    }

    this.modalReturnFocus = null;
  }

  private modalKeydown(event: KeyboardEvent): void {
    if (event.key === 'Escape') {
      event.preventDefault();
      this.closeModal();
      return;
    }

    if (event.key !== 'Tab') return;

    const items = [
      this.$('payCancelKeep'),
      this.$('payCancelLeave')
    ];

    const index = items.indexOf(
      document.activeElement as HTMLElement
    );

    if (event.shiftKey && index <= 0) {
      event.preventDefault();
      items[items.length - 1].focus();
    } else if (
      !event.shiftKey &&
      index === items.length - 1
    ) {
      event.preventDefault();
      items[0].focus();
    }
  }

  private requestCancel(): void {
    if (this.hasWork()) {
      this.openModal();
    } else {
      this.goHome();
    }
  }

  // -------------------------------------------------------
  // FINAL NAVIGATION ACTIONS
  // -------------------------------------------------------

  private goHome(): void {
    this.clearSensitive();

    this.router.navigateByUrl('/front-office/dashboard');
  }

  private closeAfterSuccess(): void {
    this.state.record = null;
    this.state.result = null;
    this.state.card = null;
    this.state.cashConfirmed = false;

    this.input('cashConfirm').checked = false;

    this.goTo(1);
  }

  private closeAfterFailure(): void {
    this.state.result = null;
    this.state.card = null;

    this.goTo(1);
  }

  private retryPayment(): void {
    this.state.result = null;
    this.state.cashConfirmed = false;

    this.input('cashConfirm').checked = false;

    this.enterStep2(true);
  }

  // -------------------------------------------------------
  // ALL BUTTON AND STEPPER EVENTS
  // -------------------------------------------------------

  private initializeNavigation(): void {
    this.listen(
      this.$('payCancel1'),
      'click',
      (() => this.requestCancel()) as EventListener
    );

    this.listen(
      this.$('payCancel2'),
      'click',
      (() => this.requestCancel()) as EventListener
    );

    this.listen(
      this.$('payContinue1'),
      'click',
      (() => this.continueFromStep1()) as EventListener
    );

    this.listen(
      this.$('payBack2'),
      'click',
      (() => this.goTo(1)) as EventListener
    );

    this.listen(
      this.$('payContinue2'),
      'click',
      (() => this.continueFromStep2()) as EventListener
    );

    this.listen(
      this.$('payBack3'),
      'click',
      (() => {
        if (!this.state.processing) {
          this.enterStep2(true);
        }
      }) as EventListener
    );

    this.listen(
      this.$('payConfirm'),
      'click',
      (() => this.confirmPayment()) as EventListener
    );

    this.listen(
      this.$('successHome'),
      'click',
      (() => this.goHome()) as EventListener
    );

    this.listen(
      this.$('failHome'),
      'click',
      (() => this.goHome()) as EventListener
    );

    this.listen(
      this.$('successClose'),
      'click',
      (() => this.closeAfterSuccess()) as EventListener
    );

    this.listen(
      this.$('failClose'),
      'click',
      (() => this.closeAfterFailure()) as EventListener
    );

    this.listen(
      this.$('failRetry'),
      'click',
      (() => this.retryPayment()) as EventListener
    );

    this.listen(
      this.$('payCancelKeep'),
      'click',
      (() => this.closeModal()) as EventListener
    );

    this.listen(
      this.$('payCancelLeave'),
      'click',
      (() => {
        this.closeModal();
        this.goHome();
      }) as EventListener
    );

    this.listen(
      this.$('payCancelModal'),
      'click',
      ((event: Event) => {
        if (event.target === this.$('payCancelModal')) {
          this.closeModal();
        }
      }) as EventListener
    );

    this.listen(
      this.$('payStepper'),
      'click',
      ((event: Event) => {
        const target = event.target as HTMLElement;

        const button = target.closest<HTMLButtonElement>(
          '[data-goto]'
        );

        if (!button || button.disabled) return;

        const step = parseInt(
          button.dataset['goto'] || '0',
          10
        );

        if (
          step >= this.state.step ||
          this.state.result ||
          this.state.processing
        ) {
          return;
        }

        if (step === 2) {
          this.enterStep2(true);
        } else {
          this.goTo(step);
        }
      }) as EventListener
    );
  }
}
