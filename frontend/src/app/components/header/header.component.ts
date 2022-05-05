import { faBars } from '@fortawesome/free-solid-svg-icons';
import { Component, OnInit } from '@angular/core';
import { NavigationService } from '../../services/navigation.service';

@Component({
	selector: 'app-header',
	templateUrl: './header.component.html',
	styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
	faBars = faBars;

	constructor(private navService: NavigationService) { }

	ngOnInit(): void {
	}

	toggleSideNav() {
		this.navService.toggleNavState();
	}
}
