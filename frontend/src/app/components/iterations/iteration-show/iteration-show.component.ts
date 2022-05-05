import { IterationService } from 'src/app/services/iteration.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { Iteration } from '../../../models/itaration.model';
import { ToastsService } from '../../../modules/toasts/toasts.service';

@Component({
	selector: 'app-iteration-show',
	templateUrl: './iteration-show.component.html',
	styleUrls: ['./iteration-show.component.scss'],
})
export class IterationShowComponent implements OnInit {
	iterationForm = new FormGroup({
		startTime: new FormControl(this.datePipe.transform(new Date(), 'yyyy-MM-dd'), Validators.required),
		finishTime: new FormControl(this.datePipe.transform(new Date().setDate(new Date().getDate() + 14), 'yyyy-MM-dd'), Validators.required),
	});

	iteration!: Iteration;

	projectId : string | null = null;

	constructor(
    private route: ActivatedRoute,
    private router: Router,
    private iterationService: IterationService,
    private datePipe: DatePipe,
    private toastsService: ToastsService,
	) { }

	ngOnInit(): void {
		this.route.params.subscribe((params: Params) => {
			if (params.id) this.projectId = params.id;

			params.iterationId && this.iterationService.getIterationById(params.iterationId).subscribe((iteration: Iteration) => {
				this.iteration = iteration;

				this.iterationForm.patchValue({
					startTime: this.datePipe.transform(iteration.startTime, 'yyyy-MM-dd'),
					finishTime: this.datePipe.transform(iteration.finishTime, 'yyyy-MM-dd'),
				});
			});
		});
	}

	onSubmit() {
		const newIterationData = {
			startTime: new Date(this.iterationForm.value.startTime),
			finishTime: new Date(this.iterationForm.value.finishTime),
		};

		if (this.iteration) {
			this.iterationService.editIteration(this.iteration.id, newIterationData).subscribe(
				(editedIteration: Iteration) => {
					this.router.navigate([`/project/${this.projectId}/board/${editedIteration.id}`]);
					this.toastsService.success('Iteration edited successfully!');
				},
				(error) => {
					error && this.toastsService.error('Iteration not edited. Try later.');
				},
			);
		} else {
			this.projectId && this.iterationService.createIteration(this.projectId, newIterationData).subscribe(
				(createdIteration: Iteration) => {
					this.router.navigate([`/project/${this.projectId}`]);
					this.toastsService.success('Iteration created successfully!');
				},
				(error) => {
					error && this.toastsService.error('Iteration not created. Try later.');
				},
			);
		}
	}
}
