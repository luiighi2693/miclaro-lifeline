import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '@app/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-usf-verification',
  templateUrl: './usf-verification.component.html',
  styleUrls: ['./usf-verification.component.scss']
})
export class UsfVerificationComponent implements OnInit {

  processValidationNLAD = false;

  constructor(private authenticationService: AuthenticationService, private router: Router) { }

  ngOnInit() {
    window.scroll(0, 0);
  }

  goToDocumentDigitalization() {
    this.processValidationNLAD = true;

    setTimeout(() => {
      this.router.navigate(['/universal-service/document-digitalization'], { replaceUrl: true });
    }, 3000);

  }

  goToHome() {
    this.router.navigate(['/home'], { replaceUrl: true });
  }

}
