import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Item3d } from 'src/app/map/map.component';

@Injectable({
  providedIn: 'root'
})
export class Item3dListService {

  private item3dAddedSource = new Subject<Item3d>();
  item3Added$ = this.item3dAddedSource.asObservable();

  private item3dToEditSource = new Subject<Item3d>();
  item3dToEdit$ = this.item3dToEditSource.asObservable();

  private item3dChangedSource = new Subject<Item3d>();
  item3dChanged$ = this.item3dChangedSource.asObservable();

  private item3dToRemoveSource = new Subject<Item3d>();
  itemToRemove$ = this.item3dToRemoveSource.asObservable();

  private item3dWasRemovedSource = new Subject<Item3d>();
  itemWasRemoved$ = this.item3dWasRemovedSource.asObservable();

  private item3dToExportSource = new Subject<Item3d>();
  item3dToExport$ = this.item3dToExportSource.asObservable();

  constructor() { }

  sendItem3dAdded(item3d: Item3d): void {
    this.item3dAddedSource.next(item3d);
  }

  sendItem3dToEdit(item3d: Item3d): void {
    this.item3dToEditSource.next(item3d);
  }

  sendItem3dChanged(item3d: Item3d): void {
    this.item3dChangedSource.next(item3d);
  }

  sendItemToRemove(item3d: Item3d): void {
    this.item3dToRemoveSource.next(item3d);
  }

  sendItemWasRemoved(item3d: Item3d): void {
    this.item3dWasRemovedSource.next(item3d);
  }

  sendItemToExport(item3d: Item3d): void {
    this.item3dToExportSource.next(item3d);
  }


}
