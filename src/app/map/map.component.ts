import { Component, OnInit, NgZone } from '@angular/core';
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
  markerClass: string = 'catImage'
  markerImage =  "https://docs.mapbox.com/mapbox-gl-js/assets/washington-monument.jpg"


  constructor(private selectMarkerService: SelectMarkerService, private ngZone: NgZone, private mapService: MapCustomService) { }

  ngOnInit(): void {
    this.selectMarkerService.layerOption$.subscribe((option: LayerOption) => {
      console.log(option);
      if (option.projection === 1) {
        this.markerImage = option.url;
      }
      if (option.projection === 2) {
        this.showMarker = false; // if you want to see 3d model change with marker comment this line
        this.mapService.add3dLayer(this.map, option, this.markerLngLat)
      }
    });
  }

  addMarker(event) {
    console.log(event);
    const lng = event.lngLat.lng;
    const lat = event.lngLat.lat;
    const markLngLat = new LngLat(lng, lat);
    this.markerLngLat = markLngLat;
    this.showMarker = true; // for 3d first commet this line

    // and uncomment this block. !!! no options available when 3d first!!!
    // this.mapService.add3dLayer(this.map, {
    //   name: '3d-Buildeing',
    //   url: 'https://dl.dropbox.com/s/di5vm2d6d55jzvd/Apartment%20Building_17_blend.gltf',
    //   projection: 2,
    //   type: 'gltf'
    // }, this.markerLngLat)
  }


  showDrag(marker) {
    console.log(marker._lngLat);
    const lng = marker._lngLat.lng;
    const lat = marker._lngLat.lat;
    const markLngLat = new LngLat(lng, lat);
    this.markerLngLat = markLngLat;
  }

}
