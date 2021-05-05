import { Directive, Input, ElementRef } from '@angular/core';
import 'jqvmap';
import 'jqvmap/dist/maps/jquery.vmap.world.js'
import 'jqvmap/dist/maps/jquery.vmap.canada.js';
import 'jqvmap/dist/maps/jquery.vmap.europe.js';
import 'jqvmap/dist/maps/jquery.vmap.france.js';
import 'jqvmap/dist/maps/jquery.vmap.germany.js';
import 'jqvmap/dist/maps/jquery.vmap.russia.js';
import 'jqvmap/dist/maps/jquery.vmap.usa.js';
import 'jqvmap/dist/maps/continents/jquery.vmap.africa.js';
import 'jqvmap/dist/maps/continents/jquery.vmap.asia.js';
import 'jqvmap/dist/maps/continents/jquery.vmap.australia.js';
import 'jqvmap/dist/maps/continents/jquery.vmap.north-america.js';
import 'jqvmap/dist/maps/continents/jquery.vmap.south-america.js';

declare let jQuery: any;

@Directive({
  selector: '[JqvMap]'
})

export class JqvmapDirective {
  @Input() private options:any;
  @Input() private height:any;

  constructor (private el: ElementRef) { }

  ngAfterViewInit() {
    let initJqvMap = jQuery(this.el.nativeElement);

    // Style
    initJqvMap.css ({
      height: this.height,
      width: '100%'
    });

    // Remove any previous tooltips
    jQuery('.jqvmap-label').remove();

    setTimeout(() => {
      // Initiate
      initJqvMap.vectorMap(
          this.options
      )
    }, 10);
  }
}
