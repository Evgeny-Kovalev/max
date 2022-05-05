import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';

@Injectable({
	providedIn: 'root',
})
export class ConfirmService {
	private subject = new Subject<any>();

	constructor() { }

	confirm(message: string, yes: () => void, no?: () => void): void {
		this.setConfirmation(message, yes, no);
	}

	setConfirmation(message: string, yes: () => void, no?: () => void): void {
		const that = this;

		this.subject.next({
			message,
			yes() : void {
				that.subject.next();
				yes();
			},
			no(): void {
				that.subject.next();
				no && no();
			},
		});
	}

	getConfirmModal() : Observable<any> {
		return this.subject.asObservable();
	}
}
