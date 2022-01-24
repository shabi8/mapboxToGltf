import { Component, Input, OnInit } from '@angular/core';
import { Item3dListService } from '../services/item3d-list.service';
import { Item3d } from 'src/app/map/map.component';

@Component({
  selector: 'app-item3d',
  templateUrl: './item3d.component.html',
  styleUrls: ['./item3d.component.css']
})
export class Item3dComponent implements OnInit {
  @Input()
  item: Item3d;

  @Input()
  expand: boolean;

  textures: any[] = [
    {value: 'assets/textures/Bricks038_1K-JPG/Bricks038_1K_Color.jpg', viewValue: 'Bricks'},
    {value: 'assets/textures/Road007_1K-JPG/Road007_1K_Color.jpg', viewValue: 'Road'},
    {value: 'assets/textures/JerusalemStone/Bricks075A_1K_Color.jpg', viewValue: 'Stone'},
    {value: 'assets/textures/Facade014_1K-JPG/Facade014_1K_Color.jpg', viewValue: 'Office'},
  ];

  constructor(private item3dListService: Item3dListService) { }

  ngOnInit(): void {
  }

  onChange(event) {
    console.log(event);
    // console.log(this.items3dlist[index]);
    this.item3dListService.sendItem3dToEdit(this.item);
  }

  itemToRemove() {
    this.item3dListService.sendItemToRemove(this.item);
  }

}
