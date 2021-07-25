import { Injectable } from '@angular/core';
import { LayerOption } from 'application-types';

declare const Threebox: any;

@Injectable({
  providedIn: 'root'
})
export class MapCustomService {

  constructor( ) { }

  add3dLayer(map, option: LayerOption, coord) {
    if (map.getLayer(option.name)) {
      map.removeLayer(option.name);
    }
    console.log(map);
    (window as any).tb = new Threebox(
      map,
      map.getCanvas().getContext('webgl'),
      {
        defaultLights: true,
        enableSelectingFeatures: true,
        enableSelectingObjects: true,
        enableDraggingObjects: true,
        enableTooltips: true,
        multiLayer: true }
      );
      map.addLayer({
        id: option.name,
        type: 'custom',
        renderingMode: '3d',
        onAdd: function(map, mbxContext) {
          console.log(window['tb'].enableSelectingObjects)
          let options = {
            obj: option.url,
            type: option.type,
            scale: 1,
            units: 'meters',
            rotation: { x: 90, y: 0, z: 0 }, //default rotation
            raycasted: true,
            tooltip: true,
            bbox: true
          }


          window['tb'].loadObj(options, function(model) {
            model.setCoords([coord.lng, coord.lat]);
            model.addEventListener('SelectedChange', onSelectedChange, false)
            model.addEventListener('ObjectDragged', onDraggedObject, false);
            model.addEventListener('ObjectMouseOver', onObjectMouseOver, false)

            model.addTooltip("Hi");

            window['tb'].add(model);
          })
        },
        render: function(gl, matrix) {
          window['tb'].update();
        }
      });
  }
}

const onDraggedObject = ( e ) => {
  let draggedObject = e.detail.draggedObject; // the object dragged
	let draggedAction = e.detail.draggedAction; // the action during dragging
}

const onObjectMouseOver = ( e ) => {
  console.log('The mouse is over me')
}

const onSelectedChange = ( e ) => {
  let selectedObject = e.detail; //we get the object selected/unselected
	let selectedValue = selectedObject.selected; //we get if the object is selected after the event
}
