import { Component, OnInit } from '@angular/core';
import { AppService } from '../../../app.service';

@Component({
  selector: 'app-layout',
  templateUrl: 'layout.component.html',
  styleUrls: ['layout.component.scss']
})
export class Layout1Component implements OnInit {
  maTheme: string = this.service.maTheme;

  constructor(public service: AppService) {}

  ngOnInit() {
  }
}
