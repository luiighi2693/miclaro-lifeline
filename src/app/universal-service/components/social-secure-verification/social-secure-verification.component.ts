import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '@app/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-social-secure-verification',
  templateUrl: './social-secure-verification.component.html',
  styleUrls: ['./social-secure-verification.component.scss']
})
export class SocialSecureVerificationComponent implements OnInit {

  constructor(private authenticationService: AuthenticationService, private router: Router) { }

  ngOnInit() {
    window.scroll(0, 0);
  }

  goToAddressData() {
    this.router.navigate(['/universal-service/address-date'], { replaceUrl: true });
  }

  goToHome() {
    this.router.navigate(['/home'], { replaceUrl: true });
  }

}
