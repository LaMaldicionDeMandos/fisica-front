import {Component, OnInit} from '@angular/core';
import {trigger, state, animate, transition, style} from '@angular/animations'
import {Event, NavigationCancel, NavigationEnd, NavigationError, NavigationStart, Router} from '@angular/router';


@Component({
    selector: 'page-loader',
    templateUrl: './page-loader.component.html',
    styleUrls: ['./page-loader.component.scss'],
    animations: [
        trigger('togglePageLoader', [
            state('true', style({ transform: 'translate3d(0,0,0)' })),
            state('void', style({ transform: 'translate3d(0,50px,0)' })),
            transition(':enter', animate('300ms')),
            transition(':leave', animate('300ms'))
        ])
    ],
})
export class PageLoaderComponent implements OnInit {
    loading = false;

    constructor(private router: Router) {
        this.router.events.subscribe((event: Event) => {
            switch (true) {
                case event instanceof NavigationStart: {
                    this.loading = true;
                    break;
                }
                case event instanceof NavigationEnd:
                case event instanceof NavigationCancel:
                case event instanceof NavigationError: {
                    setTimeout(() =>  {
                        this.loading = false;
                    }, 750);
                    break;
                }
                default: {
                    break;
                }
            }
        });
    }

    ngOnInit() {
    }

}
