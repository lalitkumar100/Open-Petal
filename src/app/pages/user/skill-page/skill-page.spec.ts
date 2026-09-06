import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SkillPage } from './skill-page';

describe('SkillPage', () => {
  let component: SkillPage;
  let fixture: ComponentFixture<SkillPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SkillPage],
    }).compileComponents();

    fixture = TestBed.createComponent(SkillPage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
