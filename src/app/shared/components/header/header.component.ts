import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '@app/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  constructor(public authenticationService: AuthenticationService, private router: Router) {}

  ngOnInit() {}

  validateSession() {
    if (this.authenticationService !== undefined) {
      return this.authenticationService.getCredentials() !== null;
    } else {
      return false;
    }
  }

  logout() {
    this.router.navigate(['/login'], { replaceUrl: true });
  }

  goToHome() {
    this.router.navigate(['/home'], { replaceUrl: true });
  }
}
