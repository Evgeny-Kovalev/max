import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { TaskService } from 'src/app/services/task.service';
import { Component, OnInit, Input } from '@angular/core';
import { ToastsService } from 'src/app/modules/toasts/toasts.service';
import { Task } from 'src/app/models/task.model';
import { TaskModalService } from '../../task-modal/task-modal.service';
import { ConfirmService } from '../../confirm/confirm.service';

@Component({
	selector: 'app-board-task-item',
	templateUrl: './board-task-item.component.html',
	styleUrls: ['./board-task-item.component.scss'],
})
export class BoardTaskItemComponent implements OnInit {
	faTrash = faTrash;

	@Input() task!: Task;

	constructor(
	private confirmService: ConfirmService,
	private toastsService: ToastsService,
	private taskService: TaskService,
	private taskModalService: TaskModalService,
	) { }

	ngOnInit(): void {}

	onMoveToBacklog(e: any, task: Task): void {
		e.stopPropagation();
		this.confirmService.confirm('Are you sure you want to move the task to backlog?', () => {
			this.taskService.editTask(task.id, { iterationId: null }).subscribe(
				(res) => {
					this.toastsService.success('Task successfylly moved to backlog of the iteration!');
				},
				(err) => err && this.toastsService.error('Failed to move task!'),
			);
		});
	}

	showTaskModal(task: Task) {
		this.taskModalService.showTaskModal(task);
	}
}
