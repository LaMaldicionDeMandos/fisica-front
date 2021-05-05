import { Component, OnInit } from '@angular/core';
import { AppService } from '../../app.service';

@Component({
  selector: 'app-header',
  templateUrl: 'header.component.html',
  styleUrls: ['header.component.scss']
})
export class HeaderComponent implements OnInit {
  maCurrentTheme: string;
  maThemes: Array<string>;
  appShortcuts: Array<any>;
  tasks: Array<any>;
  notifications: Array<any>;
  mobileSearchActive: boolean = false;

  constructor(private service: AppService) {

    // Retrieve current theme from AppService
    this.maCurrentTheme = service.maTheme;

    // App shortcut data
    this.appShortcuts = [
      {
        appTitle: 'Calendar',
        className: 'bg-red',
        icon: 'zmdi-calendar'
      },
      {
        appTitle: 'Files',
        className: 'bg-blue',
        icon: 'zmdi-file-text'
      },
      {
        appTitle: 'Email',
        className: 'bg-teal',
        icon: 'zmdi-email'
      },
      {
        appTitle: 'Reports',
        className: 'bg-blue-grey',
        icon: 'zmdi-trending-up'
      },
      {
        appTitle: 'News',
        className: 'bg-orange',
        icon: 'zmdi-view-headline'
      },
      {
        appTitle: 'Gallery',
        className: 'bg-light-green',
        icon: 'zmdi-image'
      }
    ]

    // Available themes
    this.maThemes = [
        'green',
        'blue',
        'red',
        'teal',
        'cyan',
        'blue-grey',
        'purple',
        'indigo'
    ]

    // Tasks
    this.tasks = [
      {
        name: 'HTML5 Validation Report',
        completed: 95,
        color: 'primary'
      },
      {
        name: 'Google Chrome Extension',
        completed: '80',
        color: 'success'
      },
      {
        name: 'Social Intranet Project',
        completed: '20',
        color: 'warning'
      },
      {
        name: 'Bootstrap Admin Template',
        completed: '60',
        color: 'danger'
      },
      {
        name: 'Youtube Client App',
        completed: '80',
        color: 'info'
      }
    ]

    // Notifications + Messages
    this.notifications = [
      {
        image: '1.jpg',
        user: 'David Belle',
        content: 'Cum sociis natoque penatibus et magnis dis parturient montes',
        date: '12:01 PM'
      },
      {
        image: '2.jpg',
        user: 'Jonathan Morris',
        content: 'Nunc quis diam diamurabitur at dolor elementum, dictum turpis vel',
        date: '02:45 PM'
      },
      {
        image: '6.jpg',
        user: 'Fredric Mitchell Jr.',
        content: 'Phasellus a ante et est ornare accumsan at vel magnauis blandit turpis at augue ultricies',
        date: '08:21 PM'
      },
      {
        image: '4.jpg',
        user: 'Glenn Jecobs',
        content: 'Ut vitae lacus sem ellentesque maximus, nunc sit amet varius dignissim, dui est consectetur neque',
        date: '08:43 PM'
      },
      {
        image: '5.jpg',
        user: 'Bill Phillips',
        content: 'Proin laoreet commodo eros id faucibus. Donec ligula quam, imperdiet vel ante placerat',
        date: '11:32 PM'
      }
    ];
  }

  // Set theme
  setMaTheme() {
    this.service.maTheme = this.maCurrentTheme
  }

  ngOnInit() {
  }

}
