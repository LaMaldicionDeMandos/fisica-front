import { Component, OnInit } from '@angular/core';
import {trigger, state, style, animate, transition} from '@angular/animations';

@Component({
  selector: 'sidebar-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss'],
  animations: [
    trigger('toggleUserMenu', [
      state('void', style({
        height: '0',
        opacity: '0'
      })),
      state('true', style({
        height: '*',
        opacity: '1'
      })),
      transition(':enter', animate('200ms ease-in')),
      transition(':leave', animate('200ms ease-out'))
    ])
  ]
})
export class UserComponent implements OnInit {
  userMenu: boolean = false;

  constructor() { }

  ngOnInit() {
  }

}
