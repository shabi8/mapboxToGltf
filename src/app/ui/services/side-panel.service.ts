import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SidePanelService {

  private _openSidePanelSource = new Subject<boolean>();
  openSidePanel$ = this._openSidePanelSource.asObservable();


  constructor() { }

  openSidePanel(open: boolean) {
    this._openSidePanelSource.next(open);
  }
}
