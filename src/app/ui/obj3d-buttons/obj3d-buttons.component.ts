import { Component, OnInit } from '@angular/core';
import { Obj3dButtonsService } from '../services/obj3d-buttons.service';

@Component({
  selector: 'app-obj3d-buttons',
  templateUrl: './obj3d-buttons.component.html',
  styleUrls: ['./obj3d-buttons.component.css']
})
export class Obj3dButtonsComponent implements OnInit {

  obj3dButtonsList = ['office', 'residential', 'commercial', 'road', 'tree', 'polygon', 'polygon service'];
  obj3d: string = 'office';

  constructor(private obj3dButtonService: Obj3dButtonsService) { }

  ngOnInit(): void {
  }

  onChange(event) {
    this.obj3dButtonService.sendObj3dButtonON(event);
  }

}
