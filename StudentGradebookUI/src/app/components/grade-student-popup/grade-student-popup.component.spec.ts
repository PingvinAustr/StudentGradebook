import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GradeStudentPopupComponent } from './grade-student-popup.component';

describe('GradeStudentPopupComponent', () => {
  let component: GradeStudentPopupComponent;
  let fixture: ComponentFixture<GradeStudentPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GradeStudentPopupComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(GradeStudentPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
