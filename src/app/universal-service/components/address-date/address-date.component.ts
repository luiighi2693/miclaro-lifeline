import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '@app/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Util from '@app/universal-service/util';
import { CustomValidators } from 'ng2-validation';
import { UsfServiceService, ValidateSSNData } from '@app/core/usf/usf-service.service';
import { BaseComponent } from '@app/core/base/BaseComponent';

declare let alertify: any;

export interface Model {
  temporalAddress1: boolean;
  contactNumber1: string;
  contactNumber2: string;
  temporalAddress: boolean;
  address: string;
  depUnitOther: string;
  municipality: string;
  estate: string;
  postalCode: string;
  email: string;
  contactChannel: string;
  postalAddressFlag: boolean;
  postalAddress: string;
  postalDepUnitOther: string;
  postalMunicipality: string;
  postalEstate: string;
  postalCode2: string;
  addressSelected: string;
  temporalAddressExtraContent: string;
  suggestedFlag: boolean;
  suggestedAddress: string;
  suggestedDepUnitOther: string;
  suggestedMunicipality: string;
  suggestedPostalCode: string;
  fisicalAddress: string;
  fisicalDepUnitOther: string;
  fisicalMunicipality: string;
  fisicalPostalCode: string;
}

@Component({
  selector: 'app-address-date',
  templateUrl: './address-date.component.html',
  styleUrls: ['./address-date.component.scss']
})
export class AddressDateComponent extends BaseComponent implements OnInit {
  validationProcessUSPS = false;
  validationDataAddressInput = false;
  validationProcessMAILPREP = false;

  contactChannelEmail = false;
  contactChannelPhone = false;
  contactChannelTextMessage = false;
  contactChannelMail = false;

  public dataReject: any = null;

  format1 = 'XXX-XXX-XX-XX';

  public municipalities = [
    'Adjuntas',
    'Aguada',
    'Aguadilla',
    'Aguas Buenas',
    'Aibonito',
    'Arecibo',
    'Arroyo',
    'Añasco',
    'Barceloneta',
    'Barranquitas',
    'Bayamón',
    'Cabo Rojo',
    'Caguas',
    'Camuy',
    'Canóvanas',
    'Carolina',
    'Cataño',
    'Cayey',
    'Ceiba',
    'Ciales',
    'Cidra',
    'Coamo',
    'Comerío',
    'Corozal',
    'Culebra',
    'Dorado',
    'Fajardo',
    'Florida',
    'Guayama',
    'Guayanilla',
    'Guaynabo',
    'Gurabo',
    'Guánica',
    'Hatillo',
    'Hormigueros',
    'Humacao',
    'Isabela',
    'Jayuya',
    'Juana Díaz',
    'Juncos',
    'Lajas',
    'Lares',
    'Las Marías',
    'Las Piedras',
    'Loiza',
    'Luquillo',
    'Manatí',
    'Maricao',
    'Maunabo',
    'Mayagüez',
    'Moca',
    'Morovis',
    'Naguabo',
    'Naranjito',
    'Orocovis',
    'Patillas',
    'Peñuelas',
    'Ponce',
    'Quebradillas',
    'Rincón',
    'Rio Grande',
    'Sabana Grande',
    'Salinas',
    'San Germán',
    'San Juan',
    'San Lorenzo',
    'San Sebastián',
    'Santa Isabel',
    'Toa Alta',
    'Toa Baja',
    'Trujillo Alto',
    'Utuado',
    'Vega Alta',
    'Vega Baja',
    'Vieques',
    'Villalba',
    'Yabucoa',
    'Yauco'
  ];

  public estates = ['Puerto Rico'];

  public form: FormGroup;
  model: Model = new (class implements Model {
    temporalAddress1: boolean;
    contactNumber1 = '';
    contactNumber2 = '';
    temporalAddress: boolean;
    address = '';
    depUnitOther = '';
    municipality = '';
    estate = '';
    postalCode = '';
    email = '';
    contactChannel = '';
    postalAddressFlag: boolean;
    postalAddress = '';
    postalDepUnitOther = '';
    postalMunicipality = '';
    postalEstate = '';
    postalCode2 = '';
    addressSelected = 'postal';
    temporalAddressExtraContent = '';
    suggestedFlag = false;
    suggestedAddress = '';
    suggestedDepUnitOther = '';
    suggestedMunicipality = '';
    suggestedPostalCode = '';
    fisicalAddress = '';
    fisicalDepUnitOther = '';
    fisicalMunicipality = '';
    fisicalPostalCode = '';
  })();

  validateSSNData: ValidateSSNData;

  counter1 = 1;
  counter2 = 1;
  counter4 = 1;
  someErrorValidation = false;

  constructor(
    public authenticationService: AuthenticationService,
    public usfServiceService: UsfServiceService,
    public router: Router,
    public fb: FormBuilder
  ) {
    super(authenticationService, usfServiceService, router, fb);
    this.validateSSNData = this.usfServiceService.getValidateSSNData();
  }

