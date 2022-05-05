import { Component, Input, OnInit } from '@angular/core';
import { Project } from '../../../models/project.model';
import { Iteration } from '../../../models/itaration.model';

@Component({
	selector: 'app-iteration-list',
	templateUrl: './iteration-list.component.html',
	styleUrls: ['./iteration-list.component.scss'],
})
export class IterationListComponent implements OnInit {
	@Input() iterations: Iteration[] | null = null;

	@Input() project!: Project;

	constructor() {}

	ngOnInit(): void {
	}
}
