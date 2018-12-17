import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '@app/core';
import { Router } from '@angular/router';
import Util from '@app/universal-service/util';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

export interface Model {
  firstName: string;
  secondName: string;
  lastName: string;
  birthday: string;
  idType: string;
  idNumber: string;
  idExpirationDate: string;
  sufix: string;
  liveWithAnoterAdult: boolean;
  hasLifelineTheAdult: boolean;
  sharedMoneyWithTheAdult: boolean;
  socialSecure: string;
  gender: boolean;
}

@Component({
  selector: 'app-personal-dates',
  templateUrl: './personal-dates.component.html',
  styleUrls: ['./personal-dates.component.scss']
})
export class PersonalDatesComponent implements OnInit {
  processValidationSIF = false;
  format2 = 'XXX-XX-XXXX';

  public sufixes = ['MR', 'MRS', 'ENG', 'ATTY', 'DR'];
  public idTypes = ['Licencia de Conducir', 'Pasaporte'];

  public form: FormGroup;
  model: Model = new class implements Model {
    sufix = '';
    gender: boolean;
    socialSecure = '';
    birthday = '';
    firstName = '';
    idExpirationDate = '';
    idNumber = '';
    idType = '';
    lastName = '';
    secondName = '';
    liveWithAnoterAdult: boolean;
    hasLifelineTheAdult: boolean;
    sharedMoneyWithTheAdult: boolean;
  };

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
  }

  goToSocialSecureVerification() {
    if (this.form.valid && !this.model.sharedMoneyWithTheAdult) {
      console.log(this.model);
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
    this.model.socialSecure = this.formatInput(this.model.socialSecure, this.format2);
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
