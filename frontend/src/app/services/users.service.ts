import { ToastsService } from 'src/app/modules/toasts/toasts.service';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, Subject } from 'rxjs';
import { Injectable } from '@angular/core';
import { map, tap } from 'rxjs/operators';
import { environment } from '../../environments/environment';

interface UserRes {
	id: string,
	name: string,
	email: string,
	icon: string,
}

@Injectable({
	providedIn: 'root',
})
export class UsersService {
	private _users: BehaviorSubject<UserRes[]> = new BehaviorSubject<UserRes[]>([]);

	readonly users$: Observable<UserRes[]> = this._users.asObservable();

	private users: UserRes[] = [];

	constructor( private http: HttpClient ) { }

	getUsers() {
		return this.http.get<UserRes[]>(`${environment.apiUrl}/users`)
			.pipe(
				tap((users: UserRes[]) => {
					this.users = users;
					this._users.next(this.users);
				}),
			);
	}



}
