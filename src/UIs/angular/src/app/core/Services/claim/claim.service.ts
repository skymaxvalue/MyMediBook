
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

import {
    Claim,
    ClaimsSummaryResponse,
    ClaimsTrendRequest,
    ClaimsTrendResponse
} from '../../Models/claims/claims.interface';

import {
    CLAIMS_DATA,
    CLAIMS_SUMMARY_DATA,
    CLAIMS_TREND_DATA
} from '../../../Pages/Front-Office-View/claim-layout/claim-dashboard/data/claims.data';

@Injectable({
    providedIn: 'root'
})
export class ClaimService {

    // Get all claims
    getClaims(): Observable<Claim[]> {
        return of(CLAIMS_DATA);
    }

    // Get dashboard summary
    getClaimsSummary(): Observable<ClaimsSummaryResponse> {
        return of(CLAIMS_SUMMARY_DATA);
    }

    // Get monthly claims trend
    getClaimsTrend(
        request: ClaimsTrendRequest
    ): Observable<ClaimsTrendResponse> {

        const months = request.months;

        const trend: ClaimsTrendResponse = {
            labels: CLAIMS_TREND_DATA.labels.slice(-months),
            series: Object.fromEntries(
                Object.entries(CLAIMS_TREND_DATA.series).map(
                    ([status, values]) => [
                        status,
                        values.slice(-months)
                    ]
                )
            )
        };

        return of(trend);
    }
}
