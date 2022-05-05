import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastsService } from 'src/app/modules/toasts/toasts.service';
import { faAt, faUser, faLock } from '@fortawesome/free-solid-svg-icons';
import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../auth.service';

@Component({
	selector: 'app-signup-page',
	templateUrl: './signup-page.component.html',
	styleUrls: ['./signup-page.component.scss'],
})
export class SignupPageComponent implements OnInit {
	faAt = faAt;

	faUser = faUser;

	faLock = faLock;

	form : FormGroup;

	isLoading = false;

	error: string = '';

	constructor(
    private authService: AuthService,
    private toastsService: ToastsService,
    private router: Router,
	) {
		this.form = new FormGroup({
			name: new FormControl('', [Validators.required]),
			email: new FormControl('', [Validators.required, Validators.email]),
			password: new FormControl('', [Validators.required, Validators.minLength(5)]),
		});
	}

	ngOnInit(): void {
	}

	onSubmit() {
		this.isLoading = true;

		const { email, password, name } = this.form.value;

		this.authService.singup(name, email, password).subscribe(
			(res) => {
				this.toastsService.success(`Hello, ${res.user.name}`);
				this.router.navigate(['/']);
				this.error = '';
				this.isLoading = false;
			},
			(error) => {
				this.error = error;
				this.isLoading = false;
			},
		);
	}
}
