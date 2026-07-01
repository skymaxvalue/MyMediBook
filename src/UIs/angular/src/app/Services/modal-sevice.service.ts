import { Injectable } from "@angular/core";
import { Subject } from "rxjs";


export interface ConfirmationConfig {
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  data?: any;
}

@Injectable({
  providedIn: "root",
})
export class ModalSeviceService {
  private confirmationSource = new Subject<ConfirmationConfig>();
  confirmation$ = this.confirmationSource.asObservable();

  private responseSource = new Subject<boolean>();
  response$ = this.responseSource.asObservable();

  open(config: ConfirmationConfig) {
    console.log('Service Open', config);
    this.confirmationSource.next(config);
  }

  confirm(result: boolean) {
    console.log('Service confirm called');
    this.responseSource.next(result);
  }
}