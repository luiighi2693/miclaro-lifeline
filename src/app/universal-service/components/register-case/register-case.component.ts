import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '@app/core';
import { Router } from '@angular/router';
import { BaseComponent } from '@app/core/base/BaseComponent';
import { DataObjectAddress, UsfServiceService, ValidateSSNData } from '@app/core/usf/usf-service.service';
declare let alertify: any;

@Component({
  selector: 'app-register-case',
  templateUrl: './register-case.component.html',
  styleUrls: ['./register-case.component.scss']
})
export class RegisterCaseComponent extends BaseComponent implements OnInit {
  dependPeopleFlag = false;
  dataObjectAddress: DataObjectAddress[];

  validateSSNData: ValidateSSNData;

  constructor(public authenticationService: AuthenticationService, public router: Router, public usfServiceService: UsfServiceService) {
    super(authenticationService, usfServiceService, router, null);
    this.dataObjectAddress = this.usfServiceService.getDataObjectAddress();
    this.validateSSNData = this.usfServiceService.getValidateSSNData();
  }

  ngOnInit() {
    window.scroll(0, 0);
  }

  goToUsfVerification() {
    if (!this.dependPeopleFlag) {
      // this.router.navigate(['/universal-service/document-digitalization'], { replaceUrl: true });

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

      this.usfServiceService.subscriberVerification(datos).subscribe(resp => {
        // this.usfServiceService.setValidateSSNData(resp.body);
        console.log(resp);

        if (!resp.body.HasError) {
          this.router.navigate(['/universal-service/document-digitalization'], { replaceUrl: true });
        } else {
          alertify.alert(
            'Aviso',
            resp.body.ErrorDesc,
            function() {
            }
          );
        }
      });

    } else {
      this.router.navigate(['/universal-service/usf-verification'], { replaceUrl: true });
    }
  }

  goToHome() {
    this.router.navigate(['/home'], { replaceUrl: true });
  }

  goToAddressDate() {
    this.router.navigate(['/universal-service/address-date'], { replaceUrl: true });
  }
}
