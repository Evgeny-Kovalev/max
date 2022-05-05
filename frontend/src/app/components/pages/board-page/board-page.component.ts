import { ProjectService } from 'src/app/services/project.service';
import { faTrash, faEdit } from '@fortawesome/free-solid-svg-icons';
import { IterationService } from 'src/app/services/iteration.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Iteration } from '../../../models/itaration.model';
import { ToastsService } from '../../../modules/toasts/toasts.service';
import { Project } from '../../../models/project.model';
import { TaskService } from '../../../services/task.service';
import { ConfirmService } from '../../../modules/confirm/confirm.service';

@Component({
	selector: 'app-board-page',
	templateUrl: './board-page.component.html',
	styleUrls: ['./board-page.component.scss'],
})
export class BoardPageComponent implements OnInit, OnDestroy {
	faTrash = faTrash;

	faEdit = faEdit;

	iteration!: Iteration;

	project!: Project;

	projectSub: Subscription = new Subscription();

	isError = false;

	constructor(
    private route: ActivatedRoute,
    private router: Router,
    private iterationSerivice: IterationService,
    private confirmService: ConfirmService,
    private toastsService: ToastsService,
    private projectService: ProjectService,
    private taskService: TaskService,
	) { }

	ngOnInit(): void {
		this.route.params.subscribe((params: Params) => {
			this.projectService.getProjectById(params.id).subscribe(
				(project: Project) => {
					this.project = project;
					
					this.taskService.getTasks({ projectId: project.id }).subscribe(
						(tasks) => {},
					);
				},
				(err) => this.isError = true,
			);

			this.iterationSerivice.getIterationById(params.iterationId).subscribe(
				(iteration: Iteration) => {
					this.iteration = iteration;
				},
				(err) => this.isError = true,
			);
		});
	}

	onDeleteIteration() {
		this.confirmService.confirm('Are you sure you want to delete the iteration?', () => {
			this.iterationSerivice.deleteIteration(this.iteration).subscribe(
				(res) => {
					this.toastsService.success('Iteration deleted sucessfully!');
					this.router.navigate([`/project/${this.project.id}`]);
				},
				(err) => err && this.toastsService.error('Failed to delete iteration'),
			);
		});
	}

	ngOnDestroy(): void {
		this.projectSub.unsubscribe();
	}
}
