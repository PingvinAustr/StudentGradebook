import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GradeDetailPopupComponent } from './grade-detail-popup.component';

describe('GradeDetailPopupComponent', () => {
  let component: GradeDetailPopupComponent;
  let fixture: ComponentFixture<GradeDetailPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GradeDetailPopupComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(GradeDetailPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
