import { Component, Input, OnInit } from '@angular/core';
import { Item3dListService } from '../services/item3d-list.service';
import { Item3d } from 'src/app/map/map.component';
import { IItem3d, IMaterial, ITexture } from 'application-types';
import { FormArray, FormBuilder, Validators } from '@angular/forms';
import { Observable } from 'rxjs';


// interface TextureSelection {
//   value: string,
//   viewValue: string
// }

@Component({
  selector: 'app-item3d-reactive',
  templateUrl: './item3d-reactive.component.html',
  styleUrls: ['./item3d-reactive.component.css']
})
export class Item3dReactiveComponent implements OnInit {
  @Input()
  item: IItem3d;

  @Input()
  expand: boolean;

  textures: any[] = [
    {value: 'assets/textures/Bricks038_1K-JPG/Bricks038_1K_Color.jpg', viewValue: 'Bricks'},
    {value: 'assets/textures/Road007_1K-JPG/Road007_1K_Color.jpg', viewValue: 'Road'},
    {value: 'assets/textures/JerusalemStone/Bricks075A_1K_Color.jpg', viewValue: 'Stone'},
    {value: 'assets/textures/Facade014_1K-JPG/Facade014_1K_Color.jpg', viewValue: 'Office'},
  ];

  // texturesSelection$: Observable<TextureSelection[]>;

