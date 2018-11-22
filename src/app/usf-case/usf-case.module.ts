import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UsfCaseComponent } from './usf-case.component';
import { UsfCaseRoutingModule } from './usf-case-routing.module';

@NgModule({
  declarations: [UsfCaseComponent],
  imports: [
    CommonModule,
    UsfCaseRoutingModule
  ]
})
export class UsfCaseModule { }
