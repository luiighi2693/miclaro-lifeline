import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '@app/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-social-secure-verification',
  templateUrl: './social-secure-verification.component.html',
  styleUrls: ['./social-secure-verification.component.scss']
})
export class SocialSecureVerificationComponent implements OnInit {
  universalServicesUnitApplicant: boolean;
  prepaidAccountCreation: boolean;
  public form: FormGroup;

  constructor(private authenticationService: AuthenticationService, private router: Router, private fb: FormBuilder) { }

  ngOnInit() {
    window.scroll(0, 0);

    this.form = this.fb.group({
      universalServicesUnitApplicant: [
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

}
