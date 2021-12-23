import { Component, OnInit, NgZone, HostListener } from '@angular/core';
import { LngLatLike, LngLat } from 'mapbox-gl';
import { MapCustomService } from './map-custom.service';
import * as MapboxDraw from "@mapbox/mapbox-gl-draw";
import * as turf from '@turf/turf';

import * as dat from 'dat.gui';
import { Obj3dButtonsService } from '../ui/services/obj3d-buttons.service';



export interface Item3d {
  name: string,
  type?: string,
  coordinates: LngLatLike,
  parameters: {
    color?: any,
    texture?: string,
    dimensions?: any,
    modelPath?:string
  }
}



@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit {
  private gui = new dat.GUI();
  private guibuilt;
  private layerCount: number = 1;

  map;
  mapStyle: string = "mapbox://styles/mapbox/streets-v11";
  origin: LngLatLike = [34.7818, 32.0853];
  zoom: number = 18;
  pitch: number[] = [60];

  draw;


  markerLngLat: LngLatLike;


  removedFeatureList: string[] = ['149384668', '149271823', '149368834']

  object3D: Item3d;

  objectSelected: string = 'Fuck';

  // parameters = {
  //   color: 0xffffff,
  //   texture: 'assets/textures/Road007_1K-JPG/Road007_1K_Color.jpg',
  //   dimensions: {x: 7, y: 20, z: 0.1},
  //   exportGLTF: () => {
  //     this.exportGltf();
  //   }
  // }

  // , '', , 
  configItemParam = {
    'office building': {texture: 'assets/textures/Facade014_1K-JPG/Facade014_1K_Color.jpg', dimensions: { x: 10, y: 10, z:10}},
    'Residential building': {texture: 'assets/textures/Bricks038_1K-JPG/Bricks038_1K_Color.jpg', dimensions: { x: 10, y: 10, z:10}},
    'road': {texture: 'assets/textures/Road007_1K-JPG/Road007_1K_Color.jpg', dimensions: { x: 7, y: 10, z: 0.1}},
    'tree': {modelPath: 'assets/models/tree.glb'},
    'commercial': {color: 0xff0000, dimensions: { x: 10, y: 10, z:10}}
  }

  texturesPath = {
    road: 'assets/textures/Road007_1K-JPG/Road007_1K_Color.jpg',
    offices: 'assets/textures/Facade014_1K-JPG/Facade014_1K_Color.jpg',
    bricks: 'assets/textures/Bricks038_1K-JPG/Bricks038_1K_Color.jpg',
  }

  obj3dButtonOn;


  constructor(private mapService: MapCustomService, private obj3dButtonService: Obj3dButtonsService) { }

  ngOnInit(): void {
    this.obj3dButtonService.obj3dButtonOn$.subscribe(buttonName => {
      this.obj3dButtonOn = buttonName;
      console.log('YYYY', this.obj3dButtonOn);
    })
    this.mapService.objectSelected$.subscribe((objectSelected) => {
      console.log('ggg', objectSelected);
      this.object3D = objectSelected;
      // this.parameters.color = objectSelected.parameters.color;
      // this.parameters.dimensions = objectSelected.parameters.dimensions;
    });
  }



  addMarker(event) {
    // console.log(event);
    const lng = event.lngLat.lng;
    const lat = event.lngLat.lat;
    const markLngLat = new LngLat(lng, lat);
    this.markerLngLat = markLngLat;

    const a3dItem: Item3d = {
      name: this.obj3dButtonOn + this.layerCount,
      type: this.obj3dButtonOn,
      coordinates: this.markerLngLat,
      parameters: this.configItemParam[this.obj3dButtonOn]

      
    }

    this.mapService.add3dBoxLayer(this.map, a3dItem, false);
    // this.buildGui();
    this.layerCount += 1;

  }


  // buildGui() {
  //   if(this.guibuilt) {
  //     return;
  //   } else {
  //     this.gui.addColor(this.parameters, 'color').onChange(() => {
  //       this.mapService.add3dBoxLayer(this.map, this.object3D.name, this.object3D.coordinates, this.parameters.dimensions, this.parameters.color, this.parameters.texture, false);
  //     });
  //     this.gui.add(this.parameters.dimensions, 'x').min(0.1).max(100).step(0.1).onChange(() => {
  //       console.log('TTTT', this.object3D.name);
  //       this.mapService.add3dBoxLayer(this.map, this.object3D.name, this.object3D.coordinates, this.parameters.dimensions, this.parameters.color, this.parameters.texture, false);
  //     });
  //     this.gui.add(this.parameters.dimensions, 'y').min(0.1).max(100).step(0.1).onChange(() => {
  //       this.mapService.add3dBoxLayer(this.map, this.object3D.name, this.object3D.coordinates, this.parameters.dimensions, this.parameters.color, this.parameters.texture, false);
  //     });
  //     this.gui.add(this.parameters.dimensions, 'z').min(0.1).max(100).step(0.1).onChange(() => {
  //       this.mapService.add3dBoxLayer(this.map, this.object3D.name, this.object3D.coordinates, this.parameters.dimensions, this.parameters.color, this.parameters.texture, false);
  //     });
  //     this.gui.add(this.parameters, 'texture', this.texturesPath).onChange(() => {
  //       this.mapService.add3dBoxLayer(this.map, this.object3D.name, this.object3D.coordinates, this.parameters.dimensions, this.parameters.color, this.parameters.texture, false);
  //     });
  //     this.gui.add(this.parameters, 'exportGLTF');

  //     this.guibuilt = true;
  //   }
    
  // }

  // exportGltf() {
  //   this.mapService.add3dBoxLayer(this.map, this.item3d1, true);
  // }

  /// draw polygon add to onload
  initDraw() {
    console.log('INIT Draw')
    this.draw = new MapboxDraw({
      displayControlsDefault: false,
      // Select which mapbox-gl-draw control buttons to add to the map.
      controls: {
      polygon: true,
      trash: true
      },
      // Set mapbox-gl-draw to draw by default.
      // The user does not have to click the polygon control button first.
      defaultMode: 'draw_polygon'
    });
    this.map.addControl(this.draw);
    this.map.on('draw.create', this.updateArea);
    this.map.on('draw.delete', this.updateArea);
    this.map.on('draw.update', this.updateArea);
  }

  updateArea(e) {
    const data = this.draw.getAll();
    const answer = document.getElementById('calculated-area');
    if (data.features.length > 0) {
    const area = turf.area(data);
    // Restrict the area to 2 decimal points.
    const rounded_area = Math.round(area * 100) / 100;
    answer.innerHTML = `<p><strong>${rounded_area}</strong></p><p>square meters</p>`;
    } else {
    answer.innerHTML = '';
    if (e.type !== 'draw.delete')
    alert('Click the map to draw a polygon.');
    }
    }

  /**
   * setting the state of the feature
   * @param event
   * @returns
   */
   clickOnLayer(event) {
    if (event.features.length > 0) {
      const feature = event.features[0];
      if (feature.state.clicked) {
        this.map.removeFeatureState({
          source: 'composite',
          sourceLayer: 'building',
          id: feature.id
        });
        return;
      }

      this.map.setFeatureState({
        source: 'composite',
        sourceLayer: 'building',
        id: feature.id
      }, {
        clicked: true
      })
    }
  }

  /**
   * This function is for setting all removed features to state 'clicked'.
   * Setting in paint and not in filter enable the option to remove state.
   * @param featuresIdList  this is the list of feature id that where removed should be loaded from a service.
   */

  removeFeaturesFromList(featuresIdList: string[]) {
    if (featuresIdList.length > 0) {
      for (const featureId of featuresIdList) {
        this.map.setFeatureState({
          source: 'composite',
          sourceLayer: 'building',
          id: featureId
        }, {
          clicked: true
        });
      }
    }
  }

  /**
   * after map is loaded removes the features that were selected in previous session
   * @param event
   */
  load(event) {
    this.removeFeaturesFromList(this.removedFeatureList);
  }

}
