import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '@app/core';
import { Router } from '@angular/router';
import { BaseComponent } from '@app/core/base/BaseComponent';
import {
  DataAgencyMoneySelection,
  DataObjectAddress,
  PeopleData,
  UsfServiceService,
  ValidateSSNData
} from '@app/core/usf/usf-service.service';
declare let alertify: any;

@Component({
  selector: 'app-register-case',
  templateUrl: './register-case.component.html',
  styleUrls: ['./register-case.component.scss']
})
export class RegisterCaseComponent extends BaseComponent implements OnInit {
  dependPeopleFlag = false;
  processValidationNLAD = false;
  dataObjectAddress: DataObjectAddress[];

  validateSSNData: ValidateSSNData;

  agencies = [
    'Programa de Asistencia para Nutrición Suplementaria (SNAP) (Estampillas para Alimentos)',
    'Ingreso Suplementario de Seguridad (SSI)',
    'Medicaid',
    'Asistencia Federal para la Vivienda Pública (FPHA)',
    'Beneficio de Pensión para Veteranos y Sobrevivientes'
  ];

  homePeopleData: PeopleData[] = [
    { number: 1, money: '$16,862' },
    { number: 2, money: '$22,829' },
    { number: 3, money: '$28,796' },
    { number: 4, money: '$34,763' },
    { number: 5, money: '$40,730' },
    { number: 6, money: '$46,697' },
    { number: 7, money: '$52,664' },
    { number: 8, money: '$58,631' },
    { number: 9, money: '$64,598' },
    { number: 10, money: '$70,565' },
    { number: 11, money: '$76,532' },
    { number: 12, money: '$82,499' },
    { number: 13, money: '$88,466' },
    { number: 14, money: '$94,433' },
    { number: 15, money: '$100,400' }
  ];

  model: DataAgencyMoneySelection = {
    agency: 'Seleccionar',
    ldiRestriction: false,
    peopleDataSelectedNumber: null,
    peopleDataSelected: null,
    earningsValidation: false,
    lifelineProgramInscription: false,
    aceptationTerm: false
  };

  countPeoplesCustom = 1;

  constructor(
    public authenticationService: AuthenticationService,
    public router: Router,
    public usfServiceService: UsfServiceService
  ) {
    super(authenticationService, usfServiceService, router, null);
    this.dataObjectAddress = this.usfServiceService.getDataObjectAddress();
    this.validateSSNData = this.usfServiceService.getValidateSSNData();

    this.model.peopleDataSelectedNumber = this.homePeopleData[0].number;
    this.model.peopleDataSelected = this.homePeopleData[0];

    console.log(this.model);
  }

  ngOnInit() {
    window.scroll(0, 0);
  }

  btnCondicionContinuar() {
    if (this.model.earningsValidation === true) {
      return true;
    } else if (this.model.agency !== 'Seleccionar') {
      return true;
    } else {
      return false;
    }
  }

  evaluaCountPeoplesCustom() {
    let valorNum: any = new Number(this.countPeoplesCustom);
    let valorMonto: any = 16862;

    // let acuTemp: any = valorMonto + 8 * 5832;
    let acuTemp: any = valorMonto + 8 * 5967;

    if (valorNum > 1 && valorNum < 9) {
      // valorMonto = valorMonto + (valorNum - 1) * 5832;
      valorMonto = valorMonto + (valorNum - 1) * 5967;
    } else if (valorNum > 8) {
      // valorMonto = valorMonto + (( valorNum-1 ) * 5967);
      if (valorNum > 9) {
        valorMonto = acuTemp + (valorNum - 9) * 5967;
      } else {
        valorMonto = acuTemp + 5967;
      }
    }

    return '$' + valorMonto;
  }

  goToUsfVerification() {
    if (this.btnCondicionContinuar()) {
      this.usfServiceService.setDataAgencyMoneySelection(this.model);
      if (!this.dependPeopleFlag) {
        // this.router.navigate(['/universal-service/document-digitalization'], { replaceUrl: true });

        this.processValidationNLAD = true;

        const datos = {
          method: 'subscriberVerificationMcapi',
          UserID: this.authenticationService.credentials.userid,
          // UserID: 40,
          caseID: this.validateSSNData.CASENUMBER,
          // caseID: 267,
          Lookup_Type: 1,
          response: 1
        };

        console.log(datos);

        setTimeout(() => {
          this.usfServiceService.subscriberVerification(datos).subscribe(resp => {
            // this.usfServiceService.setValidateSSNData(resp.body);
            this.processValidationNLAD = false;
            this.usfServiceService.setRequiredDocumentData(resp.body.required);
            console.log(resp);

            if (!resp.body.HasError) {
              this.router.navigate(['/universal-service/document-digitalization'], { replaceUrl: true });
            } else {
              alertify.alert('Aviso', resp.body.ErrorDesc, function() {});
            }
          });
        },2000);

      } else {
        this.router.navigate(['/universal-service/usf-verification'], { replaceUrl: true });
      }
    }
  }

  goToAddressDate() {
    this.router.navigate(['/universal-service/address-date'], { replaceUrl: true });
  }

  onChangeSelect($event: any) {
    this.model.peopleDataSelected = this.homePeopleData.find(x => x.number.toString() === $event);
  }
}
