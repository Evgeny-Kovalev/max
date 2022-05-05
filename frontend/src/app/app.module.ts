import { TaskModalModule } from './modules/task-modal/task-modal.module';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { DatePipe } from '@angular/common';
import { AuthModule } from './modules/auth/auth.module';
import { ToastsModule } from './modules/toasts/toasts.module';
import { BoardModule } from './modules/board/board.module';
import { SharedModule } from './shared/modules/shared.module';
import { ConfirmModule } from './modules/confirm/confirm.module';
import { AppRoutingModule } from './app-routing.module';

import { ErrorInterceptor } from './interceptors/error.interceptor';
import { AuthInterceptor } from './interceptors/auth.interceptor';

import AppComponent from './app.component';
import { HeaderComponent } from './components/header/header.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { AuthInfoComponent } from './components/header/auth-info/auth-info.component';

import { NotFoundComponent } from './components/pages/not-found/not-found.component';
import { BoardPageComponent } from './components/pages/board-page/board-page.component';
import { ProjectPageComponent } from './components/pages/project-page/project-page.component';
import { HomePageComponent } from './components/pages/home-page/home-page.component';

import { TaskListComponent } from './components/tasks/task-list/task-list.component';
import { TaskShowComponent } from './components/tasks/task-show/task-show.component';

import { IterationItemComponent } from './components/iterations/iteration-list/iteration-item/iteration-item.component';
import { IterationShowComponent } from './components/iterations/iteration-show/iteration-show.component';
import { IterationListComponent } from './components/iterations/iteration-list/iteration-list.component';

@NgModule({
	declarations: [
		AppComponent,
		HeaderComponent,
		SidebarComponent,
		AuthInfoComponent,
		NotFoundComponent,
		BoardPageComponent,
		ProjectPageComponent,
		HomePageComponent,
		IterationListComponent,
		IterationShowComponent,
		TaskShowComponent,
		TaskListComponent,
		IterationItemComponent,
	],
	imports: [
		BrowserModule,
		AppRoutingModule,
		FontAwesomeModule,
		NgbModule,
		FormsModule,
		HttpClientModule,
		ReactiveFormsModule,
		BoardModule,
		TaskModalModule,
		ToastsModule,
		AuthModule,
		SharedModule,
		ConfirmModule,
		DragDropModule,
	],
	providers: [
		{
			provide: HTTP_INTERCEPTORS,
			useClass: AuthInterceptor,
			multi: true,
		},
		{
			provide: HTTP_INTERCEPTORS,
			useClass: ErrorInterceptor,
			multi: true,
		},
		DatePipe,
	],
	bootstrap: [AppComponent],
})
export class AppModule { }
