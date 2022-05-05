import { ToastsService } from 'src/app/modules/toasts/toasts.service';
import { Observable } from 'rxjs';
import { Component, OnInit } from '@angular/core';
import { Toast } from 'src/app/modules/toasts/toast.model';

@Component({
	selector: 'app-toasts',
	templateUrl: './toasts.component.html',
	styleUrls: ['./toasts.component.scss'],
})
export class ToastsComponent implements OnInit {
	toasts$: Observable<Toast[]> = new Observable();

	constructor(
    private toastsService: ToastsService,
	) { }

	ngOnInit(): void {
		this.toasts$ = this.toastsService.toasts$;
	}

	removeToast(toast: Toast) : void {
		this.toastsService.remove(toast.id);
	}
}
