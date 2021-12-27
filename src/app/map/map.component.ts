import { Component, OnInit, NgZone, HostListener } from '@angular/core';
import { LngLatLike, LngLat } from 'mapbox-gl';
import { MapCustomService } from './map-custom.service';
import * as MapboxDraw from '@mapbox/mapbox-gl-draw';
import * as turf from '@turf/turf';

import { Obj3dButtonsService } from '../ui/services/obj3d-buttons.service';
import { Item3dListService } from '../ui/services/item3d-list.service';



export interface Item3d {
  name: string;
  type?: string;
  coordinates: LngLatLike;
  parameters: {
    color?: any,
    texture?: string,
    dimensions?: any,
    modelPath?: string,
    scale?: number
  };
}



@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit {

  private layerCount = 1;

  map;
  mapStyle = 'mapbox://styles/mapbox/streets-v11';
  origin: LngLatLike = [34.7818, 32.0853];
  zoom = 18;
  pitch: number[] = [60];

  draw;


  markerLngLat: LngLatLike;


  removedFeatureList: string[] = ['149384668', '149271823', '149368834'];

  object3D: Item3d;

  // objectSelected: string = 'Fuck';

  // parameters = {
  //   color: 0xffffff,
  //   texture: 'assets/textures/Road007_1K-JPG/Road007_1K_Color.jpg',
  //   dimensions: {x: 7, y: 20, z: 0.1},
  //   exportGLTF: () => {
  //     this.exportGltf();
  //   }
  // }

  item3dAdded = {
    'office building': [],
    'Residential building': [],
    road: [],
    tree: [],
    commercial: []
  };

  configItemParam = {
    'office building': {texture: 'assets/textures/Facade014_1K-JPG/Facade014_1K_Color.jpg', dimensions: { x: 10, y: 10, z: 25}},
    'Residential building': {texture: 'assets/textures/Bricks038_1K-JPG/Bricks038_1K_Color.jpg', dimensions: { x: 8, y: 8, z: 12}},
    road: {texture: 'assets/textures/Road007_1K-JPG/Road007_1K_Color.jpg', dimensions: { x: 7, y: 10, z: 0.1}},
    tree: {modelPath: 'assets/models/tree.glb', scale: 1},
    commercial: {color: 0xff0000, dimensions: { x: 10, y: 10, z: 10}}
  };

  texturesPath = {
    road: 'assets/textures/Road007_1K-JPG/Road007_1K_Color.jpg',
    offices: 'assets/textures/Facade014_1K-JPG/Facade014_1K_Color.jpg',
    bricks: 'assets/textures/Bricks038_1K-JPG/Bricks038_1K_Color.jpg',
  };

  obj3dButtonOn;


  constructor(
    private mapService: MapCustomService,
    private obj3dButtonService: Obj3dButtonsService,
    private item3dListService: Item3dListService) { }

  ngOnInit(): void {
    this.item3dListService.item3dToEdit$.subscribe((item) => {
      this.mapService.add3dBoxLayer(this.map, item, false);
    });
    this.obj3dButtonService.obj3dButtonOn$.subscribe(buttonName => {
      this.obj3dButtonOn = buttonName;
      console.log('YYYY', this.obj3dButtonOn);
    });
    this.mapService.objectSelected$.subscribe((objectSelected) => {
      console.log('ggg', objectSelected);
      this.object3D = objectSelected;
      // this.parameters.color = objectSelected.parameters.color;
      // this.parameters.dimensions = objectSelected.parameters.dimensions;
    });
  }



  addMarker(event): void {
    // console.log(event);
    const lng = event.lngLat.lng;
    const lat = event.lngLat.lat;
    const markLngLat = new LngLat(lng, lat);
    this.markerLngLat = markLngLat;

    const a3dItem: Item3d = {
      name: this.obj3dButtonOn + (this.item3dAdded[this.obj3dButtonOn].length + 1),
      type: this.obj3dButtonOn,
      coordinates: this.markerLngLat,
      parameters: this.configItemParam[this.obj3dButtonOn]

    };

    this.mapService.add3dBoxLayer(this.map, a3dItem, false);
    // this.buildGui();
    this.item3dAdded[this.obj3dButtonOn].push(a3dItem);
    this.layerCount += 1;
    console.log(this.item3dAdded);
    this.item3dListService.sendItem3dAdded(a3dItem);
  }




  // exportGltf() {
  //   this.mapService.add3dBoxLayer(this.map, this.item3d1, true);
  // }

  /// draw polygon add to onload
  initDraw(): void {
    console.log('INIT Draw');
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

  updateArea(e): void {
    const data = this.draw.getAll();
    const answer = document.getElementById('calculated-area');
    if (data.features.length > 0) {
    const area = turf.area(data);
    // Restrict the area to 2 decimal points.
    const roundedArea = Math.round(area * 100) / 100;
    answer.innerHTML = `<p><strong>${roundedArea}</strong></p><p>square meters</p>`;
    } else {
    answer.innerHTML = '';
    if (e.type !== 'draw.delete') {
     alert('Click the map to draw a polygon.');
    }
    }
    }


   clickOnLayer(event): any {
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
      });
    }
  }

  /**
   * This function is for setting all removed features to state 'clicked'.
   * Setting in paint and not in filter enable the option to remove state.
   * @param featuresIdList  this is the list of feature id that where removed should be loaded from a service.
   */

  removeFeaturesFromList(featuresIdList: string[]): void {
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

  load(event): void {
    this.removeFeaturesFromList(this.removedFeatureList);
  }

}
