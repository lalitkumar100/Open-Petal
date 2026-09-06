import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccessDeniedDialog } from './access-denied-dialog';

describe('AccessDeniedDialog', () => {
  let component: AccessDeniedDialog;
  let fixture: ComponentFixture<AccessDeniedDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AccessDeniedDialog],
    }).compileComponents();

    fixture = TestBed.createComponent(AccessDeniedDialog);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
