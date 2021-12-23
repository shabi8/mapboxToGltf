import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Items3dListComponent } from './items3d-list.component';

describe('Items3dListComponent', () => {
  let component: Items3dListComponent;
  let fixture: ComponentFixture<Items3dListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Items3dListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Items3dListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
