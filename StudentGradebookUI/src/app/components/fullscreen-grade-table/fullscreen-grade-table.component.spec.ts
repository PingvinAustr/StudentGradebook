import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FullscreenGradeTableComponent } from './fullscreen-grade-table.component';

describe('FullscreenGradeTableComponent', () => {
  let component: FullscreenGradeTableComponent;
  let fixture: ComponentFixture<FullscreenGradeTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FullscreenGradeTableComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FullscreenGradeTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
