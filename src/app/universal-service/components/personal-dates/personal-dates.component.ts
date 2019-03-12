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
      this.form.valid &&
      (this.model.sharedMoneyWithTheAdult === false ||
        this.model.hasLifelineTheAdult === false ||
        this.model.liveWithAnoterAdult === false)
    ) {
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

  public formatInput(input: string, format: string) {
    // Almacenando valor real en variable temporal
    if (input.length > 1 && input.substr(input.length - 1, 1) !== 'X') {
      console.log(input.substr(input.length - 1, 1));
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
      console.log(this.authenticationService.credentials);
      console.log(this.authenticationService.credentials.userid);

      // en validateSSN {} se le envian los datos en un Objeto por el momento estan estaticos los datos
      this.authenticationService.validateSSN({}).subscribe(resp => {
        console.log(resp);
      });

      /*
        Funcional en VanillaJS
              // tslint:disable-next-line:prefer-const
      let datos = {
        USER_ID: 11,
        CUSTOMER_NAME: 'Jhonny',
        CUSTOMER_MN: 'C',
        CUSTOMER_LAST: 'Ferraz',
        CUSTOMER_SSN: '0581552714',
        CUSTOMER_DOB: '1974-3-1',
        GENDER: '1',
        CUSTOMER_ID_TYPE: '1',
        ID_NUMBER: '890980980808',
        DTS_EXP: '2021-3-1',
        DEP_APPLICATION: '',
        PHONE_1: '',
        COMUNICATION: '',
        Home: 1
      };

      fetch('http://wslifeusf.claropr.com/Service/svc/1/VALIDATE_SSN.MCAPI', {
        method: 'POST',
        body: JSON.stringify(datos),
        headers: {
          'Content-Type': 'application/json'
        }
      }).then((r) => { console.log( r ); });
    */
    }

    if (format === this.format2) {
      if (input.length === 4) {
        return (
          input.substr(0, input.length - 1) + '-' + input.substr(input.length - 1, input.length).replace(/[0-9]/g, 'X')
        );
      }

      if (input.length === 7) {
        console.log(input);
        return (
          input.substr(0, input.length - 1) + '-' + input.substr(input.length - 1, input.length).replace(/[0-9]/g, 'X')
        );
      }

      return input.replace(/[0-9]/g, 'X');
    }

    return '';
  }
}