  ngOnInit() {
    window.scroll(0, 0);
    this.usfServiceService.setDataObjectAddress();

    this.form = this.fb.group({
      temporalAddress1: [null, Validators.compose([Validators.required])],
      contactNumber1: [
        null,
        Validators.compose([
          // Validators.required
        ])
      ],
      contactNumber2: [
        null,
        Validators.compose([
          // Validators.required
        ])
      ],
      temporalAddress: [null, Validators.compose([Validators.required])],
      address: [
        null,
        Validators.compose([
          // Validators.required
        ])
      ],
      depUnitOther: [
        null,
        Validators.compose([
          // Validators.required
        ])
      ],
      municipality: [null, Validators.compose([Validators.required])],
      estate: [null, Validators.compose([Validators.required])],
      postalCode: [null, Validators.compose([Validators.required])],
      email: [null, Validators.compose([Validators.required, CustomValidators.email])],
      contactChannel: [
        null,
        Validators.compose([
          // Validators.required
        ])
      ],
      postalAddressFlag: [null, Validators.compose([Validators.required])],
      postalAddress: [
        null,
        Validators.compose([
          // Validators.required
        ])
      ],
      postalDepUnitOther: [
        null,
        Validators.compose([
          // Validators.required
        ])
      ],
      postalMunicipality: [
        null,
        Validators.compose([
          // Validators.required
        ])
      ],
      postalEstate: [
        null,
        Validators.compose([
          // Validators.required
        ])
      ],
      postalCode2: [
        null,
        Validators.compose([
          // Validators.required
        ])
      ],
      addressSelected: [
        null,
        Validators.compose([
          // Validators.required
        ])
      ]
    });
  }

  goToBack() {
    this.validationDataAddressInput = false;
  }

  goToValidationDataAddressInput() {
    if (
      // this.form.valid && this.model.contactNumber1.length === 12 &&
      // ( (this.model.temporalAddress && this.model.temporalAddressExtraContent.length > 0) || !this.model.temporalAddress) &&
      // this.validatePostalAddress() && this.validateContactChannel()
      this.form.valid &&
      ((this.model.temporalAddress && this.model.temporalAddressExtraContent.length > 0) ||
        !this.model.temporalAddress) &&
      this.validatePostalAddress() &&
      this.validateContactChannel() &&
      ((!this.model.temporalAddress && this.model.address.length > 0 && this.model.contactNumber1.length === 12) ||
        this.model.temporalAddress) &&
      (this.model.contactNumber2.length === 0 || this.model.contactNumber2.length === 12)
    ) {
      console.log(this.model);
      this.validationProcessUSPS = true;

      const datos = {
        method: 'addressValidationMcapi',
        user_ID: this.authenticationService.credentials.userid,
        case_ID: this.validateSSNData.CASENUMBER,
        addresstype: this.model.temporalAddress ? 3 : 1,
        address1: this.model.temporalAddress
          ? this.model.temporalAddressExtraContent + ' ' + this.model.address
          : this.model.address,
        address2: this.model.depUnitOther,
        city: this.model.municipality,
        state: 'PR',
        zip: this.model.postalCode,
        phone1: this.model.contactNumber1,
        phone2: this.model.contactNumber2,
        email: this.model.email,
        contact_preference: this.getContactChannelValues(),
        PostalAddress: this.model.postalAddressFlag ? 'true' : 'false',
        temporal_address: this.model.temporalAddress1 ? '1' : '0',
        PostalAddress1: this.model.postalAddress,
        PostalAddress2: this.model.postalDepUnitOther,
        PostalAddresscity: this.model.postalMunicipality,
        PostalAddressState: 'PR',
        PostalAddresszip: this.model.postalCode2
      };

      console.log(datos);

      this.usfServiceService.doAction(datos, 'addressValidationMcapi').subscribe(resp => {
        this.validationProcessUSPS = false;

        if (!resp.body.HasError) {
          this.usfServiceService.setDataObjectAddress(resp.body.dataObject);
          //CASO DE EXITO
          // para ser usado en caso de excepcion en ultima ventana
          localStorage.setItem('phone1', datos.phone1);

          this.validationDataAddressInput = true;
          this.model.addressSelected = 'postal';

          this.model.fisicalAddress = resp.body.data[0].addr;
          this.model.fisicalDepUnitOther = resp.body.data[0].bldgorfirm;
          this.model.fisicalMunicipality = resp.body.data[0].city;
          this.model.fisicalPostalCode = resp.body.data[0].zip;

          //CASO 4
          if (this.model.temporalAddress && !this.model.postalAddressFlag) {
            this.model.suggestedFlag = false;
            // this.model.suggestedAddress = this.model.postalAddress;
            // this.model.suggestedDepUnitOther = this.model.postalDepUnitOther;
            // this.model.suggestedMunicipality = this.model.postalMunicipality;
            // this.model.suggestedPostalCode = this.model.postalCode2;
          } else {
            this.model.suggestedFlag = true;
          }

          this.model.suggestedAddress = resp.body.data[0].addr;
          this.model.suggestedDepUnitOther = resp.body.data[0].urban;
          this.model.suggestedMunicipality = resp.body.data[0].city;
          this.model.suggestedPostalCode = resp.body.data[0].zip;
        } else {
          localStorage.setItem('phone1', null);
          this.dataReject = resp.body.data[0];
          alertify.alert(
            'Aviso',
            // tslint:disable-next-line:max-line-length
            resp.body.ErrorDesc,
            () => {
              //casos de error
              //caso 1
              if (!this.model.temporalAddress && this.model.postalAddressFlag) {
                if (this.counter1 > 2) {
                  // this.goToHome();
                  this.showEception();
                } else {
                  this.counter1++;
                }
              }

              //caso 2
              if (!this.model.temporalAddress && !this.model.postalAddressFlag) {
                if (this.counter2 > 2) {
                  // this.goToHome();
                  this.showEception();
                } else {
                  this.counter2++;
                }
              }

              //caso 3
              if (this.model.temporalAddress && this.model.postalAddressFlag) {
                // this.goToHome();
                this.showEception();
              }

              //caso 4
              if (this.model.temporalAddress && !this.model.postalAddressFlag) {
                if (this.counter4 > 2) {
                  // this.goToHome();
                  this.showEception();
                } else {
                  this.counter4++;
                }
              }
            }
          );
        }
      });

      // setTimeout(() => {
      //   this.validationProcessUSPS = false;
      //   this.validationDataAddressInput = true;
      // }, 3000);
    }
  }

