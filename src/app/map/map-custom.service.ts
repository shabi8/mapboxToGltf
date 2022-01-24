import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { LngLatLike, LngLat } from 'mapbox-gl';
import * as THREE from 'three';
import {GLTFExporter} from 'three/examples/jsm/exporters/GLTFExporter';
import { Item3d } from './map.component';
import { Item3dListService } from '../ui/services/item3d-list.service';





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
  };

  threeBox;

  constructor( private item3dListService: Item3dListService) { }

  add3dBoxLayer(map, item3d: Item3d, downloadGltf: boolean, date) {

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
      map.addLayer(this.createLoadObjectCustomLayer(item3d, downloadGltf, date))
    } else if (item3d.type === 'polygon'){
      map.addLayer(this.createExtrudeShapeCustomLayer(item3d, downloadGltf, date))
    } else {
      map.addLayer(this.createCustomLayer(item3d, downloadGltf, date));
    }

    const layerAdded = map.getLayer(item3d.name);
    if (layerAdded) {
      this.item3dListService.sendItem3dAdded(item3d);
      return true;
    } else {
      false;
    }

  }

  remove3dBoxLayer(map, item3d: Item3d) {
    if (map.getLayer(item3d.name)) {
      map.removeLayer(item3d.name);
      window['tb'].removeByName(item3d.name);
      window['tb'].clear(true);
      // window['tb'].update()
      this.item3dListService.sendItemWasRemoved(item3d);
    }
  }

  // createCustomLayerFirstDraft(layerName, coord, dimensions, color, texturePath, downloadGltf) {
  //   return {
  //     id: layerName,
  //     type: 'custom',
  //     renderingMode: '3d',
  //     onAdd: (map, mbxContext) => {
  //       console.log('custom layer now added')
  //       const textureLoader = new THREE.TextureLoader();
  //       textureLoader.load(texturePath , (texture) => {
  //         const geometry = new THREE.BoxGeometry(dimensions.x, dimensions.y, dimensions.z);
  //         const material = new THREE.MeshStandardMaterial({ map: texture });
  //         material.needsUpdate = true;
  //         let cube = new THREE.Mesh(geometry, material);
  //         cube = window['tb'].Object3D({ obj: cube, units: 'meters'});
          
  //         cube.castShadow = true;
  //         cube.name = layerName

  //         cube.addEventListener('ObjectChanged', (e) => {
  //           console.log('ObjectChange', e);
  //         }, false)
  //         cube.addEventListener('ObjectDragged', (e) => {
  //           console.log('Dragged', e);
  //         }, false)
  //         cube.addEventListener('SelectedChange', (e) => {
  //           console.log('Selected', e);
  //           const objectName = e.detail.name;
  //           const objectCoord = e.detail.coordinates.slice(0, 2);
  //           const object = {
  //             name: objectName,
  //             coordinates: new LngLat(objectCoord[0], objectCoord[1]),
  //             parameters: {color: color, texture: texturePath, dimensions: dimensions}
  //           }
  //           console.log(object, objectCoord);
  //           this.sendObjectSelected(object);
  //         }, false)
  //         cube.setCoords([coord.lng, coord.lat]);
  //         window['tb'].add(cube);
  //         window['tb'].lights.dirLight.target = cube;
  //         // window['tb'].setSunlight(new Date(), coord)
  //         console.log(window['tb'].getSunPosition(new Date(), coord))
  //         console.log(window['tb'].getSunSky(new Date()))


  //         if (downloadGltf) {
  //           const exporter = new GLTFExporter();
  //           exporter.parse(
  //             cube,
  //             (gltf) => {
  //               if (gltf instanceof ArrayBuffer) {
  //                 saveArrayBuffer(gltf, 'object.glb')
  //               } else {
  //                 const output = JSON.stringify(gltf, null, 2);
  //                 saveString(output, 'object.gltf');
  //               }
  //             }
  //           )
  //         }

        

  //         const link = document.createElement( 'a' );
  //         link.style.display = 'none';
  //         document.body.appendChild( link ); // Firefox workaround, see #6594

  //         function save( blob, filename ) {

  //           link.href = URL.createObjectURL( blob );
  //           link.download = filename;
  //           link.click();

  //         }

  //         function saveString( text, filename ) {

  //           save( new Blob( [ text ], { type: 'text/plain' } ), filename );

  //         }

  //         function saveArrayBuffer( buffer, filename ) {

  //           save( new Blob( [ buffer ], { type: 'application/octet-stream' } ), filename );

  //         }
  //       });
  //     },
  //     render: function(gl, matrix) {
  //       // window['tb'].update();
  //       // window['tb'].setSunlight(new Date(), coord)
  //     }
  //     }
  // }


  initThreeBox(map, options) {
    (window as any).tb = new Threebox(
      map,
      map.getCanvas().getContext('webgl'),
      options
    );
  }


  sendObjectSelected(object3d: Item3d) {
    // console.log('Sending item: ', object3d);
    this._objectSelectedSource.next(object3d);
  }


  createCustomLayer(item3d: Item3d, downloadGltf, date) {
    return {
      id: item3d.name,
      type: 'custom',
      renderingMode: '3d',
      onAdd: (map, mbxContext) => {

        if (item3d.parameters.texture) {
          const textureLoader = new THREE.TextureLoader();
          textureLoader.load(item3d.parameters.texture , (texture) => {
            const geometry = new THREE.BoxGeometry(item3d.parameters.dimensions.x, item3d.parameters.dimensions.y, item3d.parameters.dimensions.z);
            const material = new THREE.MeshStandardMaterial({ map: texture });
            material.needsUpdate = true;
            let cube = new THREE.Mesh(geometry, material);
            cube = window['tb'].Object3D({ obj: cube, units: 'meters'});
            
            cube.castShadow = true;
            cube.name = item3d.name
            // cube.addEventListener('ObjectChanged', (e) => {
            //   console.log('ObjectChange', e);
            // }, false)
            cube.addEventListener('ObjectDragged', (e) => {
              this.onObjectDragged(e, item3d);
            }, false)
            cube.addEventListener('SelectedChange', (e) => {
              this.onObjectSelected(e, item3d);

            }, false)
            cube.setCoords([item3d.coordinates['lng'], item3d.coordinates['lat']]);
            window['tb'].add(cube);
            window['tb'].lights.dirLight.target = cube;


            if (downloadGltf) {
              this.downloadAsGltf(cube);
            }

          });
        } else {
          const geometry = new THREE.BoxGeometry(item3d.parameters.dimensions.x, item3d.parameters.dimensions.y, item3d.parameters.dimensions.z);
          const material = new THREE.MeshStandardMaterial({ color: item3d.parameters.color });

          let cube = new THREE.Mesh(geometry, material);
          cube = window['tb'].Object3D({ obj: cube, units: 'meters'});
          
          cube.castShadow = true;
          cube.name = item3d.name
          // cube.addEventListener('ObjectChanged', (e) => {
          //   console.log('ObjectChange', e);
          // }, false)
          cube.addEventListener('ObjectDragged', (e) => {
            this.onObjectDragged(e, item3d);
          }, false)
          cube.addEventListener('SelectedChange', (e) => {
            this.onObjectSelected(e, item3d);
          }, false)
          cube.setCoords([item3d.coordinates['lng'], item3d.coordinates['lat']]);
          window['tb'].add(cube);
          window['tb'].lights.dirLight.target = cube;


          if (downloadGltf) {
            this.downloadAsGltf(cube);
          }
        }
        

      },
      render: function(gl, matrix) {
        // window['tb'].setSunlight(date, item3d.coordinates);
        // window['tb'].update();
      }
    }
  }


  createLoadObjectCustomLayer(item3d: Item3d, downloadGltf, date) {
    return {
      id: item3d.name,
      type: 'custom',
      renderingMode: '3d',
      onAdd: (map, mbxContext) => {
        const options = {
          obj: item3d.parameters.modelPath,
          type: 'gltf',
          scale: item3d.parameters.scale,
          units: 'meters',
          rotation: { x: 90, y: 0, z: 0 }
        }


        window['tb'].loadObj(options, (model) => {
          let loadedItem = model.setCoords([item3d.coordinates['lng'], item3d.coordinates['lat']]);
          loadedItem.castShadow = true;
          loadedItem.name = item3d.name
          // loadedItem.addEventListener('ObjectChanged', (e) => {
          //   console.log('ObjectChange', e);
          // }, false)
          loadedItem.addEventListener('ObjectDragged', (e) => {
            this.onObjectDragged(e, item3d);
          }, false)
          loadedItem.addEventListener('SelectedChange', (e) => {
            this.onObjectSelected(e, item3d);
          }, false)
          window['tb'].add(loadedItem);

          if (downloadGltf) {
            this.downloadAsGltf(loadedItem);
          }

        })

      },
      render: function(gl, matrix) {
        // window['tb'].setSunlight(date, item3d.coordinates);
        // window['tb'].update();       
      }
    }
  }


  createExtrudeShapeCustomLayer(item3d: Item3d, downloadGltf, date) {
    return {
      id: item3d.name,
      type: 'custom',
      renderingMode: '3d',
      onAdd: (map, mbxContext) => {

        if (item3d.parameters.texture) {
          const textureLoader = new THREE.TextureLoader();
          textureLoader.load(item3d.parameters.texture, (texture) => {

            const material = new THREE.MeshStandardMaterial({ map: texture, color: item3d.parameters.color });
            material.needsUpdate = true;
            let center = [item3d.coordinates['lng'], item3d.coordinates['lat']];
            let s = window['tb'].projectedUnitsPerMeter(center[1]);
   

            let extrusion = window['tb'].extrusion({
              coordinates: item3d.polygon,
              geometryOptions: { curveSegments: 1, bevelEnabled: false, depth: 30.5 * s },
              anchor: 'center',
              materials: material
            });
            // extrusion.addTooltip(b.properties.tooltip, true);
            extrusion.setCoords([center[0], center[1], 0]);
            extrusion.castShadow = true;

            window['tb'].add(extrusion);

            
            extrusion.name = item3d.name;
            // extrusion.addEventListener('ObjectChanged', (e) => {
            //   console.log('ObjectChange', e);
            // }, false)
            extrusion.addEventListener('ObjectDragged', (e) => {
              this.onObjectDragged(e, item3d);
            }, false)
            extrusion.addEventListener('SelectedChange', (e) => {
              this.onObjectSelected(e, item3d);
            }, false)

      
            window['tb'].lights.dirLight.target = extrusion;


            if (downloadGltf) {
              this.downloadAsGltf(extrusion);
            }

          });
        } else {
          let center = [item3d.coordinates['lng'], item3d.coordinates['lat']];
          let s = window['tb'].projectedUnitsPerMeter(center[1]);
          console.log(center);
          console.log(s)
          const redMaterial = new THREE.MeshStandardMaterial({ color: item3d.parameters.color });

          let extrusion = window['tb'].extrusion({
            coordinates: item3d.polygon,
            geometryOptions: { curveSegments: 1, bevelEnabled: false, depth: 30.5 * s },
            anchor: 'center',
            materials: redMaterial
          });
          // extrusion.addTooltip(b.properties.tooltip, true);
          extrusion.setCoords([center[0], center[1], 0]);
          window['tb'].add(extrusion);

          extrusion.name = item3d.name;
          // extrusion.addEventListener('ObjectChanged', (e) => {
          //   console.log('ObjectChange', e);
          // }, false)
          extrusion.addEventListener('ObjectDragged', (e) => {
            this.onObjectDragged(e, item3d);
          }, false)
          extrusion.addEventListener('SelectedChange', (e) => {
            this.onObjectSelected(e, item3d);
          }, false)

    
          window['tb'].lights.dirLight.target = extrusion;


          if (downloadGltf) {
            this.downloadAsGltf(extrusion);
          }
        }

      },
      render: function(gl, matrix) {
        // window['tb'].setSunlight(date, item3d.coordinates);
        // window['tb'].update();
      }
    }
  }

  onObjectSelected(e, obj: Item3d) {
    let objectCoord = e.detail.coordinates.slice(0, 2);
    obj.coordinates = new LngLat(objectCoord[0], objectCoord[1]);
    this.sendObjectSelected(obj);
  }

  onObjectDragged(e, obj: Item3d) {
    console.log('Dragged ',e);
    let objectCoord = e.detail.draggedObject.coordinates.slice(0, 2);
    obj.coordinates = new LngLat(objectCoord[0], objectCoord[1]);
    this.item3dListService.sendItem3dChanged(obj);
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

