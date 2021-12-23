import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Obj3dButtonsComponent } from './obj3d-buttons.component';

describe('Obj3dButtonsComponent', () => {
  let component: Obj3dButtonsComponent;
  let fixture: ComponentFixture<Obj3dButtonsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Obj3dButtonsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Obj3dButtonsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
