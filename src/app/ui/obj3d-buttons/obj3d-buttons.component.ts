import { Component, OnInit } from '@angular/core';
import { Obj3dButtonsService } from '../services/obj3d-buttons.service';

@Component({
  selector: 'app-obj3d-buttons',
  templateUrl: './obj3d-buttons.component.html',
  styleUrls: ['./obj3d-buttons.component.css']
})
export class Obj3dButtonsComponent implements OnInit {

  obj3dButtonsList = ['office building', 'Residential building', 'commercial', 'road', 'tree'];
  obj3d: string = 'office building';

  constructor(private obj3dButtonService: Obj3dButtonsService) { }

  ngOnInit(): void {
  }

  onChange(event) {
    this.obj3dButtonService.sendObj3dButtonON(event);
  }

}
