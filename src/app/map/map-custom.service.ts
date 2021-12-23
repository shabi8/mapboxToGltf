import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { LngLatLike, LngLat } from 'mapbox-gl';
import * as THREE from 'three';
import {GLTFExporter} from 'three/examples/jsm/exporters/GLTFExporter';
import  { Item3d }  from './map.component';
import { MatOptgroup } from '@angular/material/core';

declare const Threebox: any;

@Injectable({
  providedIn: 'root'
})
export class MapCustomService {

  objectSelected;
  private _objectSelectedSource = new Subject<Item3d>();
  objectSelected$ = this._objectSelectedSource.asObservable();

  tbOptions = {
    defaultLights: true,
    realSunlight: true,
    realSunlightHelper: true,
    sky: true,
    // terrain: true,
    enableSelectingFeatures: true,
    enableSelectingObjects: true,
    enableDraggingObjects: true,
    enableRotatingObjects: true,
    enableTooltips: false,
    multiLayer: true
  }

  threeBox;

  constructor( ) { }

  add3dBoxLayer(map, item3d: Item3d, downloadGltf: boolean) {


    if (map.getLayer(item3d.name)) {
      map.removeLayer(item3d.name);
      window['tb'].removeByName(item3d.name);
      window['tb'].clear(true);
      // window['tb'].update()
    }

    if (!this.threeBox) {
      this.initThreeBox(map, this.tbOptions);
      map.fire('load');
      map.fire('style.load');
      this.threeBox = true;
    }

    if (item3d.type === 'tree') {
      map.addLayer(this.createLoadObjectCustomLayer(item3d.name, item3d.coordinates, item3d.parameters.modelPath, downloadGltf))
    } else if (!item3d.parameters.texture) {
      map.addLayer(this.createCustomLayer(item3d.name, item3d.coordinates, item3d.parameters.dimensions, item3d.parameters.color, downloadGltf));
    } else {
      map.addLayer(this.createLoadTextureCustomLayer(item3d.name, item3d.coordinates, item3d.parameters.dimensions, item3d.parameters.color, item3d.parameters.texture, downloadGltf));
    }


      
  }

