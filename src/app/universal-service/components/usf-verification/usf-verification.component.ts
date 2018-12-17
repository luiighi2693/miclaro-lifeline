import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '@app/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Util from '@app/universal-service/util';

export interface Model {
  firstName: string;
  secondName: string;
  lastName: string;
  birthday: string;
  sufix: string;
  socialSecure: string;
}

@Component({
  selector: 'app-usf-verification',
  templateUrl: './usf-verification.component.html',
  styleUrls: ['./usf-verification.component.scss']
})
export class UsfVerificationComponent implements OnInit {

  processValidationNLAD = false;

  format2 = 'XXX-XX-XXXX';

  public sufixes = ['MR', 'MRS', 'ENG', 'ATTY', 'DR'];

  public form: FormGroup;
  model: Model = new class implements Model {
    sufix = '';
    socialSecure = '';
    birthday = '';
    firstName = '';
    lastName = '';
    secondName = '';
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
      ]
    });
  }

  goToDocumentDigitalization() {
    if (this.form.valid) {
      this.processValidationNLAD = true;

      setTimeout(() => {
        this.router.navigate(['/universal-service/document-digitalization'], { replaceUrl: true });
      }, 3000);
    }
  }

  goToHome() {
    this.router.navigate(['/home'], { replaceUrl: true });
  }

  goToRegisterCase() {
    this.router.navigate(['/universal-service/register-case'], { replaceUrl: true });
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
