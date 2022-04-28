
declare module "application-types" {
  import { LngLatLike, LngLat } from 'mapbox-gl';
  import { Vector2 } from 'three';

  // export interface LayerOption {
  //   name: string;
  //   url: string;
  //   projection: ProjectionType;
  //   type: string;
  // }

  // enum ProjectionType {
  //   '2d',
  //   '3d'
  // }

  // enum ItemType {
  //   'office building', 
  //   'residential', 
  //   'commercial', 
  //   'road', 
  //   'tree', 
  //   'polygon', 
  //   'polygon service'
  // }

  // enum TextureType {
  //   'map',
  //   'alphaMap',
  //   'aoMap',
  //   'displacementMap',
  //   'emmissiveMap',
  //   'normalMap',
  //   'roughnessMap',
  //   'metalnessMap',
  //   'envMap'
  // }


  // ***Change Type to this ItemType

  // enum ItemType {
  //   'Box', 
  //   'Extrude', 
  //   'Loaded', 
  //   'Sphere', 
  //   'Tube', 
  //   'Cylinder', 
  //   'Cone'
  // }


  export interface IItem3d {
    name: string;
    itemType?: string;
    coordinates: LngLatLike;
    selected?: boolean;
    materials?: Array<IMaterial>;
    polygon?: Array<[]>;
    polygonId?: string;
    dimensions?: any;
    segments?: any;
    textureNeedRepeat?: { x: number, y: number, z?: number}
    modelPath?: string;
    scale?: any;
    polygonExtrusionHeight?: number;
  }

  export interface IMaterial {
    textures?: Array<ITexture>;
    color?: any;
    transparent?: boolean;
    aoMapIntensity?: number;
    displacamentScale?: number;
    displacementBias?: number;
    emissiveIntensity?: number;
    emissive?: any; // color
    normalScaleX?: number;
    normalScaleY?: number; // vector2
    roughness?: number;
    metalness?: number;
    bumpScale?: number;
    wireframe?: boolean;
    flipY?: boolean;
  }

  export interface ITexture {
    type: string;
    path: string;
    wrapS?: number;
    wrapT?: number;
    offset?: Vector2;
    repeat?: Vector2;
    rotation?: number;
    center?: Vector2;
    needsUpdate?: boolean;
  }

}