  createCustomLayerFirstDraft(layerName, coord, dimensions, color, texturePath, downloadGltf) {
    return {
      id: layerName,
      type: 'custom',
      renderingMode: '3d',
      onAdd: (map, mbxContext) => {
        console.log('custom layer now added')
        const textureLoader = new THREE.TextureLoader();
        textureLoader.load(texturePath , (texture) => {
          const geometry = new THREE.BoxGeometry(dimensions.x, dimensions.y, dimensions.z);
          const material = new THREE.MeshStandardMaterial({ map: texture });
          material.needsUpdate = true;
          let cube = new THREE.Mesh(geometry, material);
          cube = window['tb'].Object3D({ obj: cube, units: 'meters'});
          
          cube.castShadow = true;
          cube.name = layerName

          cube.addEventListener('ObjectChanged', (e) => {
            console.log('ObjectChange', e);
          }, false)
          cube.addEventListener('ObjectDragged', (e) => {
            console.log('Dragged', e);
          }, false)
          cube.addEventListener('SelectedChange', (e) => {
            console.log('Selected', e);
            const objectName = e.detail.name;
            const objectCoord = e.detail.coordinates.slice(0, 2);
            const object = {
              name: objectName,
              coordinates: new LngLat(objectCoord[0], objectCoord[1]),
              parameters: {color: color, texture: texturePath, dimensions: dimensions}
            }
            console.log(object, objectCoord);
            this.sendObjectSelected(object);
          }, false)
          cube.setCoords([coord.lng, coord.lat]);
          window['tb'].add(cube);
          window['tb'].lights.dirLight.target = cube;
          // window['tb'].setSunlight(new Date(), coord)
          console.log(window['tb'].getSunPosition(new Date(), coord))
          console.log(window['tb'].getSunSky(new Date()))


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
          }

        

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
        });
      },
      render: function(gl, matrix) {
        // window['tb'].update();
        // window['tb'].setSunlight(new Date(), coord)
      }
      }
  }


  initThreeBox(map, options) {
    (window as any).tb = new Threebox(
      map,
      map.getCanvas().getContext('webgl'),
      options
    );
  }


  sendObjectSelected(object3d: Item3d) {
    this._objectSelectedSource.next(object3d);
  }


  createCustomLayer(layerName, coord, dimensions, color, downloadGltf) {
    return {
      id: layerName,
      type: 'custom',
      renderingMode: '3d',
      onAdd: (map, mbxContext) => {
        const geometry = new THREE.BoxGeometry(dimensions.x, dimensions.y, dimensions.z);
        const material = new THREE.MeshStandardMaterial({ color: color });

        let cube = new THREE.Mesh(geometry, material);
        cube = window['tb'].Object3D({ obj: cube, units: 'meters'});
        
        cube.castShadow = true;
        cube.name = layerName
        cube.addEventListener('ObjectChanged', (e) => {
          console.log('ObjectChange', e);
        }, false)
        cube.addEventListener('ObjectDragged', (e) => {
          console.log('Dragged', e);
        }, false)
        cube.addEventListener('SelectedChange', (e) => {
          console.log('Selected', e);
          const objectName = e.detail.name;
          const objectCoord = e.detail.coordinates.slice(0, 2);
          const object = {
            name: objectName,
            coordinates: new LngLat(objectCoord[0], objectCoord[1]),
            parameters: {color: color, dimensions: dimensions}
          }
          console.log(object, objectCoord);
          this.sendObjectSelected(object);
        }, false)
        cube.setCoords([coord.lng, coord.lat]);
        window['tb'].add(cube);
        window['tb'].lights.dirLight.target = cube;


        if (downloadGltf) {
          this.downloadAsGltf(cube);
        }

      },
      render: function(gl, matrix) {
      }
    }
  }


  createLoadTextureCustomLayer(layerName, coord, dimensions, color, texturePath, downloadGltf) {
    return {
      id: layerName,
      type: 'custom',
      renderingMode: '3d',
      onAdd: (map, mbxContext) => {
        console.log('custom layer now added')
        const textureLoader = new THREE.TextureLoader();
        textureLoader.load(texturePath , (texture) => {
          const geometry = new THREE.BoxGeometry(dimensions.x, dimensions.y, dimensions.z);
          const material = new THREE.MeshStandardMaterial({ map: texture });
          material.needsUpdate = true;
          let cube = new THREE.Mesh(geometry, material);
          cube = window['tb'].Object3D({ obj: cube, units: 'meters'});
          
          cube.castShadow = true;
          cube.name = layerName
          cube.addEventListener('ObjectChanged', (e) => {
            console.log('ObjectChange', e);
          }, false)
          cube.addEventListener('ObjectDragged', (e) => {
            console.log('Dragged', e);
          }, false)
          cube.addEventListener('SelectedChange', (e) => {
            console.log('Selected', e);
            const objectName = e.detail.name;
            const objectCoord = e.detail.coordinates.slice(0, 2);
            const object = {
              name: objectName,
              coordinates: new LngLat(objectCoord[0], objectCoord[1]),
              parameters: {color: color, texture: texturePath, dimensions: dimensions}
            }
            console.log(object, objectCoord);
            this.sendObjectSelected(object);
          }, false)
          cube.setCoords([coord.lng, coord.lat]);
          window['tb'].add(cube);
          window['tb'].lights.dirLight.target = cube;


          if (downloadGltf) {
            this.downloadAsGltf(cube);
          }

        });
      },
      render: function(gl, matrix) {
      }
    }
  }

  createRoadCustomLayer(layerName, coord, dimensions, color, texturePath, downloadGltf) {
    return {
      id: layerName,
      type: 'custom',
      renderingMode: '3d',
      onAdd: (map, mbxContext) => {
        console.log('custom layer now added')
        const textureLoader = new THREE.TextureLoader();
        textureLoader.load(texturePath , (texture) => {
          const geometry = new THREE.PlaneGeometry(7, 10);
          const material = new THREE.MeshStandardMaterial({ map: texture });
          material.needsUpdate = true;
          let cube = new THREE.Mesh(geometry, material);
          cube = window['tb'].Object3D({ obj: cube, units: 'meters'});
          
          cube.castShadow = true;
          cube.name = layerName
          cube.addEventListener('ObjectChanged', (e) => {
            console.log('ObjectChange', e);
          }, false)
          cube.addEventListener('ObjectDragged', (e) => {
            console.log('Dragged', e);
          }, false)
          cube.addEventListener('SelectedChange', (e) => {
            console.log('Selected', e);
            const objectName = e.detail.name;
            const objectCoord = e.detail.coordinates.slice(0, 2);
            const object = {
              name: objectName,
              coordinates: new LngLat(objectCoord[0], objectCoord[1]),
              parameters: {color: color, texture: texturePath, dimensions: dimensions}
            }
            console.log(object, objectCoord);
            this.sendObjectSelected(object);
          }, false)
          cube.setCoords([coord.lng, coord.lat]);
          window['tb'].add(cube);
          window['tb'].lights.dirLight.target = cube;


          if (downloadGltf) {
            this.downloadAsGltf(cube);
          }

        });
      },
      render: function(gl, matrix) {
      }
    }
  }

  createLoadObjectCustomLayer(layerName, coord, objPath, downloadGltf) {
    return {
      id: layerName,
      type: 'custom',
      renderingMode: '3d',
      onAdd: (map, mbxContext) => {
        const options = {
          obj: objPath,
          type: 'gltf',
          scale: 1,
          units: 'meters',
          rotation: { x: 90, y: 0, z: 0 }
        }


        window['tb'].loadObj(options, (model) => {
          let loadedItem = model.setCoords([coord.lng, coord.lat]);
          loadedItem.castShadow = true;
          loadedItem.name = layerName
          loadedItem.addEventListener('ObjectChanged', (e) => {
            console.log('ObjectChange', e);
          }, false)
          loadedItem.addEventListener('ObjectDragged', (e) => {
            console.log('Dragged', e);
          }, false)
          loadedItem.addEventListener('SelectedChange', (e) => {
            console.log('Selected', e);
            const objectName = e.detail.name;
            const objectCoord = e.detail.coordinates.slice(0, 2);
            const object = {
              name: objectName,
              coordinates: new LngLat(objectCoord[0], objectCoord[1]),
            }
            console.log(object, objectCoord);
            // this.sendObjectSelected(object);
          }, false)
          window['tb'].add(loadedItem);

          if (downloadGltf) {
            this.downloadAsGltf(loadedItem);
          }

        })

      },
      render: function(gl, matrix) {
      }
    }
  }




  downloadAsGltf(obj) {
    const exporter = new GLTFExporter();
    exporter.parse(
      obj,
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
    document.body.appendChild( link );

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

  

}

