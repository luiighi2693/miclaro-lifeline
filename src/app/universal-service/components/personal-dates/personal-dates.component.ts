import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '@app/core';
import { Router } from '@angular/router';
import Util from '@app/universal-service/util';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-personal-dates',
  templateUrl: './personal-dates.component.html',
  styleUrls: ['./personal-dates.component.scss']
})
export class PersonalDatesComponent implements OnInit {
  processValidationSIF = false;

  socialSecure = '';
  format2 = 'XXX-XX-XXXX';
  gender: boolean;
  liveWithAnoterAdult: boolean;
  hasLifelineTheAdult: boolean;
  sharedMoneyWithTheAdult: boolean;

  public sufixes = ['MR', 'MRS', 'ENG', 'ATTY', 'DR'];
  public idTypes = ['Licencia de Conducir', 'Pasaporte'];

  public form: FormGroup;

  constructor(private authenticationService: AuthenticationService, private router: Router, private fb: FormBuilder) { }

  ngOnInit() {
    window.scroll(0, 0);

    this.form = this.fb.group({
      sufix: [
        null,
        Validators.compose([
          Validators.required
        ])
      ],
      firstName: [
        null,
        Validators.compose([
          Validators.required
        ])
      ],
      secondName: [
        null,
        Validators.compose([
          // Validators.required
        ])
      ],
      lastName: [
        null,
        Validators.compose([
          Validators.required
        ])
      ],
      socialSecure: [
        null,
        Validators.compose([
          Validators.required
        ])
      ],
      birthday: [
        null,
        Validators.compose([
          Validators.required
        ])
      ],
      gender: [
        null,
        Validators.compose([
          Validators.required
        ])
      ],
      idType: [
        null,
        Validators.compose([
          Validators.required
        ])
      ],
      idNumber: [
        null,
        Validators.compose([
          Validators.required
        ])
      ],
      idExpirationDate: [
        null,
        Validators.compose([
          Validators.required
        ])
      ]
    });

    console.log(this.form.valid);
  }

  goToSocialSecureVerification() {
    if (this.form.valid && !this.sharedMoneyWithTheAdult) {
      this.processValidationSIF = true;

      setTimeout(() => {
        this.router.navigate(['/universal-service/social-secure-verification'], { replaceUrl: true });
      }, 3000);
    }
  }

  goToHome() {
    this.router.navigate(['/home'], { replaceUrl: true });
  }

  checkNumbersOnly(event: any): boolean {
   return Util.checkNumbersOnly(event);
  }

  checkCharactersOnly(event: any): boolean {
   return Util.checkCharactersOnly(event);
  }

  formatInputSocialSecure(input: string) {
    this.socialSecure = this.formatInput(this.socialSecure, this.format2);
  }

  private formatInput(input: string, format: string) {
    if (format === this.format2) {
      if (input.length === 4) {
        return input.substr(0, input.length - 1) + '-' + input.substr(input.length - 1, input.length);
      }

      if (input.length === 7) {
        return input.substr(0, input.length - 1) + '-' + input.substr(input.length - 1, input.length);
      }

      return input;
    }

    return '';
  }

}
