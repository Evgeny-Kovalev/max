import { BehaviorSubject } from 'rxjs';
import { Toast } from 'src/app/modules/toasts/toast.model';

export class ToastsService {
	private _toast = new BehaviorSubject<Toast[]>([]);

	readonly toasts$ = this._toast.asObservable();

	private toasts: Toast[] = [];

	private nextId = 0;

	constructor() { }

	private custom(
		title: string,
		text: string,
		options: {type: string} = { type: 'success' },
		delay: number = 2000,
	) : void {
		const toast = new Toast(++this.nextId, title, options.type, text);
		this.toasts.push(toast);
		this._toast.next([...this.toasts]);

		setTimeout(() => {
			this.remove(toast.id);
		}, delay);
	}

	success(text: string) : void {
		this.custom('Success!', text);
	}

	error(text: string) : void {
		this.custom('Error!', text, { type: 'error' }, 3000);
	}

	remove(toastId: number) : void {
		this.toasts = this.toasts.filter((toast) => toast.id !== toastId);
		this._toast.next([...this.toasts]);
	}
}
