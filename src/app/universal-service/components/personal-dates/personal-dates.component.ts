import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '@app/core';
import { Router } from '@angular/router';
import { FormBuilder, Validators } from '@angular/forms';
import { UsfServiceService } from '@app/core/usf/usf-service.service';
import { BaseComponent } from '@app/core/base/BaseComponent';
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

  public sufixes = ['MR.', 'MRS.', 'ENG.', 'ATTY.', 'DR.'];
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
  }

  ngOnInit() {
    window.scroll(0, 0);
    localStorage.setItem('existSSNCase', null);
    this.usfServiceService.setValidateSSNData();

    this.form = this.fb.group({
      sufix: [null, Validators.compose([Validators.required])],
      firstName: [null, Validators.compose([Validators.required])],
      secondName: [null, Validators.compose([])],
      lastName: [null, Validators.compose([Validators.required])],
      socialSecure: [null, Validators.compose([Validators.required])],
      birthday: [null, Validators.compose([Validators.required])],
      gender: [null, Validators.compose([Validators.required])],
      idType: [null, Validators.compose([Validators.required])],
      idNumber: [null, Validators.compose([Validators.required])],
      idExpirationDate: [null, Validators.compose([Validators.required])]
    });
    console.log('init component');
    console.log(this.model.socialSecure + ' : model socialSecure');
    console.log('this.format2: ' + this.format2);
    console.log('this.valueSSN: ' + this.valueSSN);

    console.log(this.model);
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
        CUSTOMER_SUFFIX: this.model.sufix,
        USER_ID: this.authenticationService.credentials.userid.toString(),
        CUSTOMER_NAME: this.model.firstName,
        CUSTOMER_MN: this.model.secondName,
        CUSTOMER_LAST: this.model.lastName,
        CUSTOMER_SSN: this.valueSSN
          .replace('-', '')
          .replace('-', '')
          .replace('-', ''),
        CUSTOMER_DOB: this.formatDate(this.inFormat(this.valueBirthday)),
        GENDER: this.model.gender ? '1' : '0',
        CUSTOMER_ID_TYPE: this.model.idType === 'Pasaporte' ? '0' : '1',
        ID_NUMBER: this.model.idNumber,
        DTS_EXP: this.formatDate(this.inFormat(this.valueExpirationDate)),
        HOME_VALIDATION: this.model.liveWithAnoterAdult ? 1 : 0,
        HAVE_LIFELINE: this.model.hasLifelineTheAdult ? 1 : 0,
        SHARE_MONEY: this.model.sharedMoneyWithTheAdult ? 1 : 0
      };

      console.log(datos);

      this.usfServiceService.doAction(datos, 'validareSSNAdMcapi').subscribe(resp => {
        this.processValidationSIF = false;
        this.usfServiceService.setValidateSSNData(resp.body);
        console.log(resp);

        if (!resp.body.HasError) {
          // Limpiando en caso satisfactorio
          localStorage.setItem('existSSNCase', null);
          localStorage.setItem('existSSNCaseName', null);
          localStorage.setItem('existSSNCaseNumber', null);
          localStorage.setItem('existSSNCaseSSN', null);
          localStorage.setItem('existSSNCasePhone', null);
          localStorage.setItem('existSSNCaseAddress', null);
          localStorage.setItem('existSSNCaseBan', null);
          localStorage.setItem('lifelineActivationDate', null);
          localStorage.setItem('accountType', null);

          this.usfServiceService.setSsn(this.valueSSN.replace('-', '').replace('-', ''));
          this.router.navigate(['/universal-service/address-date'], { replaceUrl: true });
        } else {
          if (resp.body.dataObject.length > 0) {
            // cuando viene en dataObject
            // es que NO se Registro completamente
            localStorage.setItem('existSSNCase', 'incomplete');
            localStorage.setItem('existSSNCaseName', resp.body.dataObject[0].name);
            localStorage.setItem('existSSNCaseNumber', resp.body.dataObject[0].CASENUMBER);
            localStorage.setItem('existSSNCaseSSN', resp.body.dataObject[0].ssn);
            localStorage.setItem('existSSNCasePhone', resp.body.dataObject[0].phone1);
            localStorage.setItem('existSSNCaseAddress', resp.body.dataObject[0].address);
            localStorage.setItem('existSSNCaseBan', resp.body.dataObject[0].ban);
            localStorage.setItem('accountType', resp.body.dataObject[0].accountType);
            localStorage.setItem('lifelineActivationDate', resp.body.dataObject[0].efectivedate);
          } else {
            // en data es que SI se Registro completamente
            localStorage.setItem('existSSNCase', null);
            localStorage.setItem('existSSNCase', resp.body.data[0]);
            localStorage.setItem('existSSNCaseName', resp.body.data[0].name);
            localStorage.setItem('existSSNCaseNumber', resp.body.data[0].CASENUMBER);
            localStorage.setItem('existSSNCaseSSN', resp.body.data[0].ssn);
            localStorage.setItem('existSSNCasePhone', resp.body.data[0].subscriberNumber);
            localStorage.setItem('existSSNCaseAddress', resp.body.data[0].address);
            localStorage.setItem('existSSNCaseBan', resp.body.data[0].ban);
            localStorage.setItem('lifelineActivationDate', resp.body.data[0].lifelineActivationDate);
            localStorage.setItem('accountType', resp.body.data[0].accountType);
          }
          this.router.navigate(['/universal-service/social-secure-verification'], { replaceUrl: true });
        }
      });
    }
  }

  formatInputSocialSecure(input: string) {
    this.model.socialSecure = this.formatInput(this.model.socialSecure, this.format2);
  }

  public formatInput(input: string, format: string) {
    /* BETA */
    if (
      input !== undefined &&
      input.length === 11 && // tslint:disable-next-line: radix
      (parseInt(
        String(this.valueSSN)
          .replace('-', '')
          .replace('-', '')
      ) >= 99999999 ||
        // tslint:disable-next-line: radix
        parseInt(
          String(this.valueSSN)
            .replace('-', '')
            .replace('-', '')
        ) >= 9999999)
    ) {
      console.log('antes del cambio');
      console.log(input);
      console.log(this.valueSSN);
      // si tiene los 2 - guiones  ya esta validado
      this.valueSSN = String(input)
        .replace('-', '')
        .replace('-', '')
        .replace('-', '');
      this.valueSSN =
        String(this.valueSSN).substr(0, 3) +
        '-' +
        String(this.valueSSN).substr(3, 2) +
        '-' +
        String(this.valueSSN).substr(5, 4);
      console.log(format);
      console.log(this.format2);
      console.log(this.model.socialSecure);
      this.invalidSSN = false;
      this.checkSSN = true;
      console.log(this.form.controls['socialSecure'].valid);
      return this.valueSSN;
    }
    /* * * * * * * * * * * * * * * * * */

    // Almacenando valor real en variable temporal
    if (input !== undefined && input.length > 1 && String(input).substr(input.length - 1, 1) !== 'X') {
      // console.log(input.substr(input.length - 1, 1));
      this.valueSSN += String(input.substr(input.length - 1, 1));
    } else {
      if (input !== 'X' && input !== 'XXX-XX-XXXX') {
        this.valueSSN = input;
        // console.log(input);
      } else {
        console.log('comparacion para eliminar');
        console.log(input + ' input');
        console.log(this.valueSSN + ' valueSSN');
      }
    }

    // tslint:disable-next-line:radix
    if (
      input !== undefined &&
      input.length === 11 && // tslint:disable-next-line: radix
      (parseInt(
        String(this.valueSSN)
          .replace('-', '')
          .replace('-', '')
      ) >= 99999999 ||
        // tslint:disable-next-line: radix
        parseInt(
          String(this.valueSSN)
            .replace('-', '')
            .replace('-', '')
        ) >= 9999999)
    ) {
      console.log('invalido con ' + input.length);
      this.invalidSSN = true;
    }

    // Si llega a 11 Caracteres hay que hacer la validacion Real contra el servicio
    // ya que tiene el formato XXX-XX-XXXX  de 11 caracteres serian 9 digitos
    // parseInt( this.valueSSN ) > 99999999 [USADO PARA VALIDAR Y CUMPLIR LA CONDICION QUE SEA NUERICO Y DE 9 DIGITOS ]
    // tslint:disable-next-line:radix
    if (
      input !== undefined &&
      input.length === 11 && // tslint:disable-next-line: radix
      (parseInt(this.valueSSN.replace('-', '').replace('-', '')) >= 99999999 ||
        // tslint:disable-next-line: radix
        parseInt(
          String(this.valueSSN)
            .replace('-', '')
            .replace('-', '')
        ) >= 9999999)
    ) {
      console.log('invalidSSN f');
      this.invalidSSN = false;
      this.checkSSN = true;
      console.log(this.valueSSN);
    }

    if (format === this.format2) {
      console.log(input);
      console.log(format);
      console.log(this.format2);
      if (input !== undefined && input.length === 4) {
        if (input[input.length - 1] === '-') {
          return input.substr(0, input.length - 1) + input.substr(input.length - 1, input.length);
        } else {
          return input.substr(0, input.length - 1) + '-' + input.substr(input.length - 1, input.length);
        }
      }

      if (input !== undefined && input.length === 7) {
        console.log(input);
        if (input[input.length - 1] === '-') {
          return input.substr(0, input.length - 1) + input.substr(input.length - 1, input.length);
        } else {
          return input.substr(0, input.length - 1) + '-' + input.substr(input.length - 1, input.length);
        }
      }

      if (input !== undefined && input.length > 7) {
        return input;
      } else {
        return input;
      }
    }
    console.log('va a blanquear');
    return '';
  }

  public activarDatepickerFechaN() {
    if (this.datePicker_is_init === false) {
      // tslint:disable-next-line:prefer-const
      let dia = String(new Date().getDate());
      // tslint:disable-next-line:radix
      if (parseInt(dia) < 10) {
        dia = '0' + dia;
      }
      // tslint:disable-next-line:prefer-const
      let mes = String(new Date().getMonth());
      // tslint:disable-next-line:radix
      if (parseInt(mes) < 10) {
        mes = '0' + mes;
      }
      const fecha_ = {
        d: String(dia),
        m: String(mes),
        y: String(new Date().getFullYear() - 21)
      };

      $('#inputControl')
        .datepicker({
          dateFormat: 'mm/dd/yy',
          changeMonth: true,
          changeYear: true,
          yearRange: '-100:-21',
          maxDate: '-21y',
          minDate: '-100y',
          defaultDate: '-22y',
          onSelect: (dateText: any) => {
            this.inputControl = dateText;
            console.log(dateText + ' *onSelect');
          },
          onChangeMonthYear: function(year: any, month: any, datepicker: any) {
            // #CAMBIO APLICADO y Necesario ya que al seleccionar el mes y cambiar el a#o en los selects
            // # no Cambiaba el valor del input  Ahora si se esta aplocando el cambio
            console.log('onChangeMonthYear');
            if ($('#inputControl').val().length === 10) {
              console.log('to :' + month + ' ' + $('#inputControl').val().sub + ' ' + year);

              const new_date = new Date(
                month +
                  '/' +
                  $('#inputControl')
                    .val()
                    .substr(3, 2) +
                  '/' +
                  year
              );

              $('#inputControl').datepicker('setDate', new_date);
            }
          }
        })
        .on('change', function(evtChange: any) {
          console.log(evtChange);
          console.log('Change event');
        });

      $('#inputControl2').datepicker({
        dateFormat: 'mm/dd/yy',
        changeMonth: true,
        changeYear: true,
        yearRange: '+0:+10',
        minDate: 0,
        defaultDate: '+1y',
        onSelect: (dateText: any) => {
          this.inputControl2 = dateText;
          console.log(dateText + ' *onSelect');
        },
      });
    }
    $('#inputControl').datepicker('show');
  }
  public activarDatepickerFechaE() {
    if (this.datePicker_is_init === false) {
      $('#inputControl').datepicker({
        dateFormat: 'mm/dd/yy',
        changeMonth: true,
        changeYear: true,
        yearRange: '-100:-21',
        maxDate: '-21y',
        minDate: '-100y',
        defaultDate: '-22y'
      });
      $('#inputControl2').datepicker({
        dateFormat: 'mm/dd/yy',
        changeMonth: true,
        changeYear: true,
        yearRange: '+0:+10',
        minDate: 0,
        defaultDate: '+1y'
      });
      this.datePicker_is_init = true;
    }
    $('#inputControl2').datepicker('show');
  }

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

  public ic_blur() {
    setTimeout(() => {
      const inputValue: string = this.inputControl;
      // tslint:disable-next-line:radix
      const year: number = parseInt(inputValue.substr(-4, 4));
      // tslint:disable-next-line:radix
      if (year > new Date(new Date().setFullYear(new Date().getFullYear() - 21)).getFullYear()) {
        console.log(
          'y:' + year + ' c: ' + new Date(new Date().setFullYear(new Date().getFullYear() - 21)).getFullYear()
        );
        this.valueBirthday = '';
        this.model.birthday = '';
        this.inputControl = '';
      } else {
        this.valueBirthday = inputValue;
        this.model.birthday = inputValue;
        this.inputControl = inputValue;
      }
      console.log('#blur :' + inputValue);
      console.log(this.format2);
      console.log(this.valueSSN);

      // tslint:disable-next-line:prefer-const
      let dp1 = document.getElementsByClassName('ui-datepicker-year')[0] as HTMLSelectElement;
      if (dp1 !== undefined && this.datePicker_is_init === false) {
        for (let c = 0; c < dp1.options.length; c++) {
          dp1.options.remove(1);
        }
        document.getElementsByClassName('ui-datepicker-year')[0].innerHTML = '';
        for (let c = new Date().getFullYear() - 21; c > new Date().getFullYear() - 100; c--) {
          const opt = document.createElement('option');
          opt.value = '' + c;
          opt.innerHTML = '' + c;
          dp1.options.add(opt);
        }

        // Test despues de iniciado
        this.datePicker_is_init = true;
      }
      // tslint:disable-next-line:prefer-const
      let selector_mes = document.getElementsByClassName('ui-datepicker-month')[0] as HTMLSelectElement;
      if (selector_mes != undefined) {
        // tslint:disable-next-line:typedef
        selector_mes.addEventListener('change', function(evt) {
          console.log(evt);
          console.log('change Ldpk1:' + dp1.options.length);
          console.log(
            'select Ldpk1 index:' +
              dp1.options.selectedIndex +
              ' value:' +
              dp1.options.item(dp1.options.selectedIndex).value
          );
        });
        // tslint:disable-next-line:typedef
        selector_mes.addEventListener('click', function(evt) {
          console.log(evt);
          console.log('click');
        });
        // ----------------------------------
      }
    }, 250);
  }

  public ic_key_up() {
    this.inputControl = this.formateadorFecha(this.inputControl);
    console.log(this.inputControl);
    // si tiene 10 digitos y esta formateada
    if (
      this.inputControl.length === 10 &&
      this.inputControl.indexOf('/') === 2 &&
      this.inputControl.indexOf('/', 5) === 5
    ) {

      const year: number = parseInt(this.inputControl.substr(-4, 4));
      console.log('y:' + year + ' c: ' + new Date(new Date().setFullYear(new Date().getFullYear() - 21)).getFullYear());

      if (year > new Date(new Date().setFullYear(new Date().getFullYear() - 21)).getFullYear()) {
        this.valueBirthday = '';
        this.model.birthday = '';
        this.inputControl = '';
      } else {
        this.valueBirthday = this.inputControl;
        this.model.birthday = this.inputControl;
      }
    }
    console.log('ic_key_up');
  }

  // ============= Segundo DatePicker ==================
  public ic_blur2() {
    setTimeout(() => {
      const inputValue: string = this.inputControl2;
      this.model.idExpirationDate = inputValue;
      this.valueExpirationDate = inputValue;
      console.log('#blur :' + inputValue);
    }, 200);
  }

  public ic_key_up2() {
    this.inputControl2 = this.formateadorFecha(this.inputControl2);
    console.log(this.inputControl2);
    console.log('ic_key_up2');
  }

  onBlurSSN() {
    if (this.model.socialSecure !== undefined) {
      // tslint:disable-next-line: radix
      if (
        this.model.socialSecure.length === 11 &&
        // tslint:disable-next-line: radix
        (parseInt(
          String(this.valueSSN)
            .replace('-', '')
            .replace('-', '')
        ) >= 99999999 ||
          // tslint:disable-next-line: radix
          parseInt(
            String(this.valueSSN)
              .replace('-', '')
              .replace('-', '')
          ) >= 9999999)
      ) {
        // this.model.socialSecure = 'XXX-XX-' + this.valueSSN.substr(5, 4);

        // si tiene los 2 - guiones  ya esta validado
        console.log(this.valueSSN);
        console.log(this.model.socialSecure);
        let remplazo = String(this.valueSSN.replace('-', '').replace('-', '')).replace('-', '');
        remplazo = 'XXX' + '-' + 'XX' + '-' + String(this.valueSSN).substr(-4, 4);

        console.log(remplazo);
        this.model.socialSecure = remplazo;
        console.log('onBlurSSN If');
      } else {
        console.log(this.valueSSN);
        this.model.socialSecure = undefined;
        this.valueSSN = undefined;
        this.checkSSN = false;
        console.log('onBlurSSN else');
      }
    }
  }

  onFocusSSN() {
    if (this.model.socialSecure !== undefined) {
      // tslint:disable-next-line: radix
      if (
        this.model.socialSecure.length === 11 &&
        // tslint:disable-next-line: radix
        (parseInt(
          String(this.valueSSN)
            .replace('-', '')
            .replace('-', '')
        ) >= 99999999 ||
          // tslint:disable-next-line: radix
          parseInt(
            String(this.valueSSN)
              .replace('-', '')
              .replace('-', '')
          ) >= 9999999)
      ) {
        // this.model.socialSecure =
        // this.valueSSN.substr(0, 3) + '-' + this.valueSSN.substr(3, 2) + '-' + this.valueSSN.substr(5, 4);
        console.log(this.model.socialSecure);
        console.log(this.format2);
        console.log(this.model);
        // si trae guiones se limpia
        this.valueSSN = String(this.valueSSN)
          .replace('-', '')
          .replace('-', '')
          .replace('-', '');
        console.log(this.valueSSN);

        // Restaurando el valor
        this.model.socialSecure =
          String(this.valueSSN).substr(0, 3) +
          '-' +
          String(this.valueSSN).substr(3, 2) +
          '-' +
          String(this.valueSSN).substr(5, 4);

        console.log('onFocusSSN If');
      } else {
        this.model.socialSecure = undefined;
        this.valueSSN = undefined;
        this.checkSSN = false;
      }
    }
  }
}
