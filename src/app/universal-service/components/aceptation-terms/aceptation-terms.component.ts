import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '@app/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CustomValidators } from 'ng2-validation';
import { UsfServiceService, ValidateSSNData } from '@app/core/usf/usf-service.service';
import { BaseComponent } from '@app/core/base/BaseComponent';

declare let alertify: any;

export interface Model {
  agency: string;
}

export interface PeopleData {
  number: number;
  money: string;
}

@Component({
  selector: 'app-aceptation-terms',
  templateUrl: './aceptation-terms.component.html',
  styleUrls: ['./aceptation-terms.component.scss']
})
export class AceptationTermsComponent extends BaseComponent implements OnInit {
  public agencies = [
    'Programa de Asistencia para Nutrición Suplementaria (SNAP) (Estampillas para Alimentos)',
    'Ingreso Suplementario de Seguridad (SSI)',
    'Medicaid',
    'Asistencia Federal para la Vivienda Pública (FPHA)',
    'Beneficio de Pensión para Veteranos y Sobrevivientes'
  ];

  public form: FormGroup;

  model = new class {
    agency = 'Seleccionar';
    ldiRestriction: boolean;
    peopleDataSelectedNumber: number;
    peopleDataSelected: PeopleData;
    earningsValidation: boolean;
    lifelineProgramInscription: boolean;
    aceptationTerm: boolean;
  }();

  homePeopleData: PeopleData[] = [
    { number: 1, money: '$16,389' },
    { number: 2, money: '$22,221' },
    { number: 3, money: '$28,053' },
    { number: 4, money: '$33,885' },
    { number: 5, money: '$39,717' },
    { number: 6, money: '$45,549' },
    { number: 7, money: '$51,381' },
    { number: 8, money: '$57,213' }
  ];

  validateSSNData: ValidateSSNData;

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

    this.form = this.fb.group({
      agency: [
        null,
        Validators.compose([
          // Validators.required
        ])
      ],
      ldiRestriction: [null, Validators.compose([Validators.required])]
    });

    this.model.peopleDataSelectedNumber = this.homePeopleData[0].number;
    this.model.peopleDataSelected = this.homePeopleData[0];
  }

  goToPreviewViewAndFirm() {
    if (this.validateForm()) {

      const datos = {
        method: 'Updlongdistance',
        USER_ID: this.authenticationService.credentials.userid,
        CASE_ID: this.validateSSNData.CASENUMBER,
        LDI: this.model.ldiRestriction ? '1' : '0'
      };

      console.log(datos);

      this.usfServiceService.doAction(datos, 'Updlongdistance').subscribe(
        resp => {
          console.log(resp);

          if (!resp.body.HasError) {
            this.router.navigate(['/universal-service/preview-view-and-firm'], { replaceUrl: true });
          } else {
            alertify.alert('Aviso', resp.body.ErrorDesc, () => {
              this.goToHome();
            });
          }
        },
        error => {
          console.log(error);
        }
      );

    }
  }

  goToAccountCreation() {
    this.router.navigate(['/home'], { replaceUrl: true });
  }

  onChangeSelect($event: any) {
    this.model.peopleDataSelected = this.homePeopleData.find(x => x.number.toString() === $event);
  }

  validateForm() {
    return this.form.valid && this.model.aceptationTerm;
  }

  setAceptationTerms(value: boolean) {
    if (this.model.aceptationTerm === undefined) {
      this.model.aceptationTerm = value;
    }

    // if (value) {
    //   const datos = {
    //     method: 'CreateSubscriberMcapi',
    //     UserID: this.authenticationService.credentials.userid,
    //     caseID: this.validateSSNData.CASENUMBER
    //   };
    //
    //   console.log(datos);
    //
    //   this.usfServiceService.doAction(datos, 'CreateSubscriberMcapi').subscribe(resp => {});
    // }
  }
}
