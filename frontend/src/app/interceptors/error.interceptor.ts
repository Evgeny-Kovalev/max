import { Injectable } from '@angular/core';
import {
	HttpRequest,
	HttpHandler,
	HttpEvent,
	HttpInterceptor,
	HttpErrorResponse,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';
import { ToastsService } from '../modules/toasts/toasts.service';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
	constructor(
    private toastsService: ToastsService,
	) {}

	intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
		return next.handle(req)
			.pipe(
				retry(1),
				catchError((err: HttpErrorResponse) => {
					if (err.error.message) {
						this.toastsService.error(err.error.message);
						return throwError(null);
					}
					return throwError(err);
				}),
			);
	}
}
