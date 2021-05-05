import { Component, OnInit } from '@angular/core';
import { AppService } from '../../../app.service';

@Component({
  selector: 'app-navigation-trigger',
  templateUrl: 'navigation-trigger.component.html',
  styleUrls: ['navigation-trigger.component.scss']
})
export class NavigationTriggerComponent implements OnInit {

  constructor(public service: AppService) { }

  openMobileSidebar() {
    this.service.mobileSidebarActive = !this.service.mobileSidebarActive;
  }

  ngOnInit() {
  }

}
