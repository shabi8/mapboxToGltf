import { Component, NgZone, OnInit } from '@angular/core';
import { Item3dListService } from '../services/item3d-list.service';
import { Item3d } from 'src/app/map/map.component';
import { MapCustomService } from 'src/app/map/map-custom.service';

@Component({
  selector: 'app-items3d-list',
  templateUrl: './items3d-list.component.html',
  styleUrls: ['./items3d-list.component.css']
})
export class Items3dListComponent implements OnInit {

  items3dlist: Item3d[] = [];

  itemSelected;

  constructor(private item3dListService: Item3dListService, private mapCustomService: MapCustomService, private ngZone: NgZone) { }

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
    this.mapCustomService.objectSelected$.subscribe(item => {
      this.ngZone.run(() => {
        this.items3dlist.sort((a, b) => {return a.name == item.name ? -1 : b.name == item.name ? 1 : 0 });
        this.itemSelected = item.name;
      });
      // let index = this.items3dlist.findIndex(obj => obj.name == item.name);
      // this.items3dlist[index].selected = true
      // this.itemSelected = item.name;
      // console.log('UUUU', this.itemSelected);
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
