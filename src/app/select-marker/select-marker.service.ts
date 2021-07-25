import { Injectable } from '@angular/core';
import { LayerOption } from 'application-types';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SelectMarkerService {

  private _layerOptionSource = new Subject<LayerOption>();
  layerOption$ = this._layerOptionSource.asObservable();


  constructor() { }

  sendOption(option: LayerOption) {
    this._layerOptionSource.next(option);
  }
}
