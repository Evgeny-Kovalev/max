import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';

import { TaskShowComponent } from './components/tasks/task-show/task-show.component';
import { IterationShowComponent } from './components/iterations/iteration-show/iteration-show.component';

import { HomePageComponent } from './components/pages/home-page/home-page.component';
import { SignupPageComponent } from './modules/auth/pages/signup-page/signup-page.component';
import { LoginPageComponent } from './modules/auth/pages/login-page/login-page.component';
import { ProjectPageComponent } from './components/pages/project-page/project-page.component';
import { BoardPageComponent } from './components/pages/board-page/board-page.component';
import { NotFoundComponent } from './components/pages/not-found/not-found.component';

const routes: Routes = [
	{ path: '', component: HomePageComponent, pathMatch: 'full' },
	{ path: 'project/:id', component: ProjectPageComponent, canActivate: [AuthGuard] },
	{ path: 'project/:id/iterations/new', component: IterationShowComponent, canActivate: [AuthGuard] },
	{ path: 'project/:id/iterations/:iterationId/edit', component: IterationShowComponent, canActivate: [AuthGuard] },
	{ path: 'project/:id/tasks/new', component: TaskShowComponent, canActivate: [AuthGuard] },
	{ path: 'project/:id/tasks/:taskId/edit', component: TaskShowComponent, canActivate: [AuthGuard] },
	{ path: 'project/:id/board/:iterationId', component: BoardPageComponent, canActivate: [AuthGuard] },
	{ path: 'login', component: LoginPageComponent },
	{ path: 'signup', component: SignupPageComponent },
	{ path: '**', component: NotFoundComponent },
];

@NgModule({
	imports: [RouterModule.forRoot(routes)],
	exports: [RouterModule],
})
export class AppRoutingModule { }
