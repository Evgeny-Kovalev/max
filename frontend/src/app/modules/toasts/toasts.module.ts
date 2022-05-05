import { ToastsService } from 'src/app/modules/toasts/toasts.service';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ToastsComponent } from './toasts.component';

@NgModule({
	declarations: [
		ToastsComponent,
	],
	imports: [
		CommonModule,
	],
	exports: [
		ToastsComponent,
	],
	providers: [
		ToastsService,
	],
	bootstrap: [ToastsComponent],
})
export class ToastsModule { }
