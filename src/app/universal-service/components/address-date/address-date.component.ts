import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '@app/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-address-date',
  templateUrl: './address-date.component.html',
  styleUrls: ['./address-date.component.scss']
})
export class AddressDateComponent implements OnInit {
  validationProcessUSPS = false;
  validationDataAddressInput = false;
  validationProcessMAILPREP = false;

  constructor(private authenticationService: AuthenticationService, private router: Router) { }

  ngOnInit() {
    window.scroll(0, 0);
  }

  goToValidationDataAddressInput() {
    this.validationProcessUSPS = true;

    setTimeout(() => {
      this.validationProcessUSPS = false;
      this.validationDataAddressInput = true;
    }, 3000);

  }

  goToRegisterCase() {
    this.validationDataAddressInput = false;
    this.validationProcessMAILPREP = true;

    setTimeout(() => {
      this.router.navigate(['/universal-service/register-case'], { replaceUrl: true });
    }, 3000);

  }



  goToHome() {
    this.router.navigate(['/home'], { replaceUrl: true });
  }

}
