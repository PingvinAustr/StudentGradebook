import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardInfoTeacherComponent } from './dashboard-info-teacher.component';

describe('DashboardInfoTeacherComponent', () => {
  let component: DashboardInfoTeacherComponent;
  let fixture: ComponentFixture<DashboardInfoTeacherComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardInfoTeacherComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DashboardInfoTeacherComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
