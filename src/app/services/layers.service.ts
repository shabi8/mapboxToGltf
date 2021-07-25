import { Injectable } from '@angular/core';
import { LayerOption } from 'application-types';

@Injectable({
  providedIn: 'root'
})
export class LayersService {

  layerOptions: LayerOption[] = [
    {
      name: 'cat',
      url: 'http://placekitten.com/g/60/60',
      projection: 1,
      type: 'jpg'
    },
    {
      name: 'dog',
      url: 'https://images.unsplash.com/photo-1586796314073-c9b40efb3d15?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80',
      projection: 1,
      type: 'jpg'
    },
    {
      name: '3d-Buildeing',
      url: 'https://dl.dropbox.com/s/di5vm2d6d55jzvd/Apartment%20Building_17_blend.gltf',
      projection: 2,
      type: 'gltf'
    },
    {
      name: '3d-Radar',
      url: 'https://docs.mapbox.com/mapbox-gl-js/assets/34M_17/34M_17.gltf',
      projection: 2,
      type: 'gltf'
    }
  ]

  constructor() { }

  getLayerOptions() {
    return this.layerOptions;
  }
}
