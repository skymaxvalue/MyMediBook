import { Injectable } from "@angular/core";
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpEventType,
  HTTP_INTERCEPTORS,
} from "@angular/common/http";
import { Observable } from "rxjs";
import { tap } from "rxjs/operators";
import { ToastrService } from "ngx-toastr";


@Injectable()
export class LoggingInterceptor implements HttpInterceptor {
  constructor(
    private toastr: ToastrService
  ) { }

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const token = localStorage.getItem('token');

    if (token) {
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      });
    }
    return next.handle(request).pipe(
      tap((event: any) => {
        if (event.type === HttpEventType.Response) {
          if (event.body.data.isSuccess === 1 || event.body.result === 1) {

            console.log(request.url, event.body);
            this.toastr.success(event.body.data.responseMessage ? event.body.data.responseMessage : event.body.statusMessage)
          } else {
            this.toastr.error(event.body.data.responseMessage)
          }

        }
      })
    );
  }
}

export const loggingInterceptorProvider = {
  provide: HTTP_INTERCEPTORS,
  useClass: LoggingInterceptor,
  multi: true,
};
