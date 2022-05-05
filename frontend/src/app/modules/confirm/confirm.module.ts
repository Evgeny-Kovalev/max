import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ConfirmComponent } from './confirm.component';

@NgModule({
	declarations: [
		ConfirmComponent,
	],
	imports: [
		CommonModule,
	],
	exports: [
		ConfirmComponent,
	],
})
export class ConfirmModule { }
