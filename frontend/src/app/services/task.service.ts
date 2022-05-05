import { ToastsService } from 'src/app/modules/toasts/toasts.service';
import { transferArrayItem } from '@angular/cdk/drag-drop';
import { Task } from 'src/app/models/task.model';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, Subject } from 'rxjs';
import { Injectable } from '@angular/core';
import { map, tap } from 'rxjs/operators';
import { environment } from '../../environments/environment';

interface TaskAPI {
  _id: string,
  title: string,
  text: string,
  status: string,
  projectId: string,
  iterationId: string,
  storyPoint: number,
  assignee: string,
  startTime: Date,
  endTime: Date | null,
  timeSpent: number | null,
}

interface ResponseAPI {
  message: string,
  task: TaskAPI
}

@Injectable({
	providedIn: 'root',
})
export class TaskService {
	private _isDragDisabled: Subject<boolean> = new Subject<boolean>();

	readonly isDragDisabled$ = this._isDragDisabled.asObservable();

	private _tasks: BehaviorSubject<Task[]> = new BehaviorSubject<Task[]>([]);

	readonly tasks$: Observable<Task[]> = this._tasks.asObservable();

	private tasks: Task[] = [];

	constructor(
	private http: HttpClient,
	private toastsService: ToastsService,
	) { }

	getTaskById(taskId: string): Observable<Task> {
		return this.http.get(`${environment.apiUrl}/tasks/${taskId}`)
			.pipe(
				map((task: any) => 
					new Task(
						task._id,
						task.title,
						task.text,
						task.status,
						task.projectId,
						task.iterationId,
						task.storyPoint,
						task.assignee,
						task.startTime,
						task.endTime,
						task.timeSpent
					)
				),
			);
	}

	createTask(
		task: { title: string, text: string, projectId: string, storyPoint: number|null, assignee: string },
		iterationId: string | null = null,
	): Observable<Task> {
		return this.http
			.post<ResponseAPI>(`${environment.apiUrl}/tasks`, { task }, { params: { iterationId: iterationId || '' } })
			.pipe(
				map((res: ResponseAPI) => {
					const { task } = res;

					return new Task(
						task._id,
						task.title,
						task.text,
						task.status,
						task.projectId,
						task.iterationId,
						task.storyPoint,
						task.assignee,
						task.startTime,
						task.endTime,
						task.timeSpent
					);
				}),
			);
	}

	editTask(
		taskId: string,
		editedTask: {
			title?: string,
			text?: string,
			projectId?: string,
			iterationId?: string|null,
			status?: string,
			storyPoint?: number,
			timeSpent?: number,
			startTime?: Date,
			endTime?: Date,
		},
	) {
		return this.http.put<ResponseAPI>(`${environment.apiUrl}/tasks/${taskId}`, {
			editedTask,
		})
			.pipe(
				map((res: ResponseAPI) => {
					const { task } = res;

					const newTask = new Task(
						task._id,
						task.title,
						task.text,
						task.status,
						task.projectId,
						task.iterationId,
						task.storyPoint,
						task.assignee,
						task.startTime,
						task.endTime,
						task.timeSpent
					);
					const editableTaskIdx = this.tasks.findIndex((t) => t.id === taskId);
					this.tasks[editableTaskIdx] = newTask;
					this._tasks.next(this.tasks);
					return newTask;
				}),
			);
	}

	getTasks(options: {
		projectId: string,
		iterationId?: string,
	}) {
		return this.http.get<TaskAPI[]>(`${environment.apiUrl}/tasks`, { params: { ...options } })
			.pipe(
				map((tasks: TaskAPI[]) => tasks.map((task: TaskAPI) => 
					new Task(
						task._id,
						task.title,
						task.text,
						task.status,
						task.projectId,
						task.iterationId,
						task.storyPoint,
						task.assignee,
						task.startTime,
						task.endTime,
						task.timeSpent
					)
				)),
				tap((tasks: Task[]) => {
					this.tasks = tasks;
					this._tasks.next(this.tasks);
				}),
			);
	}

	deleteTask(task: Task) {
		return this.http.delete(`${environment.apiUrl}/tasks/${task.id}`)
			.pipe(
				tap((res) => {
					this.tasks = this.tasks.filter((t) => t.id !== task.id);
					this._tasks.next(this.tasks);
				}),
			);
	}

	drop(e: any) {
		const taskId = e.item.data;

		const startIndex = e.previousIndex;
		const finishIndex = e.currentIndex;

		const prevTasks = e.previousContainer.data.tasks;
		const nextTasks = e.container.data.tasks;
		const nextIterationId = e.container.data.iterationId;

		transferArrayItem(prevTasks, nextTasks, startIndex, finishIndex);

		this._isDragDisabled.next(true);

		this.editTask(taskId, { iterationId: nextIterationId }).subscribe(
			(res) => {
				this._isDragDisabled.next(false);
			},
			(err) => {
				transferArrayItem(nextTasks, prevTasks, startIndex, finishIndex);
				this.toastsService.error('Failed to move task!');
				this._isDragDisabled.next(false);
			},
		);
	}
}
