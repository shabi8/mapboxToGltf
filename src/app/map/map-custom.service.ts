import { Injectable } from '@angular/core';
import * as THREE from 'three';
import {GLTFExporter} from 'three/examples/jsm/exporters/GLTFExporter'

declare const Threebox: any;

@Injectable({
  providedIn: 'root'
})
export class MapCustomService {


  constructor( ) { }

  add3dBoxLayer(map, layerName: string, coord, dimensions: {x: number, y: number, z: number}, color, downloadGltf: boolean) {


    if (map.getLayer(layerName)) {
      map.removeLayer(layerName);
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
        enableTooltips: false
      }
    );
    map.fire('load');
    map.fire('style.load');
    map.addLayer({
      id: layerName,
      type: 'custom',
      renderingMode: '3d',
      onAdd: function(map, mbxContext) {
        console.log('custom layer now added')
        const geometry = new THREE.BoxGeometry(dimensions.x, dimensions.y, dimensions.z);
        let cube = new THREE.Mesh(geometry, new THREE.MeshStandardMaterial({ color: color}));
        cube = window['tb'].Object3D({ obj: cube, units: 'meters'});
        cube.setCoords([coord.lng, coord.lat]);
        window['tb'].add(cube);
        console.log(window['tb']);
        console.log(cube);

        if (downloadGltf) {
          const exporter = new GLTFExporter();
          exporter.parse(
            cube,
            (gltf) => {
              if (gltf instanceof ArrayBuffer) {
                saveArrayBuffer(gltf, 'object.glb')
              } else {
                const output = JSON.stringify(gltf, null, 2);
                saveString(output, 'object.gltf');
              }
            }
          )

          const link = document.createElement( 'a' );
          link.style.display = 'none';
          document.body.appendChild( link ); // Firefox workaround, see #6594

          function save( blob, filename ) {

            link.href = URL.createObjectURL( blob );
            link.download = filename;
            link.click();

          }

          function saveString( text, filename ) {

            save( new Blob( [ text ], { type: 'text/plain' } ), filename );

          }

          function saveArrayBuffer( buffer, filename ) {

            save( new Blob( [ buffer ], { type: 'application/octet-stream' } ), filename );

          }
        }

        


      },
      render: function(gl, matrix) {
        window['tb'].update();
      }
      });

      
  }

  

}

