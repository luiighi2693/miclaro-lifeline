import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '@app/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-personal-dates',
  templateUrl: './personal-dates.component.html',
  styleUrls: ['./personal-dates.component.scss']
})
export class PersonalDatesComponent implements OnInit {
  processValidationSIF = false;

  constructor(private authenticationService: AuthenticationService, private router: Router) { }

  ngOnInit() {
    window.scroll(0, 0);
  }

  goToSocialSecureVerification() {
    this.processValidationSIF = true;

    setTimeout(() => {
      this.router.navigate(['/universal-service/social-secure-verification'], { replaceUrl: true });
    }, 3000);

  }

  goToHome() {
    this.router.navigate(['/home'], { replaceUrl: true });
  }

}
