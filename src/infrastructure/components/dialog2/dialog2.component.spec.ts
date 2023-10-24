import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Dialog2Component } from './dialog2.component';

describe('DialogComponent', () => {
  let component: Dialog2Component;
  let fixture: ComponentFixture<Dialog2Component>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [Dialog2Component]
    });
    fixture = TestBed.createComponent(Dialog2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
