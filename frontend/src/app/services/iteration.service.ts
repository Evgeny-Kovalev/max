import { Observable, BehaviorSubject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { Task } from '../models/task.model';
import { environment } from '../../environments/environment.prod';
import { Iteration } from '../models/itaration.model';

interface IterationCreatedRes {
  message: string,
  iteration: {
    _id: string,
    projectId: string,
    startTime: string,
    finishTime: string,
  }
}

@Injectable({
	providedIn: 'root',
})
export class IterationService {
	constructor(
      private http: HttpClient,
	) { }

	getIterationById(iterationId: string): Observable<Iteration> {
		return this.http.get(`${environment.apiUrl}/iterations/${iterationId}`)
			.pipe(
				// take(1),
				map((iteration: any) => {
					const {
						_id, projectId, startTime, finishTime,
					} = iteration;
					return new Iteration(_id, projectId, new Date(startTime), new Date(finishTime));
				}),
			);
	}

	getIterations(projectId: string): Observable<Iteration[]> {
		return this.http.get(`${environment.apiUrl}/iterations`, {
			params: {
				projectId,
			},
		})
			.pipe(
				map((iterations: any) => iterations.map((iteration: any) => new Iteration(iteration._id, iteration.projectId, iteration.startTime, iteration.finishTime))),
			);
	}

	createIteration(projectId: string, iteration: {startTime: Date, finishTime: Date}): Observable<Iteration> {
		return this.http.post<IterationCreatedRes>(`${environment.apiUrl}/iterations`, {
			iteration: {
				startTime: iteration.startTime,
				finishTime: iteration.finishTime,
			},
			projectId,
		})
			.pipe(
				map((res: any) => {
					const {
						_id, projectId, startTime, finishTime,
					} = res.iteration;
					return new Iteration(_id, projectId, new Date(startTime), new Date(finishTime));
				}),
			);
	}

	editIteration(iterationId: string, iteration: {startTime: Date, finishTime: Date}): Observable<Iteration> {
		return this.http.put<IterationCreatedRes>(`${environment.apiUrl}/iterations/${iterationId}`, {
			iteration: {
				startTime: iteration.startTime,
				finishTime: iteration.finishTime,
			},
		})
			.pipe(
				map((res: any) => {
					const {
						_id, projectId, startTime, finishTime,
					} = res.iteration;
					return new Iteration(_id, projectId, new Date(startTime), new Date(finishTime));
				}),
			);
	}

	deleteIteration(iteration: Iteration) {
		return this.http.delete(`${environment.apiUrl}/iterations/${iteration.id}`);
	}
}
