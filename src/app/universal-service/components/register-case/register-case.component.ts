import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '@app/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register-case',
  templateUrl: './register-case.component.html',
  styleUrls: ['./register-case.component.scss']
})
export class RegisterCaseComponent implements OnInit {
  dependPeopleFlag = false;

  constructor(private authenticationService: AuthenticationService, private router: Router) { }

  ngOnInit() {
    window.scroll(0, 0);
  }

  goToUsfVerification() {
    if (!this.dependPeopleFlag) {
      this.router.navigate(['/universal-service/document-digitalization'], { replaceUrl: true });
    } else {
      this.router.navigate(['/universal-service/usf-verification'], { replaceUrl: true });
    }
  }

  goToHome() {
    this.router.navigate(['/home'], { replaceUrl: true });
  }

  goToAddressDate() {
    this.router.navigate(['/universal-service/address-date'], { replaceUrl: true });
  }
}
