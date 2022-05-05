import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/modules/auth/auth.service';

@Component({
	selector: 'app-auth-info',
	templateUrl: './auth-info.component.html',
	styleUrls: ['./auth-info.component.scss'],
})
export class AuthInfoComponent implements OnInit, OnDestroy {
	userSub: Subscription = new Subscription();

	isAuthUser = false;

	userName: string = '';

	constructor(private authService: AuthService) { }

	ngOnInit(): void {
		this.userSub = this.authService.user.subscribe((user) => {
			this.isAuthUser = !!user;
			if (user) {
				this.userName = user.name;
			}
		});
	}

	ngOnDestroy(): void {
		this.userSub.unsubscribe();
	}

	onLogout() {
		this.authService.logout();
	}
}
