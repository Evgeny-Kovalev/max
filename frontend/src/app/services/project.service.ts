import { Observable, BehaviorSubject, Subject } from 'rxjs';
import { map, take, tap } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { User } from '../models/user.model';
import { Project } from '../models/project.model';

interface ProjectCreatedRes {
  message: string,
  project: {
    _id: string,
    title: string,
    description: string,
    ownerId: string,
	users: [],
  }
}

@Injectable({
	providedIn: 'root',
})

export class ProjectService {
	private _projects: BehaviorSubject<Project[]> = new BehaviorSubject<Project[]>([]);
	readonly projects$: Observable<Project[]> = this._projects.asObservable();
	private projects: Project[] = [];

	private _currentProject: Subject<Project> = new Subject<Project>();
	readonly currentProject$: Observable<Project> = this._currentProject.asObservable();
	private currentProject!: Project;

	constructor(
    private http: HttpClient,
	) { }

	setCurrentProject(project: Project) {
		this.currentProject = project;
		this._currentProject.next(project);
	}

	getProjectById(id: string): Observable<Project> {
		return this.http.get(`${environment.apiUrl}/projects/${id}`)
			.pipe(
				map((project: any) => new Project(project._id, project.title, project.description, project.users)),
			);
	}

	getProjectTimesheet(id: string): Observable<any> {
		return this.http.get(`${environment.apiUrl}/projects/${id}/timesheet`)
	}

	getUserProjects(user: User): void {
		this.http.get(`${environment.apiUrl}/projects`, {
			params: {
				userId: user.id,
			},
		})
			.pipe(
				map((projects: any) => projects.map(
					(projectData: any) => new Project(projectData._id, projectData.title, projectData.desc, projectData.users),
				)),
			)
			.subscribe(
				(projects: Project[]) => {
					this.projects = projects;
					this._projects.next(projects);
				},
			);
	}

	createNewUserProject(user: User, project: {title: string, description: string, users: {}[]}): Observable<Project> {
		return this.http.post<ProjectCreatedRes>(`${environment.apiUrl}/projects`, {
			project,
			userId: user.id,
		})
			.pipe(
				map((res: ProjectCreatedRes) => {
					const { _id, title, description, users } = res.project;
					const newProject = new Project(_id, title, description, users);
					this.projects.push(newProject);
					this._projects.next(this.projects);
					return newProject;
				}),
			);
	}

	deleteProject(projectId: string) {
		return this.http.delete(`${environment.apiUrl}/projects/${projectId}`)
			.pipe(
				tap((res) => {
					this.projects = this.projects.filter((p) => p.id !== projectId);
					this._projects.next(this.projects);
				}),
			);
	}

	editProject(project: Project, projectData: {title: string, description: string}): Observable<Project> {
		return this.http.put<ProjectCreatedRes>(`${environment.apiUrl}/projects/${project.id}`, {
			project: {
				title: projectData.title,
				description: projectData.description,
			},
		})
			.pipe(
				map((res) => {
					const projectIdx = this.projects.findIndex((p) => p.id === project.id);
					const newProject = new Project(project.id, projectData.title, projectData.description, project.users);

					if (this.currentProject?.id === project.id) {
						this.currentProject = newProject;
						this._currentProject.next(newProject);
					}

					this.projects[projectIdx] = newProject;
					this._projects.next(this.projects);

					return newProject;
				}),
			);
	}
}
