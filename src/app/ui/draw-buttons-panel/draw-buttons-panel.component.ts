import { Component, ElementRef, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { SidePanelService } from '../services/side-panel.service';
import { DrawButtonsPanelService } from './draw-buttons-panel.service';

@Component({
  selector: 'app-draw-buttons-panel',
  templateUrl: './draw-buttons-panel.component.html',
  styleUrls: ['./draw-buttons-panel.component.css']
})
export class DrawButtonsPanelComponent implements OnInit {

  @Output() toggleSidePanelForMe: EventEmitter<any> = new EventEmitter();

  @ViewChild('buttonCanvas', {static: true})
  public rendererCanvas: ElementRef<HTMLCanvasElement>;

  constructor(private sidePanelService: SidePanelService, private drawButtonPanelService: DrawButtonsPanelService) { }

  ngOnInit(): void {
    this.drawButtonPanelService.createScene(this.rendererCanvas);
    this.drawButtonPanelService.animate();
  }

  toggleSidePanel() {
    this.sidePanelService.openSidePanel(true);
  }

}
