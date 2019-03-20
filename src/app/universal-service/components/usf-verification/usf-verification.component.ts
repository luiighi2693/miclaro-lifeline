import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '@app/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Util from '@app/universal-service/util';
declare let $: any;
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
  datePicker_is_init = false;
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
      birthday: [null, Validators.compose([Validators.required])]
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
  // NUEVA ESTRUCCTURA >>>>>>>>>>>>>>>>>>>
  // tslint:disable-next-line:member-ordering
  inFormat(cadena_fecha: string) {
    const temp_str = cadena_fecha.replace('/', '');
    const temp_str2 = temp_str.replace('/', '');
    console.log(temp_str2);
    return {
      year: temp_str2.substr(4, 4),
      day: temp_str2.substr(2, 2),
      month: temp_str2.substr(0, 2)
    };
  }
  // tslint:disable-next-line:member-ordering
  public activarDatepickerFechaN() {
    if (this.datePicker_is_init === false) {
      $('#inputControl3').datepicker({
        dateFormat: 'mm/dd/yy',
        changeMonth: true,
        changeYear: true,
        yearRange: '0:+10'
      });
      this.datePicker_is_init = true;
    }
    $('#inputControl3').datepicker('show');
  }
  // tslint:disable-next-line:member-ordering
  public formateadorFecha(entrada: string) {
    // NO se aceptara mas de 10 caracteres
    if (entrada.length > 10) {
      entrada = entrada.substr(0, 10);
    }
    // Limpiando especificando caracteres permitidos
    const patron = /abcdefghijklmnopqrstuvwxyz/gi;
    const nuevoValor = '';
    entrada = entrada.replace(patron, nuevoValor);

    if (entrada.length > 2 && entrada.indexOf('/') !== 2) {
      entrada = entrada.replace('/', '');
      entrada = entrada.substr(0, 2) + '/' + entrada.substr(2, entrada.length);
    }

    if (entrada.length > 5 && entrada.indexOf('/', 5) !== 5) {
      // caso para el 2do Slash
      entrada = entrada.substr(0, 5) + '/' + entrada.substr(5, 4);
    }
    if (entrada.length >= 10) {
      console.log(this.inFormat(entrada));
    }
    return entrada;
  }

  // tslint:disable-next-line:member-ordering
  public ic_blur(ic_fecha?: any) {
    setTimeout(() => {
      const inputElement: HTMLInputElement = document.getElementById('inputControl3') as HTMLInputElement;
      const inputValue: string = inputElement.value;
      this.model.birthday = inputValue;
      console.log('#blur :' + inputValue);
    }, 200);
  }

  // tslint:disable-next-line:member-ordering
  public ic_click(ic_fecha?: any) {
    this.activarDatepickerFechaN();
  }

  // tslint:disable-next-line:member-ordering
  public ic_key_up(ic_fecha?: string) {
    this.model.birthday = this.formateadorFecha(this.model.birthday);
    console.log(this.model.birthday);
    console.log('ic_key_up');
  }
}
