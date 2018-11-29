import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '@app/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-usf-case',
  templateUrl: './usf-case.component.html',
  styleUrls: ['./usf-case.component.scss']
})
export class UsfCaseComponent implements OnInit {

  constructor(private authenticationService: AuthenticationService, private router: Router) { }

  ngOnInit() {
  }

  goToHome() {
    this.router.navigate(['/home'], { replaceUrl: true });
  }
}
