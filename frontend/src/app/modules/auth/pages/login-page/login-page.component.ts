import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastsService } from 'src/app/modules/toasts/toasts.service';
import { faLock, faAt } from '@fortawesome/free-solid-svg-icons';
import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../auth.service';

@Component({
	selector: 'app-login-page',
	templateUrl: './login-page.component.html',
	styleUrls: ['./login-page.component.scss'],
})
export class LoginPageComponent implements OnInit {
	faLock = faLock;

	faAt = faAt;

	form: FormGroup;

	isLoading = false;

	error: string = '';

	constructor(
    private authService: AuthService,
    private toastsService: ToastsService,
    private router: Router,
	) {
		this.form = new FormGroup({
			email: new FormControl('', [Validators.required, Validators.email]),
			password: new FormControl('', [Validators.required, Validators.minLength(5)]),
		});
	}

	ngOnInit(): void {
	}

	onSubmit() {
		this.isLoading = true;

		const { email, password } = this.form.value;

		this.authService.login(email, password)
			.subscribe(
				(res) => {
					this.toastsService.success(`Hello, ${res.user.name}`);
					this.router.navigate(['/']);
					this.error = '';
					this.isLoading = false;
				},
				(err) => {
					this.isLoading = false;
					if (err) this.error = 'User is not logged in.';
				},
			);
	}
}
