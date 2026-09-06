import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QueriesPage } from './queries-page';

describe('QueriesPage', () => {
  let component: QueriesPage;
  let fixture: ComponentFixture<QueriesPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [QueriesPage],
    }).compileComponents();

    fixture = TestBed.createComponent(QueriesPage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
