import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-items3d-list',
  templateUrl: './items3d-list.component.html',
  styleUrls: ['./items3d-list.component.css']
})
export class Items3dListComponent implements OnInit {

  items3dlist = ['TREE', 'BUILDING', 'TREE-2', 'GGGG', 'STORE', 'GARDEN']

  constructor() { }

  ngOnInit(): void {
  }

}
