import { Component, OnInit } from '@angular/core';
import { SidePanelService } from '../services/side-panel.service';

@Component({
  selector: 'app-side-panel',
  templateUrl: './side-panel.component.html',
  styleUrls: ['./side-panel.component.css']
})
export class SidePanelComponent implements OnInit {

  opened = false;

  constructor(private sidePanelService: SidePanelService) { }

  ngOnInit(): void {
    this.sidePanelService.openSidePanel$.subscribe( opened => {
      this.opened = !this.opened;
    })
  }

}
