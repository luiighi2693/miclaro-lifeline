import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UsfCaseComponent } from './usf-case.component';

describe('UsfCaseComponent', () => {
  let component: UsfCaseComponent;
  let fixture: ComponentFixture<UsfCaseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UsfCaseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UsfCaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
