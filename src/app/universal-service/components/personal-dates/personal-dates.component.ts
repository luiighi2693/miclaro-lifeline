import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '@app/core';
import { Router } from '@angular/router';
import Util from '@app/universal-service/util';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UsfServiceService } from '@app/core/usf/usf-service.service';
import { BaseComponent } from '@app/core/base/BaseComponent';
// para poder usar Jquery de forma limpia solo donde es necesario
// y de esta forma se pueden usar todas sus librerias y dependencias
// como lo es datepicker y extras de JqueryUI
declare let $: any;

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
export class PersonalDatesComponent extends BaseComponent implements OnInit {
  checkSSN = false;
  invalidSSN = false;
  valueSSN = '';
  processValidationSIF = false;
  format2 = 'XXX-XX-XXXX';
  valueBirthday = '';
  valueExpirationDate = '';
  datePicker_is_init = false;
  inputControl = '';
  inputControl2 = '';

  public sufixes = ['MR', 'MRS', 'ENG', 'ATTY', 'DR'];
  public idTypes = ['Licencia de Conducir', 'Pasaporte'];

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

  // tslint:disable-next-line:max-line-length
  constructor(
    public authenticationService: AuthenticationService,
    public usfServiceService: UsfServiceService,
    public router: Router,
    public fb: FormBuilder
  ) {
    super(authenticationService, usfServiceService, router, fb);

    /*formato de datepicker para jquery-ui (Calendario)  */
    $(document).ready(function() {
      $('#inputControl').datepicker({
        dateFormat: 'mm/dd/yy',
        changeMonth: true,
        changeYear: true,
        yearRange: '-100:-18',
        defaultDate: '-18y'
      });
      $('#inputControl2').datepicker({
        dateFormat: 'mm/dd/yy',
        changeMonth: true,
        changeYear: true,
        yearRange: '+0:+10'
      });

      $('#dp_fecha_nacimiento').datepicker({
        dateFormat: 'mm/dd/yy',
        changeMonth: true,
        changeYear: true,
        // yearRange: '-100:+0',
        yearRange: '-100:-18',
        defaultDate: '-18y'
      });
      $('#dp_fecha_expiracion').datepicker({
        dateFormat: 'mm/dd/yy',
        changeMonth: true,
        changeYear: true
      });
      this.datePicker_is_init = true;
      // Activadores Iconos de calendarrio
      $('#activadorFN').on('click', function(e: any) {
        $('#dp_fecha_nacimiento').datepicker('show');
      });
      $('#activadorFEXP').on('click', function(e: any) {
        $('#dp_fecha_expiracion').datepicker('show');
      });
    });
  }

