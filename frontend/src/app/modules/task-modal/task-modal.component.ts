import { AuthService } from './../auth/auth.service';
import { ToastsService } from './../toasts/toasts.service';
import { TaskService } from 'src/app/services/task.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
import { Subject, Subscription, BehaviorSubject } from 'rxjs';
import { Task } from 'src/app/models/task.model';
import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { TaskModalService } from './task-modal.service';
import { User } from 'src/app/models/user.model';

@Component({
	selector: 'app-task-modal',
	templateUrl: './task-modal.component.html',
	styleUrls: ['./task-modal.component.scss'],
})
export class TaskModalComponent implements OnInit, OnDestroy {
	faEdit = faEdit;
	faTrash = faTrash;

	task: Task|null = null;
	authUser: User|null = null;

	taskModalSub: Subscription = new Subscription();
	
	showTimeSpentInput = false;
	isEditMode = false;

	taskForm = new FormGroup({
		timeSpent: new FormControl(null),
	});


	constructor(
    	public taskModalService: TaskModalService,
    	public taskService: TaskService,
    	public authService: AuthService,
    	public toastsService: ToastsService,
		private changeDetector: ChangeDetectorRef,
	) { }

	ngOnInit(): void {
		this.taskModalSub = this.taskModalService.getTask().subscribe((task) => {
			this.task = task;
			this.taskForm.patchValue({
				timeSpent: task?.timeSpent
			})
		});
		this.authService.user.subscribe(res => {
			this.authUser = res
		})
	}

	closeModal() {
		this.taskModalService.hideTaskModal();
	}

	ngOnDestroy(): void {
		this.taskModalSub.unsubscribe();
	}

	onSetTimeSpent(): void {
		this.showTimeSpentInput = !this.showTimeSpentInput
		
		if (this.task && this.taskForm.value.timeSpent) {
			this.isEditMode = true
		}
		
	}

	onSubmit() {
		this.isEditMode = false
		if (this.task) {
			this.taskService.editTask(this.task._id,{ timeSpent: this.taskForm.value.timeSpent }).subscribe(res => {
				this.toastsService.success('Updated')
			})
		}
	}

	ngAfterContentChecked(): void {
		this.changeDetector.detectChanges();
	  }
}
