import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { NgxMapboxGLModule } from 'ngx-mapbox-gl';
import { environment } from 'src/environments/environment';


import { AppComponent } from './app.component';
import { MapComponent } from './map/map.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { UiComponent } from './ui/ui.component';
import { SidePanelComponent } from './ui/side-panel/side-panel.component';
import { DrawButtonsPanelComponent } from './ui/draw-buttons-panel/draw-buttons-panel.component';
import { Obj3dButtonsComponent } from './ui/obj3d-buttons/obj3d-buttons.component';
import { Items3dListComponent } from './ui/items3d-list/items3d-list.component';

import { MatCardModule } from '@angular/material/card';
import { MatButtonModule} from '@angular/material/button';
import { MatIconModule} from '@angular/material/icon';
import { MatSidenavModule} from '@angular/material/sidenav';
import { MatRadioModule } from '@angular/material/radio';
import { MatInputModule } from '@angular/material/input';
import { MatDividerModule } from '@angular/material/divider';
import { MatListModule } from '@angular/material/list';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatSelectModule } from '@angular/material/select';
import { MatSliderModule } from '@angular/material/slider';
import { TimeSliderComponent } from './ui/time-slider/time-slider.component';
import { Item3dComponent } from './ui/item3d/item3d.component';
import { Item3dReactiveComponent } from './ui/item3d-reactive/item3d-reactive.component';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatChipsModule } from '@angular/material/chips';








@NgModule({
  declarations: [
    AppComponent,
    MapComponent,
    UiComponent,
    DrawButtonsPanelComponent,
    SidePanelComponent,
    Obj3dButtonsComponent,
    Items3dListComponent,
    TimeSliderComponent,
    Item3dComponent,
    Item3dReactiveComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    NgxMapboxGLModule.withConfig({
      accessToken: environment.mapboxToken,
    }),
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatSidenavModule,
    MatInputModule,
    MatRadioModule,
    MatDividerModule,
    MatListModule,
    MatExpansionModule,
    MatSelectModule,
    MatSliderModule,
    MatTabsModule,
    MatTooltipModule,
    MatChipsModule
  ],
  providers: [
    { provide: Window, useValue: window }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
