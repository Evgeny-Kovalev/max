import { ProjectService } from 'src/app/services/project.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import {
	Component, OnInit,
} from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Task } from 'src/app/models/task.model';
import { Location } from '@angular/common';
import { TaskService } from '../../../services/task.service';
import { ToastsService } from '../../../modules/toasts/toasts.service';

@Component({
	selector: 'app-task-show',
	templateUrl: './task-show.component.html',
	styleUrls: ['./task-show.component.scss'],
})
export class TaskShowComponent implements OnInit {
	task: Task | null = null;

	projectId: string = '';

	iterationId: string = '';

	editedTask: Task | null = null;

	taskForm = new FormGroup({
		title: new FormControl('', Validators.required),
		text: new FormControl('', Validators.required),
		storyPoint: new FormControl(null),
		assignee: new FormControl(null),
		timeSpent: new FormControl(null),
	});

	currentProject: any = null;

	constructor(
		private route: ActivatedRoute,
		private taskService: TaskService,
		private toastsService: ToastsService,
		private projectService: ProjectService,
		private location: Location,
		
	) { }

	ngOnInit(): void {
		this.route.params.subscribe((params: Params) => {
			this.projectId = params.id;
			if (params.taskId) {
				this.taskService.getTaskById(params.taskId).subscribe((task: Task) => {
					this.task = task;

					this.taskForm.patchValue({
						title: task.title,
						text: task.text,
						storyPoint: task.storyPoint,
						assignee: task.assignee._id,
						timeSpent: task.timeSpent
					});
					
				});
			}
		});

		this.route.queryParams.subscribe((queryParam: any) => {
			this.iterationId = queryParam.iterationId;
		});
		this.projectService.getProjectById(this.projectId).subscribe(project => {
			this.currentProject = project
		})
	}

	changeAssignee(e: any) {
		this.taskForm.patchValue({
			assignee: e.target.value,
		})
	}

	onSubmit() {
		const task = {
			title: this.taskForm.value.title,
			text: this.taskForm.value.text,
			projectId: this.projectId,
			storyPoint: this.taskForm.value.storyPoint,
			assignee: this.taskForm.value.assignee,
			timeSpent: this.taskForm.value.timeSpent,
		};
		
		// CREATE NEW TASK IN ITERATION
		if (!this.task && this.iterationId) {
			this.taskService.createTask(task, this.iterationId)
				.subscribe(
					(createdTask: Task) => {
						this.toastsService.success('Task created successfully');
						this.location.back();
					},
					(err) => {
						err && this.toastsService.error('Failed to create task');
					},
				);
		}
		// CREATE NEW BACKLOG TASK
		if (!this.task && !this.iterationId) {
			this.taskService.createTask(task)
				.subscribe(
					(createdTask: Task) => {
						this.toastsService.success('Task created successfully');
						this.location.back();
					},
					(err) => {
						err && this.toastsService.error('Failed to create task');
					},
				);
		}
		// EDIT TASK
		if (this.task) {
			this.taskService.editTask(this.task.id, task)
				.subscribe(
					(editedTask: Task) => {
						this.toastsService.success('Task edited successfully');
						this.location.back();
					},
					(err) => {
						err && this.toastsService.error('Failed to create task');
					},
				);
		}
	}
}
