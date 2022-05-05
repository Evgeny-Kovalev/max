import { faEdit } from '@fortawesome/free-solid-svg-icons';
import {
	Component, Input, OnInit, OnDestroy,
} from '@angular/core';
import { Task } from 'src/app/models/task.model';
import { Subscription } from 'rxjs';
import { Project } from '../../../../models/project.model';
import { Iteration } from '../../../../models/itaration.model';
import { TaskService } from '../../../../services/task.service';

@Component({
	selector: 'app-iteration-item',
	templateUrl: './iteration-item.component.html',
	styleUrls: ['./iteration-item.component.scss'],
})
export class IterationItemComponent implements OnInit, OnDestroy {
	faEdit = faEdit;

	taskSub: Subscription = new Subscription();

	@Input() iteration!: Iteration;

	@Input() project!: Project;

	iterationTasks: Task[]|null = null;

	constructor(
	private taskService: TaskService,
	) { }

	ngOnInit(): void {
		this.taskSub = this.taskService.tasks$.subscribe((tasks: Task[]|null) => {
			if (!tasks) return;
			this.iterationTasks = tasks.filter((t: Task) => t.iterationId === this.iteration.id);
		});
	}

	ngOnDestroy(): void {
		this.taskSub.unsubscribe();
	}

	drop(e: any) {
		if (e.previousContainer !== e.container) this.taskService.drop(e);
	}
}
