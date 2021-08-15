import { Component, OnInit, NgZone, HostListener } from '@angular/core';
import { LayerOption } from 'application-types';
import { LngLatLike, LngLat } from 'mapbox-gl';
import { SelectMarkerService } from '../select-marker/select-marker.service';
import { MapCustomService } from './map-custom.service';


@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit {

  map;
  mapStyle: string = "mapbox://styles/mapbox/streets-v9";
  origin: LngLatLike = [34.8516, 31.0461];
  zoom: number = 18;
  pitch: number[] = [60];

  showMarker = false;
  markerLngLat: LngLatLike;
  markerDraggable: boolean = true;
  markerClass: string = 'catImage';
  markerImage =  "https://docs.mapbox.com/mapbox-gl-js/assets/washington-monument.jpg";
  markerSelectedOption: LayerOption;

  object3D;
  show3dPopUp: boolean;

  constructor(private selectMarkerService: SelectMarkerService, private ngZone: NgZone, private mapService: MapCustomService) { }

  ngOnInit(): void {
    this.selectMarkerService.layerOption$.subscribe((option: LayerOption) => {
      console.log(option);
      console.log(this.map);
      if (this.markerSelectedOption && this.markerSelectedOption.projection === 2) {
        // this.map.removeLayer(this.markerSelectedOption.name);
        window['tb'].clear(true);
      }
      this.show3dPopUp = false;
      if (option.projection === 1) {
        if (this.object3D){
          window['tb'].remove(this.object3D)
        }
        this.showMarker = true;
        this.markerImage = option.url;
      }
      if (option.projection === 2) {
        this.showMarker = false; // if you want to see 3d model change with marker comment this line
        this.mapService.add3dLayer(this.map, option, this.markerLngLat, this.onObjectChanged, this.onSelectedChange)


      }
      this.markerSelectedOption = option;
    });
  }


  onSelectedChange = ( e ) => {
    let selectedObject = e.detail; //we get the object selected/unselected
    let selectedValue = selectedObject.selected; //we get if the object is selected after the event

    this.show3dPopUp = selectedValue;
    this.object3D = selectedObject;
  }

  onObjectChanged = ( e ) => {
    let object = e.detail.object; // the object that has changed
    let action = e.detail.action; // the action that defines the change

    this.markerLngLat = new LngLat(action.position[0], action.position[1])
  }

  addMarker(event) {
    console.log(event);
    const lng = event.lngLat.lng;
    const lat = event.lngLat.lat;
    const markLngLat = new LngLat(lng, lat);
    this.markerLngLat = markLngLat;
    this.showMarker = true;

  }


  showDrag(marker) {
    console.log(marker._lngLat);
    const lng = marker._lngLat.lng;
    const lat = marker._lngLat.lat;
    const markLngLat = new LngLat(lng, lat);
    this.markerLngLat = markLngLat;
  }

}
