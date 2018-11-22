import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// import { extract } from '@app/core';
import { UniversalServiceComponent } from './universal-service.component';
import { PersonalDatesComponent } from '@app/universal-service/components/personal-dates/personal-dates.component';
import { SocialSecureVerificationComponent } from '@app/universal-service/components/social-secure-verification/social-secure-verification.component';

const routes: Routes = [
  { path: 'universal-service', component: UniversalServiceComponent, children: [
      // { path: '', loadChildren: '../home/home.module#HomeModule' },
      { path: 'personal-dates', component: PersonalDatesComponent},
      { path: 'social-secure-verification', component: SocialSecureVerificationComponent}
    ]}
  ];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: []
})
export class UniversalServiceRoutingModule {}
