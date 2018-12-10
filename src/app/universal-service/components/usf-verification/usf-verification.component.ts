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

  socialSecure = '';
  format2 = 'XXX-XX-XXXX';

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

  numberOnly(event: any): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }

  formatInputSocialSecure(input: string) {
    this.socialSecure = this.formatInput(this.socialSecure, this.format2);
  }

  private formatInput(input: string, format: string) {
    if (format === this.format2) {
      if (input.length === 4) {
        return input.substr(0, input.length - 1) + '-' + input.substr(input.length - 1, input.length);
      }

      if (input.length === 7) {
        return input.substr(0, input.length - 1) + '-' + input.substr(input.length - 1, input.length);
      }

      return input;
    }

    return '';
  }

}
