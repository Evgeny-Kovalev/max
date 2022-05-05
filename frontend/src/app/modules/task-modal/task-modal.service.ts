import { Task } from 'src/app/models/task.model';
import { Subject, Observable } from 'rxjs';
import { Injectable } from '@angular/core';

@Injectable({
	providedIn: 'any',
})
export class TaskModalService {
	show: boolean = false;

	private task$: Subject<Task|null> = new Subject<Task|null>();

	constructor() { }

	getTask(): Observable<Task|null> {
		return this.task$.asObservable();
	}

	showTaskModal(task: Task|null) {
		this.show = true;
		this.task$.next(task);
	}

	hideTaskModal() {
		this.show = false;
		this.task$.next(null);
	}

	toggleModal() {
		this.show = !this.show;
	}
}
