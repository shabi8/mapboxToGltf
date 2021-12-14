import { Component, OnInit, NgZone, HostListener } from '@angular/core';
import { LayerOption } from 'application-types';
import { LngLatLike, LngLat } from 'mapbox-gl';
import { MapCustomService } from './map-custom.service';
import * as dat from 'dat.gui';



@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit {
  private gui = new dat.GUI();
  private guibuilt;

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
  show3dPopUp: boolean = false;

  parameters = {
    color: 0xffffff,
    texture: 'assets/textures/Bricks038_1K-JPG/Bricks038_1K_Color.jpg',
    dimensions: {x: 10, y: 10, z: 10},
    exportGLTF: () => {
      this.exportGltf();
    }
  }

  texturesPath = {
    road: 'assets/textures/Road007_1K-JPG/Road007_1K_Color.jpg',
    offices: 'assets/textures/Facade014_1K-JPG/Facade014_1K_Color.jpg',
    bricks: 'assets/textures/Bricks038_1K-JPG/Bricks038_1K_Color.jpg',
  }


  constructor(private mapService: MapCustomService) { }

  ngOnInit(): void {
  }


  onSelectedChange = ( e ) => {
    let selectedObject = e.detail; //we get the object selected/unselected
    let selectedValue = selectedObject.selected; //we get if the object is selected after the event
    this.object3D = selectedObject;
    this.show3dPopUp = selectedValue;
  }

  onObjectChanged = ( e ) => {
    let object = e.detail.object; // the object that has changed
    let action = e.detail.action; // the action that defines the change

    this.markerLngLat = new LngLat(action.position[0], action.position[1])
  }

  addMarker(event) {
    // console.log(event);
    const lng = event.lngLat.lng;
    const lat = event.lngLat.lat;
    const markLngLat = new LngLat(lng, lat);
    this.markerLngLat = markLngLat;
    // this.showMarker = true;
    this.mapService.add3dBoxLayer(this.map, 'box', this.markerLngLat, this.parameters.dimensions, this.parameters.color, this.parameters.texture, false);
    this.buildGui();

  }


  showDrag(marker) {
    // console.log(marker._lngLat);
    const lng = marker._lngLat.lng;
    const lat = marker._lngLat.lat;
    const markLngLat = new LngLat(lng, lat);
    this.markerLngLat = markLngLat;
  }

  buildGui() {
    if(this.guibuilt) {
      return;
    } else {
      this.gui.addColor(this.parameters, 'color').onChange(() => {
        this.mapService.add3dBoxLayer(this.map, 'box', this.markerLngLat, this.parameters.dimensions, this.parameters.color, this.parameters.texture, false);
      });
      this.gui.add(this.parameters.dimensions, 'x').min(0.1).max(100).step(0.1).onChange(() => {
        this.mapService.add3dBoxLayer(this.map, 'box', this.markerLngLat, this.parameters.dimensions, this.parameters.color, this.parameters.texture, false);
      });
      this.gui.add(this.parameters.dimensions, 'y').min(0.1).max(100).step(0.1).onChange(() => {
        this.mapService.add3dBoxLayer(this.map, 'box', this.markerLngLat, this.parameters.dimensions, this.parameters.color, this.parameters.texture, false);
      });
      this.gui.add(this.parameters.dimensions, 'z').min(0.1).max(100).step(0.1).onChange(() => {
        this.mapService.add3dBoxLayer(this.map, 'box', this.markerLngLat, this.parameters.dimensions, this.parameters.color, this.parameters.texture, false);
      });
      this.gui.add(this.parameters, 'texture', this.texturesPath).onChange(() => {
        this.mapService.add3dBoxLayer(this.map, 'box', this.markerLngLat, this.parameters.dimensions, this.parameters.color, this.parameters.texture, false);
      });
      this.gui.add(this.parameters, 'exportGLTF');

      this.guibuilt = true;
    }
    
  }

  exportGltf() {
    this.mapService.add3dBoxLayer(this.map, 'box', this.markerLngLat, this.parameters.dimensions, this.parameters.color, this.parameters.texture, true);
  }

}
