import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Item3dComponent } from './item3d.component';

describe('Item3dComponent', () => {
  let component: Item3dComponent;
  let fixture: ComponentFixture<Item3dComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Item3dComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Item3dComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
