import { Component, OnInit, NgZone, HostListener } from '@angular/core';
import { IItem3d } from 'application-types'
import { LngLatLike, LngLat } from 'mapbox-gl';
import { MapCustomService } from './map-custom.service';
import * as MapboxDraw from '@mapbox/mapbox-gl-draw';
import * as turf from '@turf/turf';
import * as cloneDeep from 'lodash/cloneDeep';

import { Obj3dButtonsService } from '../ui/services/obj3d-buttons.service';
import { Item3dListService } from '../ui/services/item3d-list.service';
import { PolygonItems3dService } from '../services/polygon-items3d.service';
import { TimeSliderService } from '../ui/services/time-slider.service';
import { ItemTemplatesService } from '../services/item-templates.service';
import { ContentObserver } from '@angular/cdk/observers';
import { element } from 'protractor';





export interface Item3d {
  name: string;
  type?: string;
  coordinates: LngLatLike;
  selected?: boolean;
  parameters: {
    material?: {
      textures?: {
        map?: string;
        aoMap: string;
        displacementMap?: string;
        emmissiveMap?: string;
        normalMap?: string;
        roughnessMap?: string;
        metalnessMap?: string;
        alphaMap?: string;
        bumpMap?: string;
        lightMap?: string;
      };
      color?: any;
      transparent?: boolean;
      aoMapIntensity?: number;
      displacamentScale?: number;
      displacementBias?: number;
      emissiveIntensity?: number;
      emissive?: any; // color
      normalScale?: any; // vector2
      roughness?: number;
      metalness?: number;
      bumpScale?: number;
    } 
    dimensions?: any;
    textureRepeat?: { x: number, y: number, z?: number}
    modelPath?: string;
    scale?: number;
    polygonExtrusionHeight?: number;
  };
  polygon?: Array<[]>;
  polygonId?: string
}



