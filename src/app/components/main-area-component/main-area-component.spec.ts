import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MainAreaComponent } from './main-area-component';

describe('MainAreaComponent', () => {
  let component: MainAreaComponent;
  let fixture: ComponentFixture<MainAreaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MainAreaComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(MainAreaComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
