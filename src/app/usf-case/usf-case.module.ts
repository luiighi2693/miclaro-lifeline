import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UsfCaseComponent } from './usf-case.component';
import { UsfCaseRoutingModule } from './usf-case-routing.module';
import { SharedModule } from '@app/shared/shared.module';

@NgModule({
  declarations: [UsfCaseComponent],
  imports: [
    CommonModule,
    UsfCaseRoutingModule,
    SharedModule
  ]
})
export class UsfCaseModule { }
