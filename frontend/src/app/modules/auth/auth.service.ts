import { Injectable } from '@angular/core';
import { tap } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { User } from 'src/app/models/user.model';
import { ToastsService } from '../toasts/toasts.service';
import { environment } from '../../../environments/environment.prod';

interface AuthResponseData {
	message: string,
	user: {
		_id: string,
		name: string,
		email: string,
		roles: string[],
		token: string,
		expiresIn: string
	},
}

@Injectable({
	providedIn: 'root',
})
export class AuthService {
	user = new BehaviorSubject<any>(null);

	private tokenExpirationTimer: any;

	constructor(
    private http: HttpClient,
    private router: Router,
    private toastsService: ToastsService,
	) { }

	hasUser() {
		return !!this.user.value;
	}

	singup(name: string, email: string, password: string) {
		return this.http
			.post<AuthResponseData>(`${environment.apiUrl}/auth/signup`, { name, email, password })
			.pipe(
				tap((resData) => {
					const {
						_id: id, name, email, roles, token, expiresIn,
					} = resData.user;
					this.handleAuth(id, name, email, roles, token, +expiresIn);
				}),
			);
	}

	login(email: string, password: string) {
		return this.http
			.post<any>(`${environment.apiUrl}/auth/login`, { email, password })
			.pipe(
				tap((resData) => {
					const {
						_id: id, name, email, roles, token, expiresIn,
					} = resData.user;
					this.handleAuth(id, name, email, roles, token, +expiresIn);
				}),
			);
	}

	autoLogin() {
		const data: {
			id: string,
			name: string,
			email: string
			roles: string[],
			_token: string,
			_tokenExpirationDate: string
		} = JSON.parse(localStorage.getItem('userData')!);

		if (!data) return;

		const {
			id, name, email, roles, _token, _tokenExpirationDate,
		} = data;

		const loadedUser = new User(id, name, email, roles, _token, new Date(_tokenExpirationDate));

		if (loadedUser.token) {
			this.user.next(loadedUser);
			const expirationDuration = new Date(_tokenExpirationDate).getTime() - new Date().getTime();
			this.autoLogout(expirationDuration);
		}
	}

	logout() {
		this.user.next(null);
		this.router.navigate(['/login']);
		localStorage.removeItem('userData');
		if (this.tokenExpirationTimer) {
			clearTimeout(this.tokenExpirationTimer);
		}
		this.tokenExpirationTimer = null;
	}

	autoLogout(expirationDuration: number) {
		this.tokenExpirationTimer = setTimeout(() => {
			this.toastsService.error('Session timed out. Please, log in again.');
			this.logout();
		}, expirationDuration);
	}

	private handleAuth(id: string, name: string, email: string, roles: string[], token: string, expiresIn: number) {
		const expirationDate = new Date(new Date().getTime() + expiresIn);
		const user = new User(id, name, email, roles, token, expirationDate);

		this.user.next(user);
		this.autoLogout(expiresIn);
		localStorage.setItem('userData', JSON.stringify(user));
	}
}