  ngOnInit() {
    window.scroll(0, 0);
    this.usfServiceService.setValidateSSNData();

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

  goToSocialSecureVerification() {
    console.log(this.formatDate(this.inFormat(this.valueBirthday)));
    // aqui abajo es que esta dando el error
    // console.log(this.formatDate(this.form.controls['birthday'].value));
    if (
      this.form.valid &&
      this.model.socialSecure.length === 11 &&
      (this.model.sharedMoneyWithTheAdult === false ||
        this.model.hasLifelineTheAdult === false ||
        this.model.liveWithAnoterAdult === false)
    ) {
      console.log(this.model);
      this.processValidationSIF = true;
      const datos = {
        method: 'validareSSNAdMcapi',
        USER_ID: this.authenticationService.credentials.userid.toString(),
        CUSTOMER_NAME: this.model.firstName,
        CUSTOMER_MN: this.model.secondName,
        CUSTOMER_LAST: this.model.lastName,
        CUSTOMER_SSN: this.valueSSN,
        // CUSTOMER_DOB: this.formatDate(this.form.controls['birthday'].value),
        // date.year + '-' + date.month + '-' + date.day
        CUSTOMER_DOB: this.formatDate(this.inFormat(this.valueBirthday)),
        GENDER: this.model.gender ? '1' : '0',
        CUSTOMER_ID_TYPE: this.model.idType === 'Pasaporte' ? '0' : '1',
        ID_NUMBER: this.model.idNumber,
        // DTS_EXP: this.formatDate(this.form.controls['idExpirationDate'].value),
        DTS_EXP: this.formatDate(this.inFormat(this.valueExpirationDate)),
        // DEP_APPLICATION: '',
        // PHONE_1: '',
        // COMUNICATION: '',
        Home: this.model.liveWithAnoterAdult ? 1 : 0
      };

      console.log(datos);

      this.usfServiceService.validateSSN(datos).subscribe(resp => {
        this.processValidationSIF = false;
        this.usfServiceService.setValidateSSNData(resp.body);
        console.log(resp);

        if (resp.body.data.length === 0) {
          this.router.navigate(['/universal-service/address-date'], { replaceUrl: true });
        } else {
          this.router.navigate(['/universal-service/social-secure-verification'], { replaceUrl: true });
        }
      });
    }
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
      if (input !== 'X' && input !== 'XXX-XX-XXXX') {
        this.valueSSN = input;
        // console.log(input);
      }
    }

    // tslint:disable-next-line:radix
    if (input.length === 11 && parseInt(this.valueSSN) > 99999999 === false) {
      this.invalidSSN = true;
    }

    // Si llega a 11 Caracteres hay que hacer la validacion Real contra el servicio
    // ya que tiene el formato XXX-XX-XXXX  de 11 caracteres serian 9 digitos
    // parseInt( this.valueSSN ) > 99999999 [USADO PARA VALIDAR Y CUMPLIR LA CONDICION QUE SEA NUERICO Y DE 9 DIGITOS ]
    // tslint:disable-next-line:radix
    if (input.length === 11 && parseInt(this.valueSSN) > 99999999) {
      this.invalidSSN = false;
      this.checkSSN = true;
      console.log(this.valueSSN);
    }

    if (format === this.format2) {
      console.log(input);
      if (input.length === 4) {
        if (input[input.length - 1] === '-') {
          return (
            input.substr(0, input.length - 1) + input.substr(input.length - 1, input.length)
          );
        } else {
          return (
            input.substr(0, input.length - 1) +
            '-' +
            input.substr(input.length - 1, input.length)
          );
        }
      }

      if (input.length === 7) {
        console.log(input);
        if (input[input.length - 1] === '-') {
          return input.substr(0, input.length - 1) + input.substr(input.length - 1, input.length);
        } else {
          return input.substr(0, input.length - 1) + '-' + input.substr(input.length - 1, input.length);
        }
      }

      if (input.length > 7) {
        return input;
      } else {
        return input;
      }
    }

    return '';
  }

  public setFechaExpiracion(entrada: string) {
    const inputElement: HTMLInputElement = document.getElementById('dp_fecha_expiracion') as HTMLInputElement;
    const inputValue: string = inputElement.value;

    if (entrada.length > 2 && entrada.indexOf('/') !== 2) {
      entrada = entrada.replace('/', '');
      console.log(entrada);
      entrada = entrada.substr(0, 2) + '/' + entrada.substr(2, entrada.length);
      this.valueExpirationDate = entrada;
      this.model.idExpirationDate = entrada;
    }

    console.log(entrada + ' :' + entrada.length);
    console.log(inputValue + ' :' + inputValue.length);

    if (entrada.length > 5 && entrada.indexOf('/', 5) !== 5) {
      // caso para el 2do Slash
      console.log(entrada.substr(0, 5) + '/' + entrada.substr(5, 4));
      entrada = entrada.substr(0, 5) + '/' + entrada.substr(5, 4);
      this.valueExpirationDate = entrada;
      this.model.idExpirationDate = entrada;
    }

    if (entrada.length >= 10) {
      console.log(this.inFormat(entrada));
      console.log(inputValue);
    }
  }
  public inDelayDatePicker() {
    const inputElement: HTMLInputElement = document.getElementById('dp_fecha_nacimiento') as HTMLInputElement;
    // tslint:disable-next-line:prefer-const
    let entrada = '';
    if (inputElement != null) {
      entrada = inputElement.value;
    }
    console.log('in delay ' + entrada);
    if (entrada.length > 2 && entrada.indexOf('/') !== 2) {
      entrada = entrada.replace('/', '');
      console.log(entrada);
      entrada = entrada.substr(0, 2) + '/' + entrada.substr(2, entrada.length);
      this.valueBirthday = entrada;
      this.model.birthday = entrada;
    }
    if (entrada.length > 5 && entrada.indexOf('/', 5) !== 5) {
      // caso para el 2do Slash
      console.log(entrada.substr(0, 5) + '/' + entrada.substr(5, 4));
      entrada = entrada.substr(0, 5) + '/' + entrada.substr(5, 4);
      this.valueBirthday = entrada;
      this.model.birthday = entrada;
    }
    if (entrada.length >= 10) {
      console.log(this.inFormat(entrada));
      console.log(entrada);
    }
    $('#activadorFN').click();
    return;
  }
  public setFechaNacimiento(entrada: string) {
    const inputElement: HTMLInputElement = document.getElementById('dp_fecha_nacimiento') as HTMLInputElement;
    const inputValue: string = inputElement.value;

    if (entrada.length > 2 && entrada.indexOf('/') !== 2) {
      entrada = entrada.replace('/', '');
      console.log(entrada);

      // console.log(inputValue.substr(0, 2) + '/' + inputValue.substr(2, entrada.length));
      entrada = entrada.substr(0, 2) + '/' + entrada.substr(2, entrada.length);
      // this.valueBirthday = entrada;
      // this.model.birthday = entrada;
    }

    if (entrada.length > 5 && entrada.indexOf('/', 5) !== 5) {
      // caso para el 2do Slash
      console.log(entrada.substr(0, 5) + '/' + entrada.substr(5, 4));
      entrada = entrada.substr(0, 5) + '/' + entrada.substr(5, 4);
      // this.valueBirthday = entrada;
      // this.model.birthday = entrada;
    }

    console.log(entrada + ' :' + entrada.length);
    if (entrada.length === 0) {
      setTimeout(() => {
        this.inDelayDatePicker();
      }, 150);
    }

    if (entrada.length >= 10) {
      console.log('#' + this.model.birthday);
      console.log('##' + this.valueBirthday);
      console.log(this.inFormat(entrada));
      console.log(inputValue);
      // $('#dp_fecha_nacimiento').datepicker('show');
    }
  }

