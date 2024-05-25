import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RSSFeedComponent } from './rssfeed.component';

describe('RSSFeedComponent', () => {
  let component: RSSFeedComponent;
  let fixture: ComponentFixture<RSSFeedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RSSFeedComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RSSFeedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
