import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '@app/core';
import { Router } from '@angular/router';
import { BaseComponent } from '@app/core/base/BaseComponent';
import { FormBuilder } from '@angular/forms';
import { UsfServiceService, ValidateSSNData } from '@app/core/usf/usf-service.service';

export interface Model {
  CUSTOMER_NAME: string;
  CUSTOMER_LAST: string;
  USF_CASEID: string;
  mBan: string;
}

@Component({
  selector: 'app-activation',
  templateUrl: './activation.component.html',
  styleUrls: ['./activation.component.scss']
})
export class ActivationComponent extends BaseComponent implements OnInit {

  validateSSNData: ValidateSSNData;

  model: Model = new class implements Model {
    CUSTOMER_NAME = '';
    CUSTOMER_LAST = '';
    USF_CASEID = '';
    mBan = '';
  };

  constructor(public authenticationService: AuthenticationService,
              public usfServiceService: UsfServiceService,
              public router: Router,
              public fb: FormBuilder) {
    super(authenticationService, usfServiceService, router, fb);

    this.validateSSNData = this.usfServiceService.getValidateSSNData();

    let userId = this.authenticationService.credentials.userid;
    let caseId = this.validateSSNData.CASENUMBER;


    const datos = {
      method: 'getBanMcapi',
      UserID: userId,
      caseID: caseId
    };

    console.log(datos);

    this.usfServiceService.doAction(datos, 'getBanMcapi').subscribe(
      resp => {
        console.log(resp);

        if (!resp.body.HasError) {
          this.model = resp.body;
        } else {

        }
      },
      error => {
        console.log(error);
      }
    );
  }

  ngOnInit() {
    window.scroll(0, 0);
  }

  goToHome() {
    this.router.navigate(['/home'], { replaceUrl: true });
  }

}
