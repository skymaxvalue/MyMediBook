
import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { CLAIMS_DATA } from '../claim-dashboard/data/claims.data';
import { Claim } from 'src/app/core/Models/claims/claims.interface';
import { ClaimService } from 'src/app/core/Services/claim/claim.service';

@Component({
  selector: 'app-claim-details',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './claim-details.component.html',
  styleUrl: './claim-details.component.css'
})
export class ClaimDetailsComponent implements OnInit {

  private route = inject(ActivatedRoute);
  private claimService = inject(ClaimService);

  claim: Claim | null = null;
  loading = false;
  errorMessage = '';

  claimId = '';

  ngOnInit(): void {
    this.route.queryParamMap.subscribe(params => {
      this.claimId = params.get('id') || '';

      this.loadClaim();
    });
  }

  loadClaim(): void {

    if (!this.claimId) {
      this.errorMessage = 'No claim was specified.';
      return;
    }

    const foundClaim = CLAIMS_DATA.find(
      claim => claim.id === this.claimId
    );

    if (!foundClaim) {
      this.claim = null;
      this.errorMessage = 'Claim not found.';
      return;
    }

    this.claim = foundClaim;
    this.errorMessage = '';
  }

  get outstandingAmount(): number | null {

    const approved = this.claim?.approvedAmount;
    const paid = this.claim?.paidAmount;

    if (approved == null || paid == null) {
      return null;
    }

    if (!Number.isFinite(approved) || !Number.isFinite(paid)) {
      return null;
    }

    return approved - paid;
  }

  get workflowRows(): { label: string; value: string }[] {

    if (!this.claim) {
      return [];
    }

    const rows: { label: string; value: string }[] = [
      {
        label: 'Status',
        value: this.claim.status
      }
    ];

    if (this.claim.denialCode || this.claim.denialReason) {

      if (this.claim.denialCode) {
        rows.push({
          label: 'Denial code',
          value: this.claim.denialCode
        });
      }

      if (this.claim.denialReason) {
        rows.push({
          label: 'Denial reason',
          value: this.claim.denialReason
        });
      }
    }

    if (this.claim.actionRequired) {
      rows.push({
        label: 'Action required',
        value: this.claim.actionRequired
      });
    }

    return rows;
  }

  formatDate(value: any): string {

    if (!value) return '—';

    const date = new Date(value);

    if (isNaN(date.getTime())) return '—';

    return new Intl.DateTimeFormat('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    }).format(date);
  }

  formatMoney(value: any): string {

    if (value === null || value === undefined || value === '') {
      return '—';
    }

    const amount = Number(value);

    if (!Number.isFinite(amount)) return '—';

    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 2
    }).format(amount);
  }

  statusClass(status: string): string {
    switch (status?.trim().toLowerCase()) {
      case 'approved':
        return 'cl-badge cl-badge--approved';

      case 'pending':
        return 'cl-badge cl-badge--pending';

      case 'denied':
        return 'cl-badge cl-badge--denied';

      case 'needs action':
      case 'requires attention':
        return 'cl-badge cl-badge--action';

      default:
        return 'cl-badge cl-badge--other';
    }
  }

  displayValue(value: any): string {
    return value !== null && value !== undefined && value !== ''
      ? String(value)
      : '—';
  }
}
