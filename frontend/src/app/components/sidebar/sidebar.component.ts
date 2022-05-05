import { UsersService } from './../../services/users.service';
import { Router } from '@angular/router';
import { Project } from 'src/app/models/project.model';
import { ProjectService } from 'src/app/services/project.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { faFolder, faHome, faPlusSquare } from '@fortawesome/free-solid-svg-icons';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from 'src/app/modules/auth/auth.service';
import { NavigationService } from '../../services/navigation.service';
import { User } from '../../models/user.model';
import { ToastsService } from '../../modules/toasts/toasts.service';

@Component({
	selector: 'app-sidebar',
	templateUrl: './sidebar.component.html',
	styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent implements OnInit, OnDestroy {
	showSideNav: Observable<boolean>;

	faHome = faHome;

	faPlusSquare = faPlusSquare;

	faFolder = faFolder;

	userSub: Subscription = new Subscription();

	userProjects$: Observable<Project[]> = new Observable();

	isProjectsLoading = false;

	isAuthUser = false;

	authUser: User | null = null;

	newProjectData: {
		title: string,
		description: string,
		users: { id: string, name: string, email: string }[]
	} = 
		{ title: '', description: '', users: [] };

	allUsers: any[] = [] 

	constructor(
		private navService: NavigationService,
		private authService: AuthService,
		private projectService: ProjectService,
		private toastsService: ToastsService,
		private usersService: UsersService,
		private router: Router,
		private modalService: NgbModal,
	) {
		this.showSideNav = this.navService.getShowNav();
	}

	ngOnInit(): void {
		this.showSideNav = this.navService.getShowNav();
		this.userSub = this.authService.user.subscribe((user: User) => {
			this.isAuthUser = !!user;
			this.authUser = user;

			this.authUser && this.projectService.getUserProjects(this.authUser);
			this.userProjects$ = this.projectService.projects$;
		});
		this.usersService.getUsers().subscribe(users => {
			this.allUsers = users;
			this.newProjectData.users = users
		})
	}

	onCreateProject(modal: NgbActiveModal): void {
		if (this.authUser) {
			this.projectService.createNewUserProject(this.authUser, this.newProjectData)
				.subscribe(
					async (project: Project) => {
						this.toastsService.success(`Project ${project.title} created sucessfully!`);
						modal.close();
						this.newProjectData = { title: '', description: '', users: [] };
					},
					(err) => err && this.toastsService.error('Project not created!'),
				);
		} else {
			this.router.navigate(['/login']);
		}
	}

	openModal(content: any): void {
		this.modalService.open(content);
	}

	ngOnDestroy(): void {
		this.userSub.unsubscribe();
	}
}
