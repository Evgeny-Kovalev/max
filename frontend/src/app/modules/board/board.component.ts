import { TaskService } from 'src/app/services/task.service';
import {
	Component, OnInit, OnDestroy, Input,
} from '@angular/core';
import { Subscription } from 'rxjs';
import { Iteration } from 'src/app/models/itaration.model';
import { ToastsService } from 'src/app/modules/toasts/toasts.service';
import { Task } from 'src/app/models/task.model';

interface BoardColumn {
	status: string,
	position: number,
	tasks: Task[]
}

@Component({
	selector: 'app-board',
	templateUrl: './board.component.html',
	styleUrls: ['./board.component.scss'],
})
export class BoardComponent implements OnInit, OnDestroy {
	@Input() iteration!: Iteration;

	iterationTasks!: Task[];

	taskSub: Subscription = new Subscription();

	board: BoardColumn[] = [
		{ status: 'Todo', tasks: [], position: 0 },
		{ status: 'Doing', tasks: [], position: 1 },
		{ status: 'Done', tasks: [], position: 2 },
	];

	constructor(
	private taskService: TaskService,
	private toastsService: ToastsService,
	) { }

	ngOnInit(): void {
		this.taskSub = this.taskService.tasks$.subscribe(
			(tasks: Task[]) => {
				this.iterationTasks = tasks.filter((task) => task.iterationId === this.iteration.id);
				this.board = this.formatTasksToBoard(this.iterationTasks);
			},
			(err) => this.toastsService.error('Failed to load iteration tasks!'),
		);
	}

	private formatTasksToBoard(tasks: Task[]): BoardColumn[] {
		const startArray = [
			{ status: 'todo', tasks: [], position: 0 },
			{ status: 'doing', tasks: [], position: 1 },
			{ status: 'done', tasks: [], position: 2 },
		];

		return tasks.reduce((acc: BoardColumn[], task: Task) => {
			const idx: number = acc.findIndex((item: BoardColumn) => item.status.toLowerCase() === task?.status?.toLowerCase());

			if (idx >= 0) {
				acc[idx].tasks.push(task);
			} else {
				task.status && acc.push({
					status: task.status,
					tasks: [task],
					position: acc[acc.length - 1].position + 1,
				});
			}
			return acc;
		}, startArray)
			.sort((a: BoardColumn, b: BoardColumn) => a.position - b.position);
	}

	ngOnDestroy(): void {
		this.taskSub.unsubscribe();
	}
}
