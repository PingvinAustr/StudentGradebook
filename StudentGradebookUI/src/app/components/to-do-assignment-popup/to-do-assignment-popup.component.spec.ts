import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ToDoAssignmentPopupComponent } from './to-do-assignment-popup.component';

describe('ToDoAssignmentPopupComponent', () => {
  let component: ToDoAssignmentPopupComponent;
  let fixture: ComponentFixture<ToDoAssignmentPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ToDoAssignmentPopupComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ToDoAssignmentPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
