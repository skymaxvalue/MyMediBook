import { Injectable } from "@angular/core";
import { Subject } from "rxjs";
import { ConfirmationModalConfig } from 'src/app/Utility/EndPointsOfAPI';



@Injectable({
  providedIn: "root",
})
export class ModalSeviceService {
  private confirmationSource = new Subject<ConfirmationModalConfig>();
  confirmation$ = this.confirmationSource.asObservable();

  private responseSource = new Subject<boolean>();
  response$ = this.responseSource.asObservable();

  open(config: ConfirmationModalConfig) {
    console.log('Service Open', config);
    this.confirmationSource.next(config);
  }

  confirm(result: boolean) {
    console.log('Service confirm called');
    this.responseSource.next(result);
  }
}