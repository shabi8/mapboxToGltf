import { Component, OnInit, NgZone, HostListener } from '@angular/core';
import { LngLatLike, LngLat } from 'mapbox-gl';
import { MapCustomService } from './map-custom.service';
import * as MapboxDraw from '@mapbox/mapbox-gl-draw';
import * as turf from '@turf/turf';

import { Obj3dButtonsService } from '../ui/services/obj3d-buttons.service';
import { Item3dListService } from '../ui/services/item3d-list.service';
import { PolygonItems3dService } from '../services/polygon-items3d.service';



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


  markerLngLat: LngLatLike;


  removedFeatureList: string[] = ['149384668', '149271823', '149368834'];

  object3D: Item3d;


  item3dAdded = {
    'office building': [],
    'Residential building': [],
    road: [],
    tree: [],
    commercial: [],
    polygon: []
  };

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
    private polygonItem3dService: PolygonItems3dService) { }

  ngOnInit(): void {
    this.item3dListService.item3dToEdit$.subscribe((item) => {
      this.mapService.add3dBoxLayer(this.map, item, false);
    });
    this.obj3dButtonService.obj3dButtonOn$.subscribe(buttonName => {
      if (buttonName === 'polygon service') {
        this.obj3dButtonOn === buttonName;
        this.polygonItem3dService.getPolygonsItem3d().subscribe(data => {

          let polygonsItemsArray = data.features;

          polygonsItemsArray.forEach( pol => {
            const polygonArray = pol.geometry.coordinates;
            this.createPolygon3dItem('polygon', polygonArray);
            // const turfPolygon = turf.polygon(pol.geometry.coordinates)
            // const centerOfPolygon = turf.centerOfMass(turfPolygon);

            // const centerCoords = centerOfPolygon.geometry.coordinates;
            // const a3dItem: Item3d = {
            //   name: 'polygon' + (this.item3dAdded['polygon'].length + 1),
            //   type: 'polygon',
            //   coordinates: new LngLat(centerCoords[0], centerCoords[1]),
            //   parameters: {color: 0xff0000, texture: ''},
            //   polygon: pol.geometry.coordinates
            // };
            // this.mapService.add3dBoxLayer(this.map, a3dItem, false);
            // this.item3dAdded['polygon'].push(a3dItem);
            // this.layerCount += 1;

            // this.item3dListService.sendItem3dAdded(a3dItem);
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
    this.mapService.objectSelected$.subscribe((objectSelected) => {
      console.log('ggg', objectSelected);
      this.object3D = objectSelected;
      // this.parameters.color = objectSelected.parameters.color;
      // this.parameters.dimensions = objectSelected.parameters.dimensions;
    });
  }



  addMarker(event): void {

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


  removeDrawControl() {
    return this.map.removeControl(this.draw);
  }

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
    this.map.on('draw.create', (e) => {

      const data = this.draw.getAll();

      const polygonArray = data.features[0].geometry.coordinates;
      console.log(polygonArray)
      this.createPolygon3dItem(this.obj3dButtonOn, polygonArray)

      // const turfPolygon = turf.polygon(polygonArray)
      // const centerOfPolygon = turf.centerOfMass(turfPolygon);
      // console.log('center of polygon ', centerOfPolygon.geometry.coordinates)
      // const centerCoords = centerOfPolygon.geometry.coordinates;
      // const a3dItem: Item3d = {
      //   name: this.obj3dButtonOn + (this.item3dAdded[this.obj3dButtonOn].length + 1),
      //   type: this.obj3dButtonOn,
      //   coordinates: new LngLat(centerCoords[0], centerCoords[1]),
      //   parameters: this.configItemParam[this.obj3dButtonOn],
      //   polygon: polygonArray
      // };
      // this.mapService.add3dBoxLayer(this.map, a3dItem, false);
      // this.item3dAdded[this.obj3dButtonOn].push(a3dItem);
      // this.layerCount += 1;

      // this.item3dListService.sendItem3dAdded(a3dItem);
    });

  }

  createPolygon3dItem(type: string, polygonArray) {
    const turfPolygon = turf.polygon(polygonArray)
    const centerOfPolygon = turf.centerOfMass(turfPolygon);
    const centerCoords = centerOfPolygon.geometry.coordinates;
    const a3dItem: Item3d = {
      name: type + (this.item3dAdded[type].length + 1),
      type: type,
      coordinates: new LngLat(centerCoords[0], centerCoords[1]),
      parameters: this.configItemParam[type],
      polygon: polygonArray
    };
    this.mapService.add3dBoxLayer(this.map, a3dItem, false);
    this.item3dAdded[type].push(a3dItem);
    this.layerCount += 1;

    this.item3dListService.sendItem3dAdded(a3dItem);
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
