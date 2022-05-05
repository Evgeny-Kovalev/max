import { AuthModule } from './../auth/auth.module';
import { ReactiveFormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from 'src/app/app-routing.module';
import { TaskModalService } from './task-modal.service';
import { TaskModalComponent } from './task-modal.component';
import { NgbAlertModule } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
	declarations: [TaskModalComponent],
	imports: [
		AppRoutingModule,
		CommonModule,
		FontAwesomeModule,
		NgbAlertModule,
		AuthModule,
		ReactiveFormsModule
	],
	exports: [
		TaskModalComponent,
	],
	providers: [
		TaskModalService,
	],
	bootstrap: [TaskModalComponent],
})
export class TaskModalModule { }
