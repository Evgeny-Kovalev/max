import { DragDropModule } from '@angular/cdk/drag-drop';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from 'src/app/app-routing.module';
import { BoardComponent } from './board.component';
import { TaskModalModule } from '../task-modal/task-modal.module';
import { BoardTaskListComponent } from './board-task-list/board-task-list.component';
import { BoardTaskItemComponent } from './board-task-item/board-task-item.component';
import { NgbTooltip, NgbModule } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
	declarations: [
		BoardComponent,
		BoardTaskListComponent,
		BoardTaskItemComponent,
	],
	imports: [
		AppRoutingModule,
		CommonModule,
		FontAwesomeModule,
		TaskModalModule,
		DragDropModule,
		NgbModule
	],
	exports: [
		BoardComponent,
	],
	providers: [

	],
	bootstrap: [BoardComponent],
})
export class BoardModule { }
