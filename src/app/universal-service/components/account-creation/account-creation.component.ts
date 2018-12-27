import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '@app/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CustomValidators } from 'ng2-validation';

export interface Model {
  accountType: string;
  tecnology: string;
  planType: string;
  imei: string;
  simCard: string;
}

export interface Plan {
  plan: string;
  planDetails: string[];
}

@Component({
  selector: 'app-account-creation',
  templateUrl: './account-creation.component.html',
  styleUrls: ['./account-creation.component.scss']
})
export class AccountCreationComponent implements OnInit {
  processValidationSIF = false;

  public accountTypes = ['Prepago Móvil'];
  public planTypes = ['Móvil Prepago'];
  public tecnologies = ['GSM'];

  public form: FormGroup;
  model: Model = new class implements Model {
    accountType = '';
    tecnology = '';
    planType = '';
    imei = '';
    simCard = '';
  }();

  plans: Plan[] = [
    {
      plan: 'Plan 2099',
      planDetails: [
        '1,000 minutos para uso de voz local, larga distancia a Estados Unidos' +
          ' y “Roaming” en EEUU compartido. Costo del minuto adicional es 10¢.',
        '400 SMS/MMS locales, a EEUU y a ciertos destinos internacionales',
        'Costo SMS/MMS adicional enviado es de 10¢.',
        'SMS/MMS recibidos son gratis.'
      ]
    },
    {
      plan: 'Plan 2219',
      planDetails: [
        '1,000 minutos para uso de voz local, larga distancia a Estados Unidos' +
          ' y “Roaming” en EEUU compartido. Costo del minuto adicional es 10¢.',
        '1,000 SMS/MMS locales, a EEUU y a ciertos destinos internacionales.',
        'Costo SMS/MMS adicional enviado es de 10¢.',
        'SMS/MMS recibidos son gratis.',
        ' 2 GB de data para uso en PR y en EEUU con bloqueo'
      ]
    }
  ];

  planSelected: Plan = undefined;

  public checkImeiValidated = false;

  constructor(private authenticationService: AuthenticationService, private router: Router, private fb: FormBuilder) {}

  ngOnInit() {
    window.scroll(0, 0);

    this.form = this.fb.group({
      accountType: [null, Validators.compose([Validators.required])],
      tecnology: [null, Validators.compose([Validators.required])],
      planType: [null, Validators.compose([Validators.required])],
      imei: [null, Validators.compose([Validators.required])],
      simCard: [null, Validators.compose([Validators.required])]
    });
  }

  goToAceptationTerms() {
    if (this.form.valid && this.checkImeiValidated) {
      this.processValidationSIF = true;

      setTimeout(() => {
        this.router.navigate(['/universal-service/aceptation-terms'], { replaceUrl: true });
      }, 3000);
    }
  }

  goToHome() {
    this.router.navigate(['/home'], { replaceUrl: true });
  }

  goToDocumentDigitalization() {
    this.router.navigate(['/universal-service/document-digitalization'], { replaceUrl: true });
  }

  onCheckChange($event: any) {
    this.checkImeiValidated = !this.checkImeiValidated;
  }

  setPlan($event: any) {
    this.planSelected = this.plans.find(x => x.plan === $event);
  }
}
