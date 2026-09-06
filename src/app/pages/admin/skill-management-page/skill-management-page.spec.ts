import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SkillManagementPage } from './skill-management-page';

describe('SkillManagementPage', () => {
  let component: SkillManagementPage;
  let fixture: ComponentFixture<SkillManagementPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SkillManagementPage],
    }).compileComponents();

    fixture = TestBed.createComponent(SkillManagementPage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
