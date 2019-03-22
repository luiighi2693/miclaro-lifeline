import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '@app/core';
import { Router } from '@angular/router';
import { BaseComponent } from '@app/core/base/BaseComponent';
import { DataObjectAddress, UsfServiceService } from '@app/core/usf/usf-service.service';

@Component({
  selector: 'app-register-case',
  templateUrl: './register-case.component.html',
  styleUrls: ['./register-case.component.scss']
})
export class RegisterCaseComponent extends BaseComponent implements OnInit {
  dependPeopleFlag = false;
  dataObjectAddress: DataObjectAddress[];

  constructor(public authenticationService: AuthenticationService, public router: Router, public usfServiceService: UsfServiceService) {
    super(authenticationService, usfServiceService, router, null);
    this.dataObjectAddress = this.usfServiceService.getDataObjectAddress();
  }

  ngOnInit() {
    window.scroll(0, 0);
  }

  goToUsfVerification() {
    if (!this.dependPeopleFlag) {
      this.router.navigate(['/universal-service/document-digitalization'], { replaceUrl: true });
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
