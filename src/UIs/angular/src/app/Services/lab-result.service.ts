import { Injectable, signal } from "@angular/core";
import { LabResult } from "../Models/lab-result.model";
import { LAB_RESULTS } from "../Pages/lab-result/lab-result.component";

@Injectable({
    providedIn: "root",
})
export class LabResultService {
    private readonly resultsSignal = signal<LabResult[]>(LAB_RESULTS);

    getResults() {
        return this.resultsSignal;
    }

    add(result: LabResult) {
        this.resultsSignal.update(list => [...list, result]);
    }

    update(result: LabResult) {
        this.resultsSignal.update(list =>
            list.map(x => x.id === result.id ? result : x)
        );
    }

    delete(id: number) {
        this.resultsSignal.update(list =>
            list.filter(x => x.id !== id)
        );
    }
}