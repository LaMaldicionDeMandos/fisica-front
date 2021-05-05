import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-search',
  templateUrl: 'search.component.html',
  styleUrls: ['search.component.scss']
})
export class SearchComponent implements OnInit {
  searchValue:string = '';
  searchActive:boolean = false;
  searchFocused:boolean = false;
  @Input() mobileSearchStatus: boolean;
  @Output() mobileSearchStatusChange = new EventEmitter();

  resetSearch() {
    this.searchActive = false;
    this.searchValue = null;
    this.searchFocused = false;
  }

  closeSearch() {
    this.mobileSearchStatus = false;
    this.mobileSearchStatusChange.emit(false)
  }

  constructor() { }

  ngOnInit() {
  }

}