  texturesSelection = [
    {
      texturesName: 'road',
      textures: [
        {
        "type": "map",
        "path": "assets/textures/Road007_1K-JPG/Road007_1K_Color.jpg"     
        },
        {
        "type": "displacementMap",
        "path": "assets/textures/Road007_1K-JPG/Road007_1K_Displacement.jpg"     
        },
        {
        "type": "normalMap",
        "path": "assets/textures/Road007_1K-JPG/Road007_1K_NormalGL.jpg"     
        },
        {
        "type": "roughnessMap",
        "path": "assets/textures/Road007_1K-JPG/Road007_1K_Roughness.jpg"     
        }
      ]
    },
    {
      texturesName: 'office',
      textures: [
        {
            "type": "map",
            "path": "assets/textures/Facade014_1K-JPG/Facade014_1K_Color.jpg"     
        },
        {
            "type": "displacementMap",
            "path": "assets/textures/Facade014_1K-JPG/Facade014_1K_Displacement.jpg"     
        },
        {
            "type": "emmissiveMap",
            "path": "assets/textures/Facade014_1K-JPG/Facade014_1K_Emission.jpg"     
        },
        {
            "type": "normalMap",
            "path": "assets/textures/Facade014_1K-JPG/Facade014_1K_NormalGL.jpg"     
        },
        {
            "type": "roughnessMap",
            "path": "assets/textures/Facade014_1K-JPG/Facade014_1K_Roughness.jpg"     
        }
      ]
    },
    {
      texturesName: 'Bricks-38',
      textures: [
        {
            "type": "map",
            "path": "assets/textures/Bricks038_1K-JPG/Bricks038_1K_Color.jpg"     
        },
        {
            "type": "displacementMap",
            "path": "assets/textures/Bricks038_1K-JPG/Bricks038_1K_Displacement.jpg"     
        },
        {
            "type": "aoMap",
            "path": "assets/textures/Bricks038_1K-JPG/Bricks038_1K_AmbientOcclusion.jpg"     
        },
        {
            "type": "normalMap",
            "path": "assets/textures/Bricks038_1K-JPG/Bricks038_1K_NormalGL.jpg"     
        },
        {
            "type": "roughnessMap",
            "path": "assets/textures/Bricks038_1K-JPG/Bricks038_1K_Roughness.jpg"     
        }
      ]
    },
    {
      texturesName: 'rusty-metal',
      textures: [
        {
            "type": "map",
            "path": "assets/textures/rusty_metal/rusty_metal_02_diff_4k.jpg"     
        },
        {
            "type": "displacementMap",
            "path": "assets/textures/rusty_metal/rusty_metal_02_disp_4k.png"     
        },
        {
            "type": "aoMap",
            "path": "assets/textures/rusty_metal/rusty_metal_02_ao_4k.jpg"     
        },
        {
            "type": "normalMap",
            "path": "assets/textures/rusty_metal/rusty_metal_02_nor_gl_4k.jpg"     
        },
        {
            "type": "roughnessMap",
            "path": "assets/textures/rusty_metal/rusty_metal_02_rough_4k.jpg"     
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
    polygonHeight: ['', [
      Validators.min(0.1),
      Validators.max(999),
    ]],
    materials: this.fb.array([
      // this.fb.group({
      //   textures: this.fb.array([
      //     this.fb.group({
      //       type: [''],
      //       path: ['']
      //     })
      //   ]),
      //   color: [''],
      //   transparent: [''],
      //   aoMapIntensity: ['', [
      //     Validators.min(0),
      //     Validators.max(10),
      //   ]],
      //   displacamentScale: ['', [
      //     Validators.min(0),
      //     Validators.max(10),
      //   ]],
      //   displacementBias: ['', [
      //     Validators.min(0),
      //     Validators.max(10),
      //   ]],
      //   emissiveIntensity: ['', [
      //     Validators.min(0),
      //     Validators.max(10),
      //   ]],
      //   emissive: [''],// color
      //   normalScaleX: [''], // vector2
      //   normalScaleY: [''],
      //   roughness: ['', [
      //     Validators.min(0),
      //     Validators.max(1),
      //   ]],
      //   metalness: ['', [
      //     Validators.min(0),
      //     Validators.max(1),
      //   ]],
      //   bumpScale: ['', [
      //     Validators.min(0),
      //     Validators.max(1),
      //   ]]
      // }),
    ]),
    scale: ['', [
      Validators.min(0.1),
      Validators.max(10),
    ]]
  });

  selectedTexture;



  constructor(private item3dListService: Item3dListService, private fb: FormBuilder) { }

  ngOnInit(): void {
    this.inputItemForm(this.item);
    this.form.valueChanges.subscribe(val => {
      console.log('Value CHANGED', val)
      for (const [key, value] of Object.entries(val)) {
        if (value) {
          console.log(value);
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
            case 'scale': 
              this.item.scale = val.scale;
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
      console.log('UPDATED BY FORM', this.item);
      this.item3dListService.sendItem3dToEdit(this.item);
    });
  }


  inputItemForm(item: IItem3d) {
    console.log('THISISITEM', item)
    this.form.patchValue({
      dimensionsX: item.dimensions?.x,
      segmentsX: item.segments?.x,
      dimensionsY: item.dimensions?.y,
      segmentsY: item.segments?.y,
      dimensionsZ: item.dimensions?.z,
      segmentsZ: item.segments?.z,
      polygonHeight: item.polygonExtrusionHeight,
      scale: item.scale
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
        bumpScale: m.bumpScale
      });
      if (m.textures) {
        materialFormGroup.setControl('textures', this.setExistingTextures(m.textures))
      }
      formArray.push(materialFormGroup);
    });
    console.log('AFTER PATCH',formArray)

    return formArray;
  }

  setExistingTextures(texturesLIst: ITexture[]): FormArray {
    const formArray = new FormArray([]);
    texturesLIst.forEach( t => {
      console.log(t);
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
        Validators.max(10),
      ]],
      displacamentScale: ['', [
        Validators.min(0),
        Validators.max(10),
      ]],
      displacementBias: ['', [
        Validators.min(0),
        Validators.max(10),
      ]],
      emissiveIntensity: ['', [
        Validators.min(0),
        Validators.max(10),
      ]],
      emissive: [''],// color
      normalScaleX: [''],
      normalScaleY: [''], // vector2
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
      ]]
    });

    this.materials.push(materialForm);
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
