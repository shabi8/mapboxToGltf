import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { LngLatLike, LngLat } from 'mapbox-gl';
import * as THREE from 'three';
import {GLTFExporter} from 'three/examples/jsm/exporters/GLTFExporter';
import { TransformControls } from 'three/examples/jsm/controls/TransformControls';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { KTX2Loader } from "three/examples/jsm/loaders/KTX2Loader.js";
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader';
// import { Item3d } from './map.component';
import { Item3dListService } from '../ui/services/item3d-list.service';
import { IItem3d, IMaterial, ITexture } from 'application-types';



declare const Threebox: any;

@Injectable({
  providedIn: 'root'
})
export class MapCustomService {

  private ktx2Loader: KTX2Loader;

  private textureCache = {};

  objectSelected;
  private _objectSelectedSource = new Subject<IItem3d>();
  objectSelected$ = this._objectSelectedSource.asObservable();

  tbOptions = {
    defaultLights: true,
    realSunlight: true,
    // realSunlightHelper: true,
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

  transformControl;

  constructor( private item3dListService: Item3dListService) { }

  add3dBoxLayer(map, item3d: IItem3d, downloadGltf: boolean, date) {

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

    if (item3d.itemType === 'tree') {
      map.addLayer(this.createLoadObjectCustomLayer(item3d, downloadGltf, date))
    } else if (item3d.itemType === 'polygon'){
      map.addLayer(this.createExtrudeShapeCustomLayer(item3d, downloadGltf, date))
    } else {
      console.log(window['tb'].memory());
      console.log(window['tb'].programs());
      console.log(window['tb'].renderer.info);

      map.addLayer(this.createCustomLayer(item3d, downloadGltf, date));
    }

    const layerAdded = map.getLayer(item3d.name);
    if (layerAdded) {
      console.log('Layer Added', window['tb'].memory());
      console.log('Layer Added', window['tb'].programs());
      console.log('Layer Added', window['tb'].renderer.info);
      this.item3dListService.sendItem3dAdded(item3d);
      return true;
    } else {
      false;
    }

  }

  remove3dBoxLayer(map, item3d: IItem3d) {
    if (map.getLayer(item3d.name)) {
      map.removeLayer(item3d.name);
      window['tb'].removeByName(item3d.name);
      window['tb'].clear(true);
      // window['tb'].update()
      this.item3dListService.sendItemWasRemoved(item3d);
    }
  }


  initThreeBox(map, options) {
    (window as any).tb = new Threebox(
      map,
      map.getCanvas().getContext('webgl'),
      options
    );
    console.log(window['tb']);
    // THREE.Cache.enabled = true;
  }


  sendObjectSelected(object3d: IItem3d) {
    // console.log('Sending item: ', object3d);
    this._objectSelectedSource.next(object3d);
  }
 

  createCustomLayer(item3d: IItem3d, downloadGltf, date) {
    return {
      id: item3d.name,
      type: 'custom',
      renderingMode: '3d',
      onAdd: (map, mbxContext) => {

          let xRepeat = 1, yRepeat = 1, zRepeat;
          if (item3d.textureNeedRepeat  && item3d.textureNeedRepeat.x > 0) {
            xRepeat = Math.ceil(item3d.dimensions.x / item3d.textureNeedRepeat.x)
          }

          if (item3d.textureNeedRepeat && item3d.textureNeedRepeat.y > 0) {
            yRepeat = Math.ceil(item3d.dimensions.y / item3d.textureNeedRepeat.y)
          }

          if (item3d.textureNeedRepeat && item3d.textureNeedRepeat.z > 0) {
            zRepeat = Math.ceil(item3d.dimensions.z / item3d.textureNeedRepeat.z);
            if (zRepeat > xRepeat) {
              yRepeat = zRepeat;
            }
          } 
          
          

          const repeatTexure = new THREE.Vector2(xRepeat, yRepeat);
          const textureLoader = new THREE.TextureLoader();

          this.ktx2Loader = new KTX2Loader();
          this.ktx2Loader.setTranscoderPath('assets/basis/');
          this.ktx2Loader.detectSupport( window['tb'].renderer );


          const geometry = new THREE.BoxGeometry(item3d.dimensions.x, item3d.dimensions.y, item3d.dimensions.z, item3d.segments.x, item3d.segments.y, item3d.segments.z);

          let materials = [];

          item3d.materials.forEach((mat, index) => {
            const material = new THREE.MeshStandardMaterial();
            // let flip = index == 0 || index == 1 ? false : true;
            this.setMaterial(this.ktx2Loader, mat, material, repeatTexure)
            materials.push(material)
          });

          if (materials.length === 1) {
            materials = materials[0];
          }

          // console.log("Materials list", materials)
          let cubeA = new THREE.Mesh(geometry, materials);
          let cube = window['tb'].Object3D({ obj: cubeA, units: 'meters'});
          

          if (item3d.scale) cube.setScale(item3d.scale);
          cube.castShadow = true;
          cube.receiveShadow = true;
          cube.name = item3d.name;

          if (this.objectSelected?.name === item3d.name) {
            map.selectedObject = cube;
            map.selectedObject.selected = true;
            map.selectedObject.dispatchEvent({ type: 'Wireframed', detail: map.selectedObject });
            map.selectedObject.dispatchEvent({ type: 'IsPlayingChanged', detail: map.selectedObject });

            map.repaint = true;
          }

          // map.selectedObject = cube;
          // map.selectedObject.selected = true;
          // map.selectedObject.dispatchEvent({ type: 'Wireframed', detail: map.selectedObject });
					// map.selectedObject.dispatchEvent({ type: 'IsPlayingChanged', detail: map.selectedObject });

					// map.repaint = true;

          console.log("ITEM3D", item3d);
          console.log(map)
          // cube.addEventListener('ObjectChanged', (e) => {
          //   console.log('ObjectChange', e);
          // }, false)
          cube.addEventListener('ObjectDragged', (e) => {
            this.onObjectDragged(e, item3d);
          }, false)
          cube.addEventListener('SelectedChange', (e) => {
            let selectedObject = e.detail;
            let selectedValue = selectedObject.selected;
            let spaceDown = false;
            console.log("Selected Object", selectedObject);
            console.log("Selected value", selectedValue)
            // item3d.selected = selectedValue;
            
            // let transform;
            if (selectedValue || this.objectSelected.selected === true) {
              this.objectSelected = selectedObject;
              this.transformControl = new TransformControls(window['tb'].camera, map.getCanvasContainer());

              this.transformControl.setMode('scale');
              this.transformControl.setSize(0.5)
              this.transformControl.addEventListener('dragging-changed', (e) => {
                // console.log(e);
                // console.log('dragging-changed')
                // console.log(this.transformControl);
                // console.log("scale:", this.transformControl.object.scale);
                // item3d.scale = this.transformControl.object.scale;
                // console.log("scale:", item3d.scale);
                // this.item3dListService.sendItem3dChanged(item3d);
              });
              this.transformControl.addEventListener('change', (e) => {
                let trScale = this.transformControl.object.scale ? this.transformControl.object.scale : item3d.scale;
                item3d.scale = new THREE.Vector3(trScale.x, trScale.y, trScale.z);
                // console.log("scale:", this.transformControl.object.scale);
                this.item3dListService.sendItem3dChanged(item3d);

                map.triggerRepaint();
              });
              window['tb'].scene.add(this.transformControl);

              document.body.onkeydown = (ev) => {
                // console.log(spaceDown)
                if ((ev.key == " " || ev.code == "Space") && !spaceDown) {
                  console.log('YYYY')
                  spaceDown = !spaceDown
                  map.dragPan.disable();
                  // map.dragRotate.disable();
                  this.transformControl.attach(cube);
                  map.triggerRepaint();
                } else if ((ev.key == " " || ev.code == "Space") && spaceDown) {
                  spaceDown = !spaceDown
                  map.dragPan.enable();
                  // map.dragRotate.disable();
                  this.transformControl.detach(cube);
                  map.triggerRepaint();
                }
              }
            } else if (!selectedValue) {
              console.log("WWW")
              spaceDown = false
              this.transformControl.detach(cubeA);
              map.dragPan.enable();
              this.transformControl.dispose();
              map.triggerRepaint();
            }
            
            this.onObjectSelected(e, item3d);

          }, false)
          cube.setCoords([item3d.coordinates['lng'], item3d.coordinates['lat']]);
          window['tb'].add(cube);
          window['tb'].lights.dirLight.target = cube;
          console.log("CUBE" , cube)


          if (downloadGltf) {
            this.downloadAsGltf(cube);
          }
       

      },
      render: function(gl, matrix) {

      }
    }
  }


  createLoadObjectCustomLayer(item3d: IItem3d, downloadGltf, date) {
    return {
      id: item3d.name,
      type: 'custom',
      renderingMode: '3d',
      onAdd: (map, mbxContext) => {
        const dracoLoader = new DRACOLoader();
        dracoLoader.setDecoderPath('assets/draco/');

        const ktx2Loader = new KTX2Loader();
        ktx2Loader.setTranscoderPath('assets/basis/');
        ktx2Loader.detectSupport( window['tb'].renderer );

        const options = {
          obj: item3d.modelPath,
          type: 'gltf',
          scale: item3d.scale,
          units: 'meters',
          rotation: { x: 90, y: 0, z: 0 },
          clone: false,
          draco: dracoLoader,
          ktx2: ktx2Loader
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
      
      }
    }
  }


  createExtrudeShapeCustomLayer(item3d: IItem3d, downloadGltf, date) {
    return {
      id: item3d.name,
      type: 'custom',
      renderingMode: '3d',
      onAdd: (map, mbxContext) => {
        

          const textureLoader = new THREE.TextureLoader();

          this.ktx2Loader = new KTX2Loader();
          this.ktx2Loader.setTranscoderPath('assets/basis/');
          this.ktx2Loader.detectSupport( window['tb'].renderer );

          let xRepeat = 1, yRepeat = 1;
          if (item3d.textureNeedRepeat  && item3d.textureNeedRepeat.x > 0) {
            xRepeat = Math.ceil(item3d.polygonExtrusionHeight / item3d.textureNeedRepeat.x)
          }

          if (item3d.textureNeedRepeat && item3d.textureNeedRepeat.y > 0) {
            yRepeat = Math.ceil(item3d.polygonExtrusionHeight / item3d.textureNeedRepeat.y)
          }
          
          const repeatTexure = new THREE.Vector2(xRepeat, yRepeat)
          const material = new THREE.MeshStandardMaterial();
          this.setMaterial(this.ktx2Loader, item3d.materials[0], material, repeatTexure)

          material.needsUpdate = true;
          let center = [item3d.coordinates['lng'], item3d.coordinates['lat']];
          let s = window['tb'].projectedUnitsPerMeter(center[1]);
  

          let extrusion = window['tb'].extrusion({
            coordinates: item3d.polygon,
            geometryOptions: { curveSegments: 1, bevelEnabled: false, depth: item3d.polygonExtrusionHeight * s },
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


      },
      render: function(gl, matrix) {

      }
    }
  }

  onObjectSelected(e, obj: IItem3d) {
    let objectCoord = e.detail.coordinates.slice(0, 2);
    obj.coordinates = new LngLat(objectCoord[0], objectCoord[1]);
    this.sendObjectSelected(obj);
  }

  onObjectDragged(e, obj: IItem3d) {
    console.log('Dragged ',e);
    console.log('Obj dragged', obj)
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
          saveArrayBuffer(gltf, `${obj.name}.glb`)
        } else {
          const output = JSON.stringify(gltf, null, 2);
          saveString(output, `${obj.name}.gltf`);
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


  loadAlltextures(loader: THREE.TextureLoader | KTX2Loader, textures: Array<ITexture>, material, repeatTexure, flipY) {
    console.log(textures);
    textures.forEach((txture, index) => {
      // console.log(txture)
      let texture;
      if (txture.path in this.textureCache) {
        // console.log("Cache ", this.textureCache)
        texture = this.textureCache[txture.path];
      } else {
        texture = loader.load(txture.path);
        this.textureCache[txture.path] = texture;
      }
      
      // console.log(texture);
      
      texture.repeat = repeatTexure;
      // texture.repeat.y = 3;
      texture.wrapS = THREE.RepeatWrapping;
      texture.wrapT = THREE.RepeatWrapping;

      if (flipY) {
        // texture.flipY = flipY;
        texture.rotation = Math.PI / 2;
      }
      material[txture.type] = texture;
      // console.log(material);
    });
  }

  setMaterial(loader, materialConfig: IMaterial, material, repeatTexure) {
    console.log(THREE.Cache)
    for (const [key, value] of Object.entries(materialConfig)) {
      if (key === 'textures') {
        this.loadAlltextures(loader, materialConfig.textures, material, repeatTexure, materialConfig.flipY)
      } else if (key === 'color' || key === 'emissive') {
        const color = new THREE.Color(value);
        material[key] = color;
      } else if (key === 'normalScale'){
        const normalScale = new THREE.Vector2(value[0], value[1]);
        material[key] = normalScale;
      }else {
        material[key] = value;
      }
    }
  }

  

}

