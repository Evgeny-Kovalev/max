import { ToastsService } from 'src/app/modules/toasts/toasts.service';
import { TaskService } from 'src/app/services/task.service';
import { Component, OnInit, Input } from '@angular/core';
import { Task } from 'src/app/models/task.model';
import { CdkDragDrop, transferArrayItem } from '@angular/cdk/drag-drop';

@Component({
	selector: 'app-board-task-list',
	templateUrl: './board-task-list.component.html',
	styleUrls: ['./board-task-list.component.scss'],
})

export class BoardTaskListComponent implements OnInit {
	@Input() status: string = '';

	@Input() tasks: Task[] = [];

	isLoading: boolean = false;

	constructor(
	private taskService: TaskService,
	private toastsService: ToastsService,
	) { }

	ngOnInit(): void {

	}

	drop(e: CdkDragDrop<{status: string, tasks: Task[]}>) {
		if (e.previousContainer !== e.container) {
			const taskId = e.item.data;
			const nextStatus = e.container.data.status;

			const prevTasks = e.previousContainer.data.tasks;
			const nextTasks = e.container.data.tasks;

			const startIndex = e.previousIndex;
			const finishIndex = e.currentIndex;

			transferArrayItem(prevTasks, nextTasks, startIndex, finishIndex);
			this.isLoading = true;
			
			this.taskService.editTask(taskId, { status: nextStatus })
				.subscribe(
					(res) => {
						this.isLoading = false;
					},
					(err) => {
						this.isLoading = false;
						transferArrayItem(nextTasks, prevTasks, startIndex, finishIndex);
						this.toastsService.error('Failed to move task!');
					},
				);
		}
	}
}