@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit {

  map;
  mapStyle = 'mapbox://styles/mapbox/streets-v11';
  origin: LngLatLike = [34.7818, 32.0853];
  zoom = 18;
  pitch: number[] = [60];

  draw;

  date;

  markerLngLat: LngLatLike;

  removedFeatureList: string[] = ['149384668', '149271823', '149368834'];

  polygonFeatureList = [];
  polygonFeature;


  counter = {
    'office building': 0,
    'Residential building': 0,
    road: 0,
    tree: 0,
    commercial: 0,
    polygon: 0
  }


  configItemParam = {
    'office building': {
      material: {
        textures: {
          map: 'assets/textures/Facade014_1K-JPG/Facade014_1K_Color.jpg',
          // displacementMap: 'assets/textures/Facade014_1K-JPG/Facade014_1K_Displacement.jpg',
          emmissiveMap: 'assets/textures/Facade014_1K-JPG/Facade014_1K_Emission.jpg',
          normalMap: 'assets/textures/Facade014_1K-JPG/Facade014_1K_NormalGL.jpg',
          roughnessMap: 'assets/textures/Facade014_1K-JPG/Facade014_1K_Roughness.jpg',
        },
        // color: 'grey',
        // displacamentScale: 0.05,
        // displacementBias: 1,
        emissiveIntensity: 1.,
        emissive: 'black',
        normalScale: [1, 1],
        roughness: 1.0,
      }, 
      dimensions: { x: 10, y: 10, z: 25},
      textureRepeat: {x: 10, y: 10, z: 25}
    },
    'Residential building': {
      material: {
        textures: {
          map: 'assets/textures/Bricks038_1K-JPG/Bricks038_1K_Color.jpg',
          aoMap: 'assets/textures/Bricks038_1K-JPG/Bricks038_1K_AmbientOcclusion.jpg',
          displacementMap: 'assets/textures/Bricks038_1K-JPG/Bricks038_1K_Displacement.jpg',
          normalMap: 'assets/textures/Bricks038_1K-JPG/Bricks038_1K_NormalGL.jpg',
          roughnessMap: 'assets/textures/Bricks038_1K-JPG/Bricks038_1K_Roughness.jpg',
        },
        displacamentScale: 0.5,
        displacementBias: 0.,
        emissiveIntensity: 1.,
        emissive: 'black',
        normalScale: [1, 1],
        roughness: 1.0,
      },  
      dimensions: { x: 8, y: 8, z: 12},
      textureRepeat: {x: 8, y: 8}
    },
    road: {
      material: {
        textures: {
          map: 'assets/textures/Road007_1K-JPG/Road007_1K_Color.jpg',
          // displacementMap: 'assets/textures/Road007_1K-JPG/Road007_1K_Displacement.jpg',
          normalMap: 'assets/textures/Road007_1K-JPG/Road007_1K_NormalGL.jpg',
          roughnessMap: 'assets/textures/Road007_1K-JPG/Road007_1K_Roughness.jpg',
        },
        // displacamentScale: 0.5,
        // displacementBias: 0.,
        emissiveIntensity: 1.,
        emissive: 'black',
        normalScale: [1, 1],
        roughness: 1.0,
      },
      dimensions: { x: 7, y: 10, z: 0.1},
      textureRepeat: {x: 7, y: 10}
    },
    tree: {modelPath: 'assets/models/tree.glb', scale: 1},
    commercial: {
      material: {

        color: 'blue',
      },
      dimensions: { x: 10, y: 10, z: 10}},
    polygon: {
      material: {
        textures: {
          map: 'assets/textures/Facade014_1K-JPG/Facade014_1K_Color.jpg',
          // displacementMap: 'assets/textures/Facade014_1K-JPG/Facade014_1K_Displacement.jpg',
          emmissiveMap: 'assets/textures/Facade014_1K-JPG/Facade014_1K_Emission.jpg',
          normalMap: 'assets/textures/Facade014_1K-JPG/Facade014_1K_NormalGL.jpg',
          roughnessMap: 'assets/textures/Facade014_1K-JPG/Facade014_1K_Roughness.jpg',
        },
        // color: 'grey',
        // displacamentScale: 0.05,
        // displacementBias: 1,
        emissiveIntensity: 1.,
        emissive: 'black',
        normalScale: [1, 1],
        roughness: 1.0,
      }, 
      textureRepeat: {x: 10, y: 10},
      polygonExtrusionHeight: 30
    }
  };

  templatesArray = [];

  // texturesPath = {
  //   road: 'assets/textures/Road007_1K-JPG/Road007_1K_Color.jpg',
  //   offices: 'assets/textures/Facade014_1K-JPG/Facade014_1K_Color.jpg',
  //   bricks: 'assets/textures/Bricks038_1K-JPG/Bricks038_1K_Color.jpg',
  // };

  obj3dButtonOn;


  constructor(
    private mapService: MapCustomService,
    private obj3dButtonService: Obj3dButtonsService,
    private item3dListService: Item3dListService,
    private polygonItem3dService: PolygonItems3dService,
    private timeSliderService: TimeSliderService,
    private itemTemplateService: ItemTemplatesService) { }

  ngOnInit(): void {
    this.itemTemplateService.getTemplates().subscribe(data => {
      this.templatesArray = data.templates;
      console.log(this.templatesArray);
    })
    this.timeSliderService.timeSimulation$.subscribe((date) => {
      console.log("DATE PASSED", date);
      this.date = date;
      // if (this.map) {
      //   console.log('TRIGGER REPAINT')
        // this.map.triggerRepaint();
      // }
    });
    this.item3dListService.item3dToExport$.subscribe((item) => {
      this.mapService.add3dBoxLayer(this.map, item, true, this.date)
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
        this.obj3dButtonOn = buttonName;
        this.polygonItem3dService.getPolygonsItem3d().subscribe(data => {

          let polygonsItemsArray = data.features;

          polygonsItemsArray.forEach( pol => {
            this.createPolygon3dItem(pol);
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
    const templateParams = this.templatesArray.find(element => element.templateName === this.obj3dButtonOn);
    console.log(templateParams);
    console.log(this.obj3dButtonOn);


    let a3dItem: IItem3d = {
      name: this.obj3dButtonOn + (this.counter[this.obj3dButtonOn] + 1),
      itemType: this.obj3dButtonOn,
      coordinates: this.markerLngLat,
    };

    for (const [key, value] of Object.entries(templateParams)) {
      a3dItem[key] = cloneDeep(value);
    }
    console.log('New Item', a3dItem);

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
        this.polygonFeature = e.features[0];
        this.createPolygon3dItem(this.polygonFeature)
  
      });
      this.map.on('draw.update', (e) => {
        this.polygonFeature = e.features[0];
        this.createPolygon3dItem(this.polygonFeature)
      })
    }
    
    this.map.addControl(this.draw);
  }

  createPolygon3dItem(feature) {
    const polygonArray = feature.geometry.coordinates;
    const turfPolygon = turf.polygon(polygonArray)
    const centerOfPolygon = turf.centerOfMass(turfPolygon);
    const centerCoords = centerOfPolygon.geometry.coordinates;
    let itemFeature = this.polygonFeatureList.find(item => item.polygonId === feature.id)
    let type = feature.geometry.type.toLowerCase();
    const templateParams = this.templatesArray.find(element => element.templateName === 'polygon');
    console.log(type);
    let name = itemFeature ? itemFeature.name : type + (this.counter[type] +1);
    console.log(name);
    const a3dItem: IItem3d = {
      name: name,
      itemType: type,
      coordinates: new LngLat(centerCoords[0], centerCoords[1]),
      // parameters: cloneDeep(this.configItemParam[type]),
      polygon: polygonArray,
      polygonId: feature.id
    };
    for (const [key, value] of Object.entries(templateParams)) {
      a3dItem[key] = cloneDeep(value);
    }
    console.log('New Item', a3dItem);

    this.counter[type] += 1;

    this.polygonFeatureList.push(a3dItem);

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
