import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DrawButtonsPanelComponent } from './draw-buttons-panel.component';

describe('DrawButtonsPanelComponent', () => {
  let component: DrawButtonsPanelComponent;
  let fixture: ComponentFixture<DrawButtonsPanelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DrawButtonsPanelComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DrawButtonsPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
