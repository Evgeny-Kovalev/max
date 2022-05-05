import { TimesheetItem } from '../../../models/TimesheetItem.model';
import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
import { IterationService } from 'src/app/services/iteration.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Project } from 'src/app/models/project.model';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Task } from 'src/app/models/task.model';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { ProjectService } from '../../../services/project.service';
import { Iteration } from '../../../models/itaration.model';
import { TaskService } from '../../../services/task.service';
import { ToastsService } from '../../../modules/toasts/toasts.service';
import { ConfirmService } from '../../../modules/confirm/confirm.service';

// const TIMESHEET: TimesheetItem[] = [
// 	{
// 	  user: {
// 		name: 'User 1',
// 		email: 'email@test.com',
// 		icon: 'icon',
// 	  },
// 	  dates: [
// 		  { value: '1/Apr', hours: '6h' },
// 		  { value: '2/Apr', hours: '5h' },
// 		  { value: '3/Apr', hours: '2h' },
// 	  ]
// 	},
// 	{
// 	  user: {
// 		name: 'User 2',
// 		email: 'email2@test.com',
// 		icon: 'icon2',
// 	  },
// 	  dates: [
// 		  { value: '1/Apr', hours: '6h' },
// 		  { value: '2/Apr', hours: null },
// 		  { value: '3/Apr', hours: '2h' },
// 	  ]
// 	},
// ];

@Component({
	selector: 'app-project-page',
	templateUrl: './project-page.component.html',
	styleUrls: ['./project-page.component.scss'],
})
export class ProjectPageComponent implements OnInit, OnDestroy {
	faEdit = faEdit;
	faTrash = faTrash;

	timesheet = [] as TimesheetItem[];

	project!: Project;
	backlog: Task[] | null = null;
	iterations: Iteration[] | null = null;

	projectSub: Subscription = new Subscription();
	taskSub: Subscription = new Subscription();
	paramsSub: Subscription = new Subscription();

	isLoading: boolean = false;
	isError: boolean = false;
	isEditMode: boolean = false;

	projectForm = new FormGroup({
		title: new FormControl('', Validators.required),
		description: new FormControl('', Validators.required),
	});

	constructor(
		private projectService: ProjectService,
		private iterationService: IterationService,
		private taskService: TaskService,
		private confirmService: ConfirmService,
		private toastsService: ToastsService,
		private route: ActivatedRoute,
		private router: Router,
	) { }

	ngOnInit(): void {
		this.paramsSub = this.route.params.subscribe((params: Params) => {
			this.isLoading = true;
			this.projectService.getProjectById(params.id).subscribe((project) => {
				this.projectService.setCurrentProject(project);
			});
		});

		this.taskSub = this.taskService.tasks$.subscribe((tasks) => {
			this.backlog = tasks.filter((t) => !t.iterationId);
		});

		this.projectSub = this.projectService.currentProject$.subscribe((project: Project) => {
			this.project = project;
			this.isLoading = false;

			this.iterationService.getIterations(this.project.id).subscribe((iterations: Iteration[]) => {
				this.iterations = iterations;
			});

			this.taskService.getTasks({ projectId: this.project.id }).subscribe(
				(tasks) => {},
			);

			this.projectService.getProjectTimesheet(this.project.id).subscribe(
				(timesheet) => {
					this.timesheet = timesheet
				},
			);

			this.projectForm.patchValue({
				title: this.project.title,
				description: this.project.description,
			});
		});
	}

	onEditProject(): void {
		const { title, description } = this.projectForm.value;

		this.project && this.projectService.editProject(this.project, { title, description })
			.subscribe(
				(project: Project) => {
					this.toastsService.success('Project edited sucessfully!');
					this.isEditMode = false;
				},
				(err) => err && this.toastsService.error('Failed to edit project.'),
			);
	}

	onDeleteProject() : void {
		this.confirmService.confirm('Are you sure you want to delete the project?', () => {
			this.project && this.projectService.deleteProject(this.project.id)
				.subscribe(
					(res) => {
						this.router.navigate(['/']);
						this.toastsService.success('Project deleted sucessfully!');
					},
					(err) => err && this.toastsService.error('Failed to delete project.'),
				);
		});
	}

	toggleEditMode() {
		this.isEditMode = !this.isEditMode;
	}

	ngOnDestroy(): void {
		this.projectSub.unsubscribe();
		this.taskSub.unsubscribe();
	}

	drop(e: any) {
		if (e.previousContainer !== e.container) this.taskService.drop(e);
	}
}
