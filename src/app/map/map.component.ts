import { Component, OnInit, NgZone, HostListener } from '@angular/core';
import { LngLatLike, LngLat } from 'mapbox-gl';
import { MapCustomService } from './map-custom.service';
import * as MapboxDraw from '@mapbox/mapbox-gl-draw';
import * as turf from '@turf/turf';

import { Obj3dButtonsService } from '../ui/services/obj3d-buttons.service';
import { Item3dListService } from '../ui/services/item3d-list.service';
import { PolygonItems3dService } from '../services/polygon-items3d.service';
import { TimeSliderService } from '../ui/services/time-slider.service';




export interface Item3d {
  name: string;
  type?: string;
  coordinates: LngLatLike;
  selected?: boolean;
  parameters: {
    color?: any,
    texture?: string,
    dimensions?: any,
    modelPath?: string,
    scale?: number
  };
  polygon?: Array<[]>
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

  date;


  markerLngLat: LngLatLike;


  removedFeatureList: string[] = ['149384668', '149271823', '149368834'];

  // object3D: Item3d;


  // item3dAdded = {
  //   'office building': [],
  //   'Residential building': [],
  //   road: [],
  //   tree: [],
  //   commercial: [],
  //   polygon: []
  // };

  counter = {
    'office building': 0,
    'Residential building': 0,
    road: 0,
    tree: 0,
    commercial: 0,
    polygon: 0
  }

  configItemParam = {
    'office building': {texture: 'assets/textures/Facade014_1K-JPG/Facade014_1K_Color.jpg', dimensions: { x: 10, y: 10, z: 25}},
    'Residential building': {texture: 'assets/textures/Bricks038_1K-JPG/Bricks038_1K_Color.jpg', dimensions: { x: 8, y: 8, z: 12}},
    road: {texture: 'assets/textures/Road007_1K-JPG/Road007_1K_Color.jpg', dimensions: { x: 7, y: 10, z: 0.1}},
    tree: {modelPath: 'assets/models/tree.glb', scale: 1},
    commercial: {color: 0xff0000, dimensions: { x: 10, y: 10, z: 10}},
    polygon: {color: 0xff0000, texture: ''}
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
    private item3dListService: Item3dListService,
    private polygonItem3dService: PolygonItems3dService,
    private timeSliderService: TimeSliderService) { }

  ngOnInit(): void {
    this.timeSliderService.timeSimulation$.subscribe((date) => {
      console.log("DATE PASSED", date);
      this.date = date;
      // if (this.map) {
      //   console.log('TRIGGER REPAINT')
        // this.map.triggerRepaint();
      // }
    });
    this.item3dListService.itemToRemove$.subscribe((item) => {
      this.mapService.remove3dBoxLayer(this.map, item);
    });
    this.item3dListService.item3dToEdit$.subscribe((item) => {
      this.mapService.add3dBoxLayer(this.map, item, false, this.date);
      console.log(item)
      console.log('YES it is edited!!')
    });
    this.obj3dButtonService.obj3dButtonOn$.subscribe(buttonName => {
      if (buttonName === 'polygon service') {
        this.obj3dButtonOn === buttonName;
        this.polygonItem3dService.getPolygonsItem3d().subscribe(data => {

          let polygonsItemsArray = data.features;

          polygonsItemsArray.forEach( pol => {
            const polygonArray = pol.geometry.coordinates;
            this.createPolygon3dItem('polygon', polygonArray);
          });
        });
      }
      if (buttonName ==='polygon') {
        this.obj3dButtonOn = buttonName;
        this.initDraw();
      } else if (this.obj3dButtonOn === 'polygon' && buttonName !== 'polygon') {
        this.removeDrawControl();
        this.obj3dButtonOn = buttonName;
      } else {
        this.obj3dButtonOn = buttonName;
        console.log('YYYY', this.obj3dButtonOn);
      }
    });
  }

  onRender(event) {
    // console.log(event)
    if (window['tb'] && this.obj3dButtonOn !== 'polygon') {
      console.log('SUNLIGHT')
      window['tb'].setSunlight(this.date);
      window['tb'].update();
    }
  }



  addMarker(event): void {

    const lng = event.lngLat.lng;
    const lat = event.lngLat.lat;
    const markLngLat = new LngLat(lng, lat);
    this.markerLngLat = markLngLat;

    const a3dItem: Item3d = {
      name: this.obj3dButtonOn + (this.counter[this.obj3dButtonOn] + 1),
      type: this.obj3dButtonOn,
      coordinates: this.markerLngLat,
      parameters: this.configItemParam[this.obj3dButtonOn]
    };

    this.counter[this.obj3dButtonOn] += 1;

    this.mapService.add3dBoxLayer(this.map, a3dItem, false, this.date);
  }


  removeDrawControl() {
    return this.map.removeControl(this.draw);
  }

  initDraw(): void {
    if (!this.draw) {
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

      this.map.on('draw.create', (e) => {
        console.log(e);
  
        const polygonArray = e.features[0].geometry.coordinates;
        console.log(polygonArray)
        this.createPolygon3dItem(this.obj3dButtonOn, polygonArray)
  
      });
    }
    
    this.map.addControl(this.draw);
  }

  createPolygon3dItem(type: string, polygonArray) {
    const turfPolygon = turf.polygon(polygonArray)
    const centerOfPolygon = turf.centerOfMass(turfPolygon);
    const centerCoords = centerOfPolygon.geometry.coordinates;
    const a3dItem: Item3d = {
      name: type + (this.counter[type] + 1),
      type: type,
      coordinates: new LngLat(centerCoords[0], centerCoords[1]),
      parameters: this.configItemParam[type],
      polygon: polygonArray
    };

    this.counter[type] += 1;

    this.mapService.add3dBoxLayer(this.map, a3dItem, false, this.date);

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
