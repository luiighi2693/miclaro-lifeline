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
  checkSSN = false;
  valueSSN = '';
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
  }();

  constructor(private authenticationService: AuthenticationService, private router: Router, private fb: FormBuilder) {}

  ngOnInit() {
    window.scroll(0, 0);

    this.form = this.fb.group({
      sufix: [null, Validators.compose([Validators.required])],
      firstName: [null, Validators.compose([Validators.required])],
      secondName: [
        null,
        Validators.compose([
          // Validators.required
        ])
      ],
      lastName: [null, Validators.compose([Validators.required])],
      socialSecure: [null, Validators.compose([Validators.required])],
      birthday: [null, Validators.compose([Validators.required])],
      gender: [null, Validators.compose([Validators.required])],
      idType: [null, Validators.compose([Validators.required])],
      idNumber: [null, Validators.compose([Validators.required])],
      idExpirationDate: [null, Validators.compose([Validators.required])]
    });
  }

  goToSocialSecureVerification() {
    if (
      this.form.valid && this.model.socialSecure.length === 11 &&
      (this.model.sharedMoneyWithTheAdult === false ||
        this.model.hasLifelineTheAdult === false ||
        this.model.liveWithAnoterAdult === false)
    ) {
      console.log(this.model);
      this.processValidationSIF = true;

      let datos = {
        method:'validareSSNAdMcapi',
        USER_ID: this.authenticationService.credentials.userid.toString(),
        CUSTOMER_NAME: this.model.firstName,
        CUSTOMER_MN: this.model.secondName,
        CUSTOMER_LAST: this.model.lastName,
        CUSTOMER_SSN: this.valueSSN,
        CUSTOMER_DOB: this.formatDate(this.form.controls['birthday'].value),
        GENDER: this.model.gender ? '1' : '0',
        CUSTOMER_ID_TYPE: this.model.idType === 'Pasaporte' ? '0' : '1',
        ID_NUMBER: this.model.idNumber,
        DTS_EXP: this.formatDate(this.form.controls['idExpirationDate'].value),
        DEP_APPLICATION: '',
        PHONE_1: '',
        COMUNICATION: '',
        Home: this.model.liveWithAnoterAdult ? 1 : 0
      };

      console.log(datos);

      this.authenticationService.validateSSN(datos).subscribe(resp => {
        this.processValidationSIF = false;
        console.log(resp);

        if (resp.body.data.length === 0){
          this.router.navigate(['/universal-service/address-date'], { replaceUrl: true });
        } else {
          this.router.navigate(['/universal-service/social-secure-verification'], { replaceUrl: true });
        }
      });

      // setTimeout(() => {
      //   this.router.navigate(['/universal-service/social-secure-verification'], { replaceUrl: true });
      // }, 3000);
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

  public formatInput(input: string, format: string) {
    // Almacenando valor real en variable temporal
    if (input.length > 1 && input.substr(input.length - 1, 1) !== 'X') {
      // console.log(input.substr(input.length - 1, 1));
      this.valueSSN += String(input.substr(input.length - 1, 1));
    } else {
      if (input !== 'X') {
        this.valueSSN = input;
        console.log(input);
      }
    }
    // Si llega a 11 Caracteres hay que hacer la validacion Real contra el servicio
    // ya que tiene el formato XXX-XX-XXXX  de 11 caracteres serian 9 digitos
    if (input.length === 11) {
      this.checkSSN = true;
      console.log(this.valueSSN);
    }

    if (format === this.format2) {
      console.log(input);
      if (input.length === 4) {
        if (input[input.length-1] === '-') {
          return ( input.substr(0, input.length - 1) + input.substr(input.length - 1, input.length).replace(/[0-9]/g, 'X') );
        } else {
          return ( input.substr(0, input.length - 1) + '-' + input.substr(input.length - 1, input.length).replace(/[0-9]/g, 'X') );
        }
      }

      if (input.length === 7) {
        console.log(input);
        if (input[input.length-1] === '-') {
          return ( input.substr(0, input.length - 1) + input.substr(input.length - 1, input.length) );
        } else {
          return ( input.substr(0, input.length - 1) + '-' + input.substr(input.length - 1, input.length) );
        }
      }

      if (input.length > 7) {
        return input;
      } else {
        return input.replace(/[0-9]/g, 'X');
      }
    }

    return '';
  }

  public formatDate(date: any){
    return date.year + '-' + date.month + '-' + date.day
  }
}
