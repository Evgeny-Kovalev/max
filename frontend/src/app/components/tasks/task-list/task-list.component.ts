import { TaskModalService } from './../../../modules/task-modal/task-modal.service';
import { faEdit, faTrash, faEye } from '@fortawesome/free-solid-svg-icons';
import { Component, Input, OnInit } from '@angular/core';
import { Task } from 'src/app/models/task.model';
import { Subscription } from 'rxjs';
import { ConfirmService } from '../../../modules/confirm/confirm.service';
import { ToastsService } from '../../../modules/toasts/toasts.service';
import { TaskService } from '../../../services/task.service';
import { Project } from '../../../models/project.model';

@Component({
	selector: 'app-task-list',
	templateUrl: './task-list.component.html',
	styleUrls: ['./task-list.component.scss'],
})
export class TaskListComponent implements OnInit {
	faEdit = faEdit;
	faTrash = faTrash;
	faEye = faEye;

	isDragDisabled: boolean = false;

	@Input() tasks: Task[] | null = null;

	@Input() project!: Project;

	dragSub: Subscription = new Subscription();

	constructor(
		private confirmService: ConfirmService,
		private taskService: TaskService,
		private toastsService: ToastsService,
		private taskModalService: TaskModalService,
	) { }

	ngOnInit(): void {
		this.dragSub = this.taskService.isDragDisabled$.subscribe((isDragDisabled: boolean) => this.isDragDisabled = isDragDisabled);
	}

	onDelete(task: Task): void {
		this.confirmService.confirm('Are you sure you want to delete the task?', () => {
			this.taskService.deleteTask(task).subscribe(
				(res) => {
					this.toastsService.success('Task successfylly deleted!');
				},
				(err) => err && this.toastsService.error('Failed to delete task!'),
			);
		});
	}

	onView(task: Task) {
		this.taskModalService.showTaskModal(task);
	}

	ngOnDestroy(): void {
		this.dragSub.unsubscribe();
	}
}
