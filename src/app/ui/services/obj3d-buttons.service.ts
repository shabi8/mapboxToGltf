import { Injectable } from '@angular/core';
import { Subject, BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class Obj3dButtonsService {

  private _obj3dButtonOnSource = new BehaviorSubject<string>('office');
  obj3dButtonOn$ = this._obj3dButtonOnSource.asObservable();

  constructor() { }

  sendObj3dButtonON(buttonName: string) {
    this._obj3dButtonOnSource.next(buttonName);
  }

}
