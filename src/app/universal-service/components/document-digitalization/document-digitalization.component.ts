import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '@app/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-document-digitalization',
  templateUrl: './document-digitalization.component.html',
  styleUrls: ['./document-digitalization.component.scss']
})
export class DocumentDigitalizationComponent implements OnInit {

  previewView = false;

  constructor(private authenticationService: AuthenticationService, private router: Router) { }

  ngOnInit() {
    window.scroll(0, 0);
  }

  goToPreviewView() {
    this.previewView = true;
  }

  goToAccountCreation() {
    this.router.navigate(['/universal-service/account-creation'], { replaceUrl: true });
  }

  goToHome() {
    this.router.navigate(['/home'], { replaceUrl: true });
  }

  chargeDocuments() {
    this.previewView = false;
  }
}
