import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import Util from '@app/universal-service/util';
import { AuthenticationService } from '@app/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  isLoading: boolean;

  constructor(private router: Router, private authenticationService: AuthenticationService) {
    authenticationService.validaSessionActiva();
  }

  ngOnInit() {
    this.isLoading = true;
  }

  goToUniversalService() {
    this.router.navigate(['/universal-service/personal-dates'], { replaceUrl: true });
  }

  gotoUsfCase() {
    this.router.navigate(['/usf-case'], { replaceUrl: true });
  }

  checkNumbersOnly(event: any): boolean {
    return Util.checkNumbersOnly(event);
  }
}
