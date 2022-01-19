import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TimeSliderService {

  private timeSimulationSource = new BehaviorSubject<Date>(new Date());
  timeSimulation$ = this.timeSimulationSource.asObservable();


  constructor() { }

  sendSimulatedTimeDate(date: Date) {
    this.timeSimulationSource.next(date);
  }
}
