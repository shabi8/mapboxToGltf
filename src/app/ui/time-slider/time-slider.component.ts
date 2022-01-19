import { Component, OnInit } from '@angular/core';
import { TimeSliderService } from '../services/time-slider.service';

@Component({
  selector: 'app-time-slider',
  templateUrl: './time-slider.component.html',
  styleUrls: ['./time-slider.component.css']
})
export class TimeSliderComponent implements OnInit {

  date: Date;
  time;
  value;

  datefromformat;
 

  constructor(private timeSliderService: TimeSliderService) { }

  ngOnInit(): void {
    this.date = new Date();
    this.time = this.date.getHours() * 60 * 60 + this.date.getMinutes() * 60 + this.date.getSeconds();
    this.value = this.time;
    console.log(this.value)
  }

  formatLabel(value: number) {
    let date = new Date();
    let time = date.getHours() * 60 * 60 + date.getMinutes() * 60 + date.getSeconds();
    // value = time;
    time = +value;
    date.setHours(Math.floor(time / 60 / 60));
    date.setMinutes(Math.floor(time / 60) % 60);
    date.setSeconds(time % 60);
    // console.log(this.date);
    // console.log(this.time);
    this.datefromformat = date;

    return date.toLocaleString('en-GB', { timeZone: 'UTC', hour12: false });
  }

  onInput(event) {
    // console.log(this.value);
    // console.log(event.value)
    this.time = +event.value;
    this.date.setHours(Math.floor(this.time / 60 / 60));
    this.date.setMinutes(Math.floor(this.time / 60) % 60);
    this.date.setSeconds(this.time % 60);
    // console.log(this.date);
    // console.log('DATE FROM: ', this.datefromformat)
    // this.map.triggerRepaint()
    this.timeSliderService.sendSimulatedTimeDate(this.date);
  }



}
