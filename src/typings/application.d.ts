declare module "application-types" {

  export interface LayerOption {
    name: string;
    url: string;
    projection: ProjectionType;
    type: string;
  }

  enum ProjectionType {
    '2d',
    '3d'
  }

  export interface customMarker {

  }
}
