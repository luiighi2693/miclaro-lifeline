import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '@app/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register-case',
  templateUrl: './register-case.component.html',
  styleUrls: ['./register-case.component.scss']
})
export class RegisterCaseComponent implements OnInit {

  constructor(private authenticationService: AuthenticationService, private router: Router) { }

  ngOnInit() {
    window.scroll(0, 0);
  }

  goToUsfVerification() {
    this.router.navigate(['/universal-service/usf-verification'], { replaceUrl: true });
  }

  goToHome() {
    this.router.navigate(['/home'], { replaceUrl: true });
  }

}
