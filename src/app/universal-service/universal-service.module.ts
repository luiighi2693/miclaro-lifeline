import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UniversalServiceComponent } from './universal-service.component';
import { UniversalServiceRoutingModule } from './universal-service-routing.module'
import { PersonalDatesComponent } from './components/personal-dates/personal-dates.component';
import { SocialSecureVerificationComponent } from './components/social-secure-verification/social-secure-verification.component';
import { SharedModule } from '@app/shared/shared.module';

@NgModule({
  declarations: [UniversalServiceComponent, PersonalDatesComponent, SocialSecureVerificationComponent],
  imports: [
    CommonModule,
    UniversalServiceRoutingModule,
    SharedModule
  ]
})
export class UniversalServiceModule { }