  goToRegisterCase() {
    // if (this.form.valid) {
    if (
      this.model.addressSelected === 'postalSuggested' ||
      (this.model.temporalAddress && !this.model.postalAddressFlag && this.model.addressSelected === 'postal')
    ) {
      console.log(this.model);
      this.validationDataAddressInput = false;
      // this.validationProcessMAILPREP = true;

      // setTimeout(() => {
      this.router.navigate(['/universal-service/register-case'], { replaceUrl: true });
      // }, 3000);
    }
  }

  goToHome() {
    this.router.navigate(['/home'], { replaceUrl: true });
  }

  showEception() {
    this.someErrorValidation = true;
  }

  goToPersonalDates() {
    this.router.navigate(['/universal-service/personal-dates'], { replaceUrl: true });
  }

  formatInputContactNumber(input: string) {
    switch (input) {
      case 'contactNumber1': {
        this.model.contactNumber1 = this.formatInput(this.model.contactNumber1, this.format1);
        break;
      }

      case 'contactNumber2': {
        this.model.contactNumber2 = this.formatInput(this.model.contactNumber2, this.format1);
        break;
      }
    }
  }

  public formatInput(input: string, format: string) {
    if (format === this.format1) {
      if (input.length === 4) {
        return input.substr(0, input.length - 1) + '-' + input.substr(input.length - 1, input.length);
      }

      if (input.length === 8) {
        return input.substr(0, input.length - 1) + '-' + input.substr(input.length - 1, input.length);
      }

      // if (input.length === 11) {
      //   return input.substr(0, input.length - 1) + '-' + input.substr(input.length - 1, input.length);
      // }

      return input;
    }

    return '';
  }

  checkNumbersOnly(event: any): boolean {
    return Util.checkNumbersOnly(event);
  }

  checkCharactersOnly(event: any): boolean {
    return Util.checkCharactersOnly(event);
  }

  validatePostalAddress() {
    if (this.model.postalAddressFlag) {
      return true;
    } else {
      return (
        this.model.postalAddress.length > 0 &&
        this.model.postalMunicipality.length > 0 &&
        this.model.postalEstate.length > 0 &&
        this.model.postalCode2.length > 0
      );
    }
  }

  public validateContactChannel() {
    let contactChannelArray = [];
    contactChannelArray.push(
      this.contactChannelEmail,
      this.contactChannelPhone,
      this.contactChannelTextMessage,
      this.contactChannelMail
    );
    console.log(contactChannelArray);
    return contactChannelArray.includes(true);
  }

  public getContactChannelValues() {
    let contactChannelArray = [];
    let contactChannelArrayValues: number[] = [];
    let index = 0;

    contactChannelArray.push(
      this.contactChannelEmail,
      this.contactChannelPhone,
      this.contactChannelTextMessage,
      this.contactChannelMail
    );

    contactChannelArray.forEach(contactChannelflag => {
      if (contactChannelflag) {
        contactChannelArrayValues.push(index + 1);
      }
      index++;
    });

    // return contactChannelArrayValues;
    return '[' + contactChannelArrayValues.join(',') + ']';
  }

  // changeValueTemporalAdress() {
  //   console.log(this.model.temporalAddress);
  //
  //   if (this.model.temporalAddress) {
  //     this.form.controls['address'].clearValidators();
  //   } else {
  //     this.form.controls['address'].setValidators([Validators.required]);
  //   }
  //
  //   this.validatePostalAddress();
  // }
}
