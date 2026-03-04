import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SplineContainer } from './spline-container';

describe('SplineContainer', () => {
  let component: SplineContainer;
  let fixture: ComponentFixture<SplineContainer>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SplineContainer]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SplineContainer);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
