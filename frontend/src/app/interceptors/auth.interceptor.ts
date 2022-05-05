import { take, exhaustMap } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import {
	HttpRequest,
	HttpHandler,
	HttpEvent,
	HttpInterceptor,
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from '../modules/auth/auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
	constructor(private authService: AuthService) {}

	intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
		return this.authService.user.pipe(
			take(1),
			exhaustMap((user) => {
				if (!user) return next.handle(req);

				req = req.clone({
					setHeaders: {
						Authorization: `Bearer ${user.token}`,
					},
				});
				return next.handle(req);
			}),
		);
	}
}
