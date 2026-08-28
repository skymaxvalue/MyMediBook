import { Injectable } from "@angular/core";
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpEventType,
  HTTP_INTERCEPTORS,
  HttpErrorResponse
} from "@angular/common/http";
import { Observable, throwError } from "rxjs";
import { tap, catchError } from "rxjs/operators";
import { ToastrService } from "ngx-toastr";
import { Router } from "@angular/router";
import { USE_ASSOCIATION_TOKEN } from './http-context-tokens';
import { ToastService } from "../shared/Components/Toaster/toast.service";

@Injectable()
export class LoggingInterceptor implements HttpInterceptor {

  constructor(
    private toast: ToastService,
    private router: Router
  ) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    // const token = localStorage.getItem('token');
    const isAssociation = request.context.get(USE_ASSOCIATION_TOKEN);
    const token = isAssociation
      ? localStorage.getItem('associationToken')
      : localStorage.getItem('token');

    if (token) {
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      });
    }

    return next.handle(request).pipe(

      // Success Response
      tap((event: any) => {

        if (event.type === HttpEventType.Response) {

          if (
            event.body?.data?.isSuccess === 1 ||
            event.body?.result === 1
          ) {

            this.toast.success('Success',
              event.body?.data?.responseMessage ||
              event.body?.responseMessage ||
              event.body?.statusMessage ||
              'Success'
            );
          }
        }
      }),

      // Error Response
      catchError((error: HttpErrorResponse) => {
        console.log(error)
        let message = 'Something went wrong.';

        switch (error.status) {

          case 0:
            message = 'Unable to connect to server. Please check your internet connection.';
            break;

          case 400:
            message =
              error.error?.data?.responseMessage ||
              error.error?.responseMessage ||
              error.error?.statusMessage ||
              'Bad Request';
            break;

          case 401: {

            message = 'Session expired. Please login again.';

            const userString = localStorage.getItem('user');

            let user: any = null;

            try {
              user = JSON.parse(userString || 'null');
            } catch {
              user = null;
            }

            // Authentication data remove करा
            localStorage.removeItem('token');
            localStorage.removeItem('refreshToken');
            localStorage.removeItem('associationToken');
            localStorage.removeItem('user');

            // Role नुसार login page
            switch (user?.roleName) {

              case 'Patient':
                this.router.navigate(['/patient/login']);
                break;

              case 'Associate':
                this.router.navigate(['/front-office/login']);
                break;

              case 'Admin':
                this.router.navigate(['/admin/login']);
                break;

              default:
                this.router.navigate(['/']);
                break;
            }

            break;
          }

          case 403:
            message = 'You are not authorized to perform this action.';
            break;

          case 404:
            message = 'Requested resource not found.';
            break;

          case 409:
            message =
              error.error?.responseMessage ||
              'Conflict occurred.';
            break;

          case 422:
            message =
              error.error?.responseMessage ||
              'Validation failed.';
            break;

          case 500:
            message = 'Internal Server Error.';
            break;

          case 503:
            message = 'Service is temporarily unavailable.';
            break;

          default:
            message =
              error.error?.data?.responseMessage ||
              error.error?.responseMessage ||
              error.error?.statusMessage ||
              error.message ||
              'Unexpected error occurred.';
        }

        this.toast.error('Error', message);

        return throwError(() => error);

      })

    );
  }
}

export const loggingInterceptorProvider = {
  provide: HTTP_INTERCEPTORS,
  useClass: LoggingInterceptor,
  multi: true,
};