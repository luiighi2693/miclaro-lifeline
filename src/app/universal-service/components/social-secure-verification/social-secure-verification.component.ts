import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '@app/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UsfServiceService, ValidateSSNData } from '@app/core/usf/usf-service.service';
import * as moment from 'moment';

@Component({
  selector: 'app-social-secure-verification',
  templateUrl: './social-secure-verification.component.html',
  styleUrls: ['./social-secure-verification.component.scss']
})
export class SocialSecureVerificationComponent implements OnInit {
  universalServicesUnitApplicant: boolean;
  prepaidAccountCreation: boolean;
  public form: FormGroup;
  validateSSNData: ValidateSSNData;

  constructor(private authenticationService: AuthenticationService,  private usfServiceService: UsfServiceService, private router: Router, private fb: FormBuilder) {
    this.validateSSNData = this.usfServiceService.getValidateSSNData();
    console.log(this.validateSSNData);
  }

  ngOnInit() {
    window.scroll(0, 0);

    this.form = this.fb.group({
      universalServicesUnitApplicant: [
        null,
        Validators.compose([
          Validators.required
        ])
      ],
      prepaidAccountCreation: [
        null,
        Validators.compose([
          Validators.required
        ])
      ]
    });
  }

  goToAddressData() {
    this.router.navigate(['/universal-service/address-date'], { replaceUrl: true });
  }

  goToHome() {
    this.router.navigate(['/home'], { replaceUrl: true });
  }

  getFormatDateCustom(date: string) {
    return moment(new Date(date)).format("MM/DD/YYYY");
  }
}
