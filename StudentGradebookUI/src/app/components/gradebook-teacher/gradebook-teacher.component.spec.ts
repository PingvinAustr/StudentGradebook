import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GradebookTeacherComponent } from './gradebook-teacher.component';

describe('GradebookTeacherComponent', () => {
  let component: GradebookTeacherComponent;
  let fixture: ComponentFixture<GradebookTeacherComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GradebookTeacherComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(GradebookTeacherComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
