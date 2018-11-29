import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '@app/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-account-creation',
  templateUrl: './account-creation.component.html',
  styleUrls: ['./account-creation.component.scss']
})
export class AccountCreationComponent implements OnInit {

  processValidationSIF = false;

  constructor(private authenticationService: AuthenticationService, private router: Router) { }

  ngOnInit() {
    window.scroll(0, 0);
  }

  goToAceptationTerms() {
    this.processValidationSIF = true;

    setTimeout(() => {
      this.router.navigate(['/universal-service/aceptation-terms'], { replaceUrl: true });
    }, 3000);

  }

  goToHome() {
    this.router.navigate(['/home'], { replaceUrl: true });
  }

}
