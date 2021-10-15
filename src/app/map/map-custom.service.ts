import { Injectable } from '@angular/core';
import { LayerOption } from 'application-types';

declare const Threebox: any;

@Injectable({
  providedIn: 'root'
})
export class MapCustomService {

  constructor( ) { }

  add3dLayer(map, option: LayerOption, coord, cb, onSelectedCb) {
    if (map.getLayer(option.name)) {
      map.removeLayer(option.name);
      window['tb'].clear(true);
      window['tb'].update()
    }
    // console.log(map);
    (window as any).tb = new Threebox(
      map,
      map.getCanvas().getContext('webgl'),
      {
        defaultLights: true,
        enableSelectingFeatures: true,
        enableSelectingObjects: true,
        enableDraggingObjects: true,
        enableRotatingObjects: true,
        enableTooltips: false,
        multiLayer: true
      });
      map.fire('load');
      map.addLayer({
        id: option.name,
        type: 'custom',
        renderingMode: '3d',
        onAdd: function(map, mbxContext) {
          let options = {
            obj: option.url,
            type: option.type,
            scale: 1,
            units: 'meters',
            rotation: { x: 90, y: 0, z: 0 },
            raycasted: true
          }

          if (window['tb'].selectedObject) {
            window['tb'].unselectObject()
          }


          window['tb'].loadObj(options, function(model) {
            model.setCoords([coord.lng, coord.lat]);
            model.addEventListener('SelectedChange', onSelectedCb, false);
            model.addEventListener('ObjectChanged', cb, false);

            window['tb'].add(model);
          });
        },
        render: function(gl, matrix) {
          window['tb'].update();
        }
      });
  }
}

