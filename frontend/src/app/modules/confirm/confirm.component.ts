import { Component, OnInit } from '@angular/core';
import { ConfirmService } from './confirm.service';

@Component({
	selector: 'app-confirm',
	templateUrl: './confirm.component.html',
	styleUrls: ['./confirm.component.scss'],
})
export class ConfirmComponent implements OnInit {
	modal: any;

	constructor(
    private modalSerivece: ConfirmService,
	) { }

	ngOnInit(): void {
		this.modalSerivece.getConfirmModal().subscribe((modal) => {
			this.modal = modal;
		});
	}
}
