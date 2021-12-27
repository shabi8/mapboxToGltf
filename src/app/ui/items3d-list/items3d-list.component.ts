import { Component, OnInit } from '@angular/core';
import { Item3dListService } from '../services/item3d-list.service';
import { Item3d } from 'src/app/map/map.component';

@Component({
  selector: 'app-items3d-list',
  templateUrl: './items3d-list.component.html',
  styleUrls: ['./items3d-list.component.css']
})
export class Items3dListComponent implements OnInit {

  items3dlist: Item3d[] = [];

  constructor(private item3dListService: Item3dListService) { }

  textures: any[] = [
    {value: 'assets/textures/Bricks038_1K-JPG/Bricks038_1K_Color.jpg', viewValue: 'Bricks'},
    {value: 'road', viewValue: 'Road'},
    {value: 'assets/textures/JerusalemStone/Bricks075A_1K_Color.jpg', viewValue: 'Stone'},
    {value: 'assets/textures/Facade014_1K-JPG/Facade014_1K_Color.jpg', viewValue: 'Office'},
  ];

  ngOnInit(): void {
    this.item3dListService.item3Added$.subscribe(item => {
      this.items3dlist.push(item);
      console.log(item);
    });
  }

  onChange(event, index) {
    console.log(event);
    console.log(this.items3dlist[index]);
    this.item3dListService.sendItem3dToEdit(this.items3dlist[index]);
  }

  trackByIndex(index: number, item: any): any {
    return item.name;
  }

}
