import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyQueriesPage } from './my-queries-page';

describe('MyQueriesPage', () => {
  let component: MyQueriesPage;
  let fixture: ComponentFixture<MyQueriesPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MyQueriesPage],
    }).compileComponents();

    fixture = TestBed.createComponent(MyQueriesPage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