  public activarDatepickerFechaNacimiento(entrada?: string) {
    if (entrada) {
      console.log('in-> ' + entrada);
    }
    console.log('activarDatepickerFechaNacimiento: ' + this.valueBirthday);
    if (document.getElementById('dp_fecha_nacimiento') != null) {
      const inputElement: HTMLInputElement = document.getElementById('dp_fecha_nacimiento') as HTMLInputElement;
      const inputValue: string = inputElement.value;
      console.log(inputValue);
      // Dentro del ciclo y la condicion
      console.log(this.datePicker_is_init);
      if (this.datePicker_is_init === false) {
        // si por alguna razon no se inicializa  lo inicializamos en este punto
        // y solo va a entrar una vez ya que antes de salir del IF cambiamos el flag
        $('#dp_fecha_nacimiento').datepicker({
          dateFormat: 'mm/dd/yy',
          changeMonth: true,
          changeYear: true,
          // yearRange: '-100:+0',
          yearRange: '-100:-18',
          defaultDate: '-18y'
        });
        $('#inputControl').datepicker({
          dateFormat: 'mm/dd/yy',
          changeMonth: true,
          changeYear: true,
          yearRange: '-100:-18',
          defaultDate: '-18y'
        });

        $('#inputControl2').datepicker({
          dateFormat: 'mm/dd/yy',
          changeMonth: true,
          changeYear: true,
          yearRange: '+0:+10'
        });

        // Activadores Iconos de calendarrio
        $('#activadorFN').on('click', function(e: any) {
          $('#dp_fecha_nacimiento').datepicker('show');
        });
        // Lo mostramos
        $('#dp_fecha_nacimiento').datepicker('show');
        this.datePicker_is_init = true;
      }
    }
  }

  public activarDatepickerFechaExpiracion(entrada?: string) {
    if (entrada) {
      console.log('in-> ' + entrada);
    }
    console.log('activarDatepickerFechaExpiracion: ' + this.valueExpirationDate);
    if (document.getElementById('dp_fecha_expiracion') != null) {
      const inputElement: HTMLInputElement = document.getElementById('dp_fecha_expiracion') as HTMLInputElement;
      const inputValue: string = inputElement.value;
      console.log(inputValue);
    }
  }

