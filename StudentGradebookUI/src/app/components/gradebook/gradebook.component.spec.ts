import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { GradebookComponent } from './gradebook.component';

describe('GradebookComponent', () => {
  let component: GradebookComponent;
  let fixture: ComponentFixture<GradebookComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ GradebookComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GradebookComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
