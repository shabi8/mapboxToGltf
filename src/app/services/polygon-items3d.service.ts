import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PolygonItems3dService {

  url = '/assets/data/extrusion.geojson';

  constructor(private http: HttpClient) { }

  getPolygonsItem3d() {
    return this.http.get<any>(this.url);
  }
}
