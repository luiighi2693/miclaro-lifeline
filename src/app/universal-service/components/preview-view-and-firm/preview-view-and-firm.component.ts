import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '@app/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-preview-view-and-firm',
  templateUrl: './preview-view-and-firm.component.html',
  styleUrls: ['./preview-view-and-firm.component.scss']
})
export class PreviewViewAndFirmComponent implements OnInit {

  firmInput = false;
  step2 = false;

  constructor(private authenticationService: AuthenticationService, private router: Router) { }

  ngOnInit() {
    window.scroll(0, 0);
  }

  goToStep2() {
    this.step2 = true;
  }

  showFirmInput() {
    this.firmInput = true;
  }

  goToActivation() {
    this.router.navigate(['/universal-service/activation'], { replaceUrl: true });
  }

  goToHome() {
    this.router.navigate(['/home'], { replaceUrl: true });
  }

}
