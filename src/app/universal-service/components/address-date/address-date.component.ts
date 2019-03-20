import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '@app/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Util from '@app/universal-service/util';
import { CustomValidators } from 'ng2-validation';
import { UsfServiceService } from '@app/core/usf/usf-service.service';
import { BaseComponent } from '@app/core/base/BaseComponent';

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
  model: Model = new class implements Model {
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
  }();

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

    this.form = this.fb.group({
      temporalAddress1: [null, Validators.compose([Validators.required])],
      contactNumber1: [null, Validators.compose([Validators.required])],
      contactNumber2: [null, Validators.compose([Validators.required])],
      temporalAddress: [null, Validators.compose([Validators.required])],
      address: [null, Validators.compose([Validators.required])],
      depUnitOther: [ null, Validators.compose([ Validators.required ]) ],
      municipality: [null, Validators.compose([Validators.required])],
      estate: [null, Validators.compose([Validators.required])],
      postalCode: [null, Validators.compose([Validators.required])],
      email: [null, Validators.compose([Validators.required, CustomValidators.email])],
      contactChannel: [null, Validators.compose([Validators.required])],
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

  goToValidationDataAddressInput() {
    if (this.form.valid) {
      console.log(this.model);
      this.validationProcessUSPS = true;

      const datos = {
        method: 'addressValidationMcapi',
        UserName: this.authenticationService.credentials.userid,
        caseID: 123,
        addresstype : this.model.temporalAddress ? 3 : 1,
        // Tipodireccion1: this.model.temporalAddress1 ? 1 : 0,
        address1: this.model.address,
        address2: this.model.depUnitOther + this.model.temporalAddress ? ' ' + this.model.temporalAddressExtraContent : '',
        city: this.model.municipality,
        state: 'PR',
        zip: this.model.postalCode,
        // Tipodireccion3: this.model.temporalAddress ? 3 : 0,
        phone1: this.model.contactNumber1,
        phone2: this.model.contactNumber2,
        email: this.model.email,
        contact_preference: this.model.contactChannel,
        PostalAddress: this.model.postalAddressFlag ? 'true' : 'false',
        PostalAddress1: this.model.postalAddress,
        PostalAddress2: this.model.postalDepUnitOther,
        PostalAddresscity: this.model.postalMunicipality,
        PostalAddressState: 'PR',
        PostalAddresszip: this.model.postalCode2
      };

      console.log(datos);

      this.usfServiceService.validateAddress(datos).subscribe(resp => {
        this.validationProcessUSPS = false;
        this.validationDataAddressInput = true;
        console.log(resp);

      });

      // setTimeout(() => {
      //   this.validationProcessUSPS = false;
      //   this.validationDataAddressInput = true;
      // }, 3000);
    }
  }

  goToRegisterCase() {
    if (this.form.valid) {
      console.log(this.model);
      this.validationDataAddressInput = false;
      this.validationProcessMAILPREP = true;

      setTimeout(() => {
        this.router.navigate(['/universal-service/register-case'], { replaceUrl: true });
      }, 3000);
    }
  }

  goToHome() {
    this.router.navigate(['/home'], { replaceUrl: true });
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

      if (input.length === 11) {
        return input.substr(0, input.length - 1) + '-' + input.substr(input.length - 1, input.length);
      }

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
}
