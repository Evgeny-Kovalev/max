import { Component, OnInit } from '@angular/core';
import { AuthService } from './modules/auth/auth.service';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.scss'],
})
export default class AppComponent implements OnInit {
	title = 'task-manager';

	constructor(
		private authService: AuthService,
	) {}

	ngOnInit(): void {
		this.authService.autoLogin();
	}
}