  // NUEVA ESTRUCCTURA >>>>>>>>>>>>>>>>>>>
  public activarDatepickerFechaN() {
    if (this.datePicker_is_init === false) {
      $('#inputControl').datepicker({
        dateFormat: 'mm/dd/yy',
        changeMonth: true,
        changeYear: true,
        yearRange: '-100:-18',
        defaultDate: '-18y'
      });
      $('#inputControl2').datepicker({
        dateFormat: 'mm/dd/yy',
        changeMonth: true,
        changeYear: true,
        yearRange: '0:+10'
      });
      this.datePicker_is_init = true;
    }
    $('#inputControl').datepicker('show');
  }
  public activarDatepickerFechaE() {
    if (this.datePicker_is_init === false) {
      $('#inputControl').datepicker({
        dateFormat: 'mm/dd/yy',
        changeMonth: true,
        changeYear: true,
        yearRange: '-100:-18',
        defaultDate: '-18y'
      });
      $('#inputControl2').datepicker({
        dateFormat: 'mm/dd/yy',
        changeMonth: true,
        changeYear: true,
        yearRange: '+0:+10'
      });
      this.datePicker_is_init = true;
    }
    $('#inputControl2').datepicker('show');
  }
  // Pruebas de control de evento
  public ic_in(entra: any) {
    console.log(entra);
    console.log('ic_in');
  }
  public ic_blur(ic_fecha?: any) {
    console.log(ic_fecha);
    console.log(this.inputControl);
    console.log('ic_blur');
    setTimeout(() => {
      const inputElement: HTMLInputElement = document.getElementById('inputControl') as HTMLInputElement;
      const inputValue: string = inputElement.value;
      this.valueBirthday = inputValue;
      this.model.birthday = inputValue;
      this.inputControl = inputValue;
      console.log('#blur :' + inputValue);
    }, 200);
  }

  public ic_click(ic_fecha?: any) {
    console.log(ic_fecha);
    console.log(this.inputControl);
    console.log('ic_click');
  }

  public ic_key_up(ic_fecha?: string) {
    console.log(ic_fecha);
    console.log(this.inputControl);
    console.log('ic_key_up');
  }

  public ic_change(ic_fecha?: string) {
    console.log(ic_fecha);
    console.log(this.inputControl);
    console.log('ic_change');
  }

  // ============= Segundo DatePicker ==================
  // Pruebas de control de evento
  public ic_in2(entra: any) {
    console.log(entra);
    console.log('ic_in2');
  }
  public ic_blur2(ic_fecha?: any) {
    console.log(ic_fecha);
    console.log('ic_blur2');
    setTimeout(() => {
      const inputElement: HTMLInputElement = document.getElementById('inputControl2') as HTMLInputElement;
      const inputValue: string = inputElement.value;
      this.model.idExpirationDate = inputValue;
      this.inputControl2 = inputValue;
      console.log('#blur :' + inputValue);
    }, 200);
  }

  public ic_click2(ic_fecha?: any) {
    console.log(ic_fecha);
    console.log(this.inputControl2);
    console.log('ic_click2');
  }

  public ic_key_up2(ic_fecha?: string) {
    console.log(ic_fecha);
    console.log(this.inputControl2);
    console.log('ic_key_up2');
  }

  public ic_change2(ic_fecha?: string) {
    console.log(ic_fecha);
    console.log(this.inputControl2);
    console.log('ic_change2');
  }

  onBlurSSN() {
    if (this.model.socialSecure !== undefined) {
      if (this.model.socialSecure.length === 11 && parseInt(this.valueSSN) > 99999999) {
        this.model.socialSecure = 'XXX-XX-' + this.valueSSN.substr(5,4);
      } else {
        this.model.socialSecure = undefined;
        this.valueSSN = undefined;
        this.checkSSN = false;
      }
    }
  }

  onFocusSSN() {
    if (this.model.socialSecure !== undefined) {
      if (this.model.socialSecure.length === 11 && parseInt(this.valueSSN) > 99999999) {
        this.model.socialSecure = this.valueSSN.substr(0,3) + '-' + this.valueSSN.substr(3,2) + '-' + this.valueSSN.substr(5,4);
        console.log(this.model.socialSecure);
      } else {
        this.model.socialSecure = undefined;
        this.valueSSN = undefined;
        this.checkSSN = false;
      }
    }
  }

  onBlurSSN() {
    if (this.model.socialSecure !== undefined) {
      if (this.model.socialSecure.length === 11 && parseInt(this.valueSSN) > 99999999) {
        this.model.socialSecure = 'XXX-XX-' + this.valueSSN.substr(5,4);
      } else {
        this.model.socialSecure = undefined;
        this.valueSSN = undefined;
        this.checkSSN = false;
      }
    }
  }

  onFocusSSN() {
    if (this.model.socialSecure !== undefined) {
      if (this.model.socialSecure.length === 11 && parseInt(this.valueSSN) > 99999999) {
        this.model.socialSecure = this.valueSSN.substr(0,3) + '-' + this.valueSSN.substr(3,2) + '-' + this.valueSSN.substr(5,4);
        console.log(this.model.socialSecure);
      } else {
        this.model.socialSecure = undefined;
        this.valueSSN = undefined;
        this.checkSSN = false;
      }
    }
  }
}
