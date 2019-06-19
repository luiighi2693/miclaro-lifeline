import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '@app/core';
import { Router } from '@angular/router';
import { BaseComponent } from '@app/core/base/BaseComponent';
import { FormBuilder } from '@angular/forms';
import { UsfServiceService, ValidateSSNData } from '@app/core/usf/usf-service.service';
declare let alertify: any;

export interface Model {
  CUSTOMER_NAME: string;
  CUSTOMER_LAST: string;
  USF_CASEID: string;
  mBan: string;
  subscriber: string;
}

@Component({
  selector: 'app-activation',
  templateUrl: './activation.component.html',
  styleUrls: ['./activation.component.scss']
})
export class ActivationComponent extends BaseComponent implements OnInit {
  validateSSNData: ValidateSSNData;

  suscriberActivation: boolean;

  model: Model = new class implements Model {
    CUSTOMER_NAME = '';
    CUSTOMER_LAST = '';
    USF_CASEID = '';
    mBan = '';
    subscriber = '';
  }();

  constructor(
    public authenticationService: AuthenticationService,
    public usfServiceService: UsfServiceService,
    public router: Router,
    public fb: FormBuilder
  ) {
    super(authenticationService, usfServiceService, router, fb);

    this.validateSSNData = this.usfServiceService.getValidateSSNData();

    let userId = this.authenticationService.credentials.userid;
    let caseId = this.validateSSNData.CASENUMBER;

    this.suscriberActivation = true;

    const datos = {
      method: 'getBanMcapi',
      UserID: userId,
      caseID: caseId
    };

    console.log(datos);

    setTimeout(() => {
      this.usfServiceService.doAction(datos, 'getBanMcapi').subscribe(
        resp => {
          console.log(resp);

          this.suscriberActivation = false;

          if (!resp.body.HasError) {
            this.model = resp.body;
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
    }, 15000);
  }

  ngOnInit() {
    window.scroll(0, 0);
  }

  goToHome() {
    this.router.navigate(['/home'], { replaceUrl: true });
  }
}
