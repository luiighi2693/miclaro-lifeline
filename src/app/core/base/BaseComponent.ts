import { AuthenticationService } from '@app/core';
import { UsfServiceService } from '@app/core/usf/usf-service.service';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup } from '@angular/forms';
import Util from '@app/universal-service/util';
import * as moment from 'moment';

export class BaseComponent {
  public form: FormGroup;

  constructor(
    public authenticationService: AuthenticationService,
    public usfServiceService: UsfServiceService,
    public router: Router,
    public fb: FormBuilder
  ) {}

  public goToHome() {
    this.router.navigate(['/home'], { replaceUrl: true });
  }

  public checkNumbersOnly(event: any): boolean {
    return Util.checkNumbersOnly(event);
  }

  public checkCharactersOnly(event: any): boolean {
    return Util.checkCharactersOnly(event);
  }

  public formatDate(date: any) {
    return date.year + '-' + date.month + '-' + date.day;
  }

  getFormatDateCustom(date: string) {
    return moment(new Date(date)).format('MM/DD/YYYY');
  }
}
