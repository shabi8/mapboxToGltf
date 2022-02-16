import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Item3dReactiveComponent } from './item3d-reactive.component';

describe('Item3dReactiveComponent', () => {
  let component: Item3dReactiveComponent;
  let fixture: ComponentFixture<Item3dReactiveComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Item3dReactiveComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Item3dReactiveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
