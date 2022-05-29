import { Component, DoCheck, Input, KeyValueDiffer, KeyValueDiffers, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { Item3dListService } from '../services/item3d-list.service';
// import { Item3d } from 'src/app/map/map.component';
import { IItem3d, IMaterial, ITexture } from 'application-types';
import { FormArray, FormBuilder, Validators } from '@angular/forms';
import { Observable } from 'rxjs';



@Component({
  selector: 'app-item3d-reactive',
  templateUrl: './item3d-reactive.component.html',
  styleUrls: ['./item3d-reactive.component.css']
})
export class Item3dReactiveComponent implements OnInit, OnChanges, DoCheck {
  @Input()
  item: IItem3d;

  @Input()
  expand: boolean;

  differ: KeyValueDiffer<any, any>;


  texturesSelection = [
    {
      texturesName: 'road',
      textures: [
        {
        "type": "map",
        "path": "assets/textures/Road007_1K-JPG/Road007_1K_Color.ktx2"     
        },
        {
        "type": "displacementMap",
        "path": "assets/textures/Road007_1K-JPG/Road007_1K_Displacement.ktx2"     
        },
        {
        "type": "normalMap",
        "path": "assets/textures/Road007_1K-JPG/Road007_1K_NormalGL.ktx2"     
        },
        {
        "type": "roughnessMap",
        "path": "assets/textures/Road007_1K-JPG/Road007_1K_Roughness.ktx2"     
        }
      ]
    },
    {
      texturesName: 'office',
      textures: [
        {
            "type": "map",
            "path": "assets/textures/Facade014_1K-JPG/Facade014_1K_Color.ktx2"     
        },
        {
            "type": "displacementMap",
            "path": "assets/textures/Facade014_1K-JPG/Facade014_1K_Displacement.ktx2"     
        },
        {
            "type": "emmissiveMap",
            "path": "assets/textures/Facade014_1K-JPG/Facade014_1K_Emission.ktx2"     
        },
        {
            "type": "normalMap",
            "path": "assets/textures/Facade014_1K-JPG/Facade014_1K_NormalGL.ktx2"     
        },
        {
            "type": "roughnessMap",
            "path": "assets/textures/Facade014_1K-JPG/Facade014_1K_Roughness.ktx2"     
        }
      ]
    },
    {
      texturesName: 'Bricks-38',
      textures: [
        {
            "type": "map",
            "path": "assets/textures/Bricks038_1K-JPG/Bricks038_1K_Color.ktx2"     
        },
        {
            "type": "displacementMap",
            "path": "assets/textures/Bricks038_1K-JPG/Bricks038_1K_Displacement.ktx2"     
        },
        {
            "type": "aoMap",
            "path": "assets/textures/Bricks038_1K-JPG/Bricks038_1K_AmbientOcclusion.ktx2"     
        },
        {
            "type": "normalMap",
            "path": "assets/textures/Bricks038_1K-JPG/Bricks038_1K_NormalGL.ktx2"     
        },
        {
            "type": "roughnessMap",
            "path": "assets/textures/Bricks038_1K-JPG/Bricks038_1K_Roughness.ktx2"     
        }
      ]
    },
    {
      texturesName: 'rusty-metal',
      textures: [
        {
            "type": "map",
            "path": "assets/textures/rusty_metal/rusty_metal_02_diff_4k.ktx2"     
        },
        {
            "type": "displacementMap",
            "path": "assets/textures/rusty_metal/rusty_metal_02_disp_4k.png"     
        },
        {
            "type": "aoMap",
            "path": "assets/textures/rusty_metal/rusty_metal_02_ao_4k.ktx2"     
        },
        {
            "type": "normalMap",
            "path": "assets/textures/rusty_metal/rusty_metal_02_nor_gl_4k.ktx2"     
        },
        {
            "type": "roughnessMap",
            "path": "assets/textures/rusty_metal/rusty_metal_02_rough_4k.ktx2"     
        }
      ]
    },
  ]


  form = this.fb.group({
    dimensionsX: ['', [
      Validators.min(0),
      Validators.max(999)
    ]],
    segmentsX: ['', [
      Validators.min(1),
      Validators.max(999)
    ]],
    dimensionsY: ['', [
      Validators.min(0),
      Validators.max(999)
    ]],
    segmentsY: ['', [
      Validators.min(1),
      Validators.max(999)
    ]],
    dimensionsZ: ['', [
      Validators.min(0),
      Validators.max(999)
    ]],
    segmentsZ: ['', [
      Validators.min(1),
      Validators.max(999)
    ]],
    repeatX: ['', [
      Validators.min(1),
      Validators.max(999)
    ]],
    repeatY: ['', [
      Validators.min(0),
      Validators.max(999)
    ]],
    repeatZ: ['', [
      Validators.min(1),
      Validators.max(999)
    ]],
    polygonHeight: ['', [
      Validators.min(0.1),
      Validators.max(999),
    ]],
    materials: this.fb.array([]),
    scaleX: ['', [
      Validators.min(0.001),
      Validators.max(10),
    ]],
    scaleY: ['', [
      Validators.min(0.001),
      Validators.max(10),
    ]],
    scaleZ: ['', [
      Validators.min(0.001),
      Validators.max(10),
    ]]
  });

  selectedTexture;

  selectedTab;



  constructor(private item3dListService: Item3dListService, private fb: FormBuilder, private differService: KeyValueDiffers) { }

  ngOnInit(): void {
    this.inputItemForm(this.item);
    this.form.valueChanges.subscribe(val => {
      console.log('Value CHANGED', val)
      for (const [key, value] of Object.entries(val)) {
        if (value) {
          // console.log(value);
          switch (key) {
            case 'dimensionsX':
              console.log('gggg')
              this.item.dimensions.x = val.dimensionsX;
              break;
            case 'segmentsX':
              this.item.segments.x = val.segmentsX;
              break;
            case 'dimensionsY':
              this.item.dimensions.y = val.dimensionsY;
              break;
            case 'segmentsY':
              this.item.segments.y = val.segmentsY;
              break;
            case 'dimensionsZ':
              this.item.dimensions.z = val.dimensionsZ;
              break;
            case 'segmentsZ':
              this.item.segments.z = val.segmentsZ;
              break;
            case 'repeatX':
              this.item.textureNeedRepeat.x = val.repeatX;
              break;
            case 'repeatY':
              this.item.textureNeedRepeat.y = val.repeatY;
              break;
            case 'repeatZ':
              this.item.textureNeedRepeat.z = val.repeatZ;
              break;           
            case 'scaleX': 
              this.item.scale.x = val.scaleX;
              break;
            case 'scaleY': 
              this.item.scale.y = val.scaleY;
              break;
            case 'scaleZ': 
              this.item.scale.z = val.scaleZ;
              break;
            case 'polygonHeight':
              this.item.polygonExtrusionHeight = val.polygonHeight;
              break;
            case 'materials':
              this.item.materials = val.materials;
              break;
          }
        }
      }
      // console.log('UPDATED BY FORM', this.item);
      this.item3dListService.sendItem3dToEdit(this.item);
    });
    this.differ = this.differService.find(this.item).create();
  }

  ngOnChanges(changes: SimpleChanges): void {
      // console.log("INPUT CHANGE", changes)
  }

  ngDoCheck(): void {
    if (this.differ) {
      const changes = this.differ.diff(this.item);
      // console.log(changes, this.differ)
      if (changes) {
        changes.forEachChangedItem(r => {
          // console.log("CHANGE!!!")
          // console.log(r.key, r.currentValue)
          if (r.key === 'scale') {
            // console.log(r.key, r.currentValue)
            this.form.patchValue({
              scaleX: r.currentValue.x,
              scaleY: r.currentValue.y,
              scaleZ: r.currentValue.z
            })
          }
        })
        changes.forEachAddedItem( r => {
          // console.log("Added", r);
          if (r.key === 'scale') {
            // console.log(r.key, r.currentValue)
            // this.form.patchValue({
            //   scaleX: r.currentValue.x,
            //   scaleY: r.currentValue.y,
            //   scaleZ: r.currentValue.z
            // })
          }
        });
        changes.forEachRemovedItem( r => {
          // console.log("removed", r);
        })
      }
    }
      
  }


  inputItemForm(item: IItem3d) {
    // console.log('THISISITEM', item)
    this.form.patchValue({
      dimensionsX: item.dimensions?.x,
      segmentsX: item.segments?.x,
      dimensionsY: item.dimensions?.y,
      segmentsY: item.segments?.y,
      dimensionsZ: item.dimensions?.z,
      segmentsZ: item.segments?.z,
      repeatX: item.textureNeedRepeat?.x,
      repeatY: item.textureNeedRepeat?.y,
      repeatZ: item.textureNeedRepeat?.z,
      polygonHeight: item.polygonExtrusionHeight,
      scaleX: item.scale?.x,
      scaleY: item.scale?.y,
      scaleZ: item.scale?.z
    });
    if (item.materials){
      this.form.setControl('materials', this.setExistingsMaterials(item.materials))
    } 
  }

  setExistingsMaterials(materialsList: IMaterial[]): FormArray {
    const formArray = new FormArray([]);
    materialsList.forEach( m => {
      const materialFormGroup = this.fb.group({
        color: m.color,
        transparent: m.transparent,
        aoMapIntensity: m.aoMapIntensity,
        displacamentScale: m.displacamentScale,
        displacementBias: m.displacementBias,
        emissiveIntensity: m.emissiveIntensity,
        emissive: m.emissive,
        normalScaleX: m.normalScaleX,
        normalScaleY: m.normalScaleY,
        roughness: m.roughness,
        metalness: m.metalness,
        bumpScale: m.bumpScale,
        wireframe: m.wireframe,
        flipY: m.flipY
      });
      if (m.textures) {
        materialFormGroup.setControl('textures', this.setExistingTextures(m.textures))
      }
      formArray.push(materialFormGroup);
    });
    // console.log('AFTER PATCH',formArray)

    return formArray;
  }

  setExistingTextures(texturesLIst: ITexture[]): FormArray {
    const formArray = new FormArray([]);
    texturesLIst.forEach( t => {
      formArray.push(this.fb.group({
        type: t.type,
        path: t.path
      }));
    });

    return formArray
  }

  get materials() {
    return this.form.controls["materials"] as FormArray;
  }

  addMaterial() {
    const materialForm = this.fb.group({
      textures: this.fb.array([]),
      color: [''],
      transparent: [''],
      aoMapIntensity: ['', [
        Validators.min(0),
        Validators.max(2),
      ]],
      displacamentScale: ['', [
        Validators.min(0),
        Validators.max(2),
      ]],
      displacementBias: ['', [
        Validators.min(0),
        Validators.max(2),
      ]],
      emissiveIntensity: ['', [
        Validators.min(0),
        Validators.max(3),
      ]],
      emissive: [''],// color
      normalScaleX: ['', [
        Validators.min(0),
        Validators.max(1),
      ]],
      normalScaleY: ['', [
        Validators.min(0),
        Validators.max(1),
      ]], // vector2
      roughness: ['', [
        Validators.min(0),
        Validators.max(1),
      ]],
      metalness: ['', [
        Validators.min(0),
        Validators.max(1),
      ]],
      bumpScale: ['', [
        Validators.min(0),
        Validators.max(1),
      ]],
      wireframe: [''],
      flipY: ['']

    });

    this.materials.push(materialForm);
    this.selectedTab = this.materials.length - 1;
  }

  removeMaterial(index: number) {
    this.materials.removeAt(index);
  }

  addTexture(texturesFormArray: FormArray) {
    const texture = this.fb.group({
      type: [''],
      path: ['']
    });
    texturesFormArray.push(texture);
  }

  removeTexture(texturesFormArray: FormArray, index: number) {
    texturesFormArray.removeAt(index);
  }

  changeTexture(event, materialIndex) {
    console.log('Change IN Selection', event);
    this.item.materials[materialIndex].textures = event.value.textures;
    this.form.setControl('materials', this.setExistingsMaterials(this.item.materials))
    console.log(this.item)
    this.item3dListService.sendItem3dToEdit(this.item);
  }



  onChange(event) {
    this.item3dListService.sendItem3dToEdit(this.item);
  }

  itemToRemove() {
    this.item3dListService.sendItemToRemove(this.item);
  }

  itemToExport() {
    this.item3dListService.sendItemToExport(this.item);
  }

}
