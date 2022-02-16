import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export class ItemTemplatesService {

  url = '/assets/data/configItemTemplate.json';

  constructor(private http: HttpClient) { }

  getTemplates() {
    return this.http.get<any>(this.url);
  }


}
