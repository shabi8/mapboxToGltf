import { Component, OnInit } from '@angular/core';
import { SelectMarkerService } from './select-marker.service';
import { LayerOption } from 'application-types';
import { LayersService } from '../services/layers.service';

@Component({
  selector: 'app-select-marker',
  templateUrl: './select-marker.component.html',
  styleUrls: ['./select-marker.component.css']
})
export class SelectMarkerComponent implements OnInit {

  selectedOption: LayerOption;


  layersOptions: LayerOption[];

  constructor(private selectMarkerService: SelectMarkerService, private layerService: LayersService) { }

  ngOnInit(): void {
    this.layersOptions = this.layerService.getLayerOptions();
  }

  sendOption(option: LayerOption) {
    this.selectMarkerService.sendOption(option);
  }

}
