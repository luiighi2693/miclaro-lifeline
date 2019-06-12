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
  numberCase: '';
  isLoading: boolean;
  constructor(private router: Router, private authenticationService: AuthenticationService) {
    authenticationService.validaSessionActiva();
  }

  ngOnInit() {
    this.isLoading = true;
    this.numberCase = '';
  }

  goToUniversalService() {
    this.router.navigate(['/universal-service/personal-dates'], { replaceUrl: true });
  }

  gotoUsfCase() {
    const intemp = (<HTMLInputElement>document.getElementById('numberCaseToSearch')).value;
    localStorage.setItem('numberCaseToSearch', intemp);
    this.router.navigate(['/usf-case'], { replaceUrl: true });
  }

  checkNumbersOnly(event: any): boolean {
    return Util.checkNumbersOnly(event);
  }
}
