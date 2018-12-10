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

  contactNumber1 = '';
  contactNumber2 = '';
  format1 = 'XXX-XXX-XX-XX';

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

  numberOnly(event: any): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }

  formatInputContactNumber(input: string) {
    switch (input) {
      case 'contactNumber1': {
        this.contactNumber1 = this.formatInput(this.contactNumber1, this.format1);
        break;
      }

      case 'contactNumber2': {
        this.contactNumber2 = this.formatInput(this.contactNumber2, this.format1);
        break;
      }
    }
  }

  private formatInput(input: string, format: string) {
    if (format === this.format1) {
      if (input.length === 4) {
        return input.substr(0, input.length - 1) + '-' + input.substr(input.length - 1, input.length);
      }

      if (input.length === 8) {
        return input.substr(0, input.length - 1) + '-' + input.substr(input.length - 1, input.length);
      }

      if (input.length === 11) {
        return input.substr(0, input.length - 1) + '-' + input.substr(input.length - 1, input.length);
      }

      return input;
    }

    return '';
  }
}
