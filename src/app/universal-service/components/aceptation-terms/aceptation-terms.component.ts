import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '@app/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-aceptation-terms',
  templateUrl: './aceptation-terms.component.html',
  styleUrls: ['./aceptation-terms.component.scss']
})
export class AceptationTermsComponent implements OnInit {

  constructor(private authenticationService: AuthenticationService, private router: Router) { }

  ngOnInit() {
    window.scroll(0, 0);
  }

  goToPreviewViewAndFirm() {
    this.router.navigate(['/universal-service/preview-view-and-firm'], { replaceUrl: true });
  }

  goToHome() {
    this.router.navigate(['/home'], { replaceUrl: true });
  }

}
