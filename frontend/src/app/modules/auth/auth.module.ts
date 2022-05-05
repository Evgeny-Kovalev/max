import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { SharedModule } from '../../shared/modules/shared.module';

import { LoginPageComponent } from './pages/login-page/login-page.component';
import { SignupPageComponent } from './pages/signup-page/signup-page.component';

@NgModule({
	declarations: [
		LoginPageComponent,
		SignupPageComponent,
	],
	imports: [
		CommonModule,
		ReactiveFormsModule,
		FontAwesomeModule,
		SharedModule,
	],
	exports: [
		LoginPageComponent,
		SignupPageComponent,
	],
})

export class AuthModule { }
