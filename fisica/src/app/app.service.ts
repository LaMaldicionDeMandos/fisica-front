import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AppService {

  // Default theme
  maTheme: string = 'green';

  // Mobile sidebar state
  mobileSidebarActive: boolean = false;

  // Contacts
  contactsItems: any[] = [
    {
      name: 'Cathy Shelton',
      email: 'cathy.shelton31@example.com',
      img: '1.jpg'
    },
    {
      name: 'Marilyn Thomas',
      email: 'marilyn@example.com',
      img: '2.jpg'
    },
    {
      name: 'Dwight Gilbert',
      email: 'dwight@example.com',
      img: '3.jpg'
    },
    {
      name: 'Cody Moreno',
      email: 'moreno@example.com',
      img: '4.jpg'
    },
    {
      name: 'Jamie Freeman',
      email: 'freeman@example.com',
      img: '5.jpg'
    },
    {
      name: 'Charles Spencer',
      email: 'charles@example.com',
      img: '6.jpg'
    },
    {
      name: 'Vickie Reed',
      email: 'reed@example.com',
      img: '7.jpg'
    },
    {
      name: 'Lauren Ruiz',
      email: 'ruiz@example.com',
      img: '8.jpg'
    },
    {
      name: 'Marlene Vasquez',
      email: 'vasquez@example.com',
      img: '9.jpg'
    },
    {
      name: 'Loretta Morrisonz',
      email: 'morrisonz@example.com',
      img: '10.jpg'
    },
    {
      name: 'Yvonne Wood',
      email: 'wood@example.com',
      img: '11.jpg'
    },
    {
      name: 'Denise Franklin',
      email: 'franklin@example.com',
      img: '12.jpg'
    },
    {
      name: 'Joseph Gonzalez',
      email: 'gonzalez@example.com',
      img: '13.jpg'
    },
    {
      name: 'Rick Graham',
      email: 'graham@example.com',
      img: '14.jpg'
    },
    {
      name: 'Alexander Bailey',
      email: 'bailey@example.com',
      img: '15.jpg'
    },
    {
      name: 'Cathy Shelton',
      email: 'cathy.shelton31@example.com',
      img: '16.jpg'
    },
    {
      name: 'Stella Flores',
      email: 'stella@example.com',
      img: '1.jpg'
    },
    {
      name: 'Marilyn Thomas',
      email: 'marilyn@example.com',
      img: '2.jpg'
    },
    {
      name: 'Dwight Gilbert',
      email: 'dwight@example.com',
      img: '3.jpg'
    },
    {
      name: 'Cody Moreno',
      email: 'moreno@example.com',
      img: '4.jpg'
    },
    {
      name: 'Jamie Freeman',
      email: 'freeman@example.com',
      img: '5.jpg'
    },
    {
      name: 'Charles Spencer',
      email: 'charles@example.com',
      img: '6.jpg'
    },
    {
      name: 'Vickie Reed',
      email: 'reed@example.com',
      img: '7.jpg'
    },
    {
      name: 'Lauren Ruiz',
      email: 'ruiz@example.com',
      img: '8.jpg'
    },
    {
      name: 'Loretta Morrisonz',
      email: 'morrisonz@example.com',
      img: '9.jpg'
    },
    {
      name: 'Marlene Vasquez',
      email: 'vasquez@example.com',
      img: '10.jpg'
    },
    {
      name: 'Yvonne Wood',
      email: 'wood@example.com',
      img: '11.jpg'
    },
    {
      name: 'Denise Franklin',
      email: 'franklin@example.com',
      img: '12.jpg'
    }
  ];

  // Todolists
  todoLists: Array<any> = [
    {
      title: 'Fivamus sagittis lacus vel augue laoreet rutrum faucibus dolor auctor',
      cap: 'F',
      color: 'red',
      date: 'Today at 8.30 AM',
      tags: [
        'Messages'
      ],
      priority: '!!!'
    },
    {
      title: 'Nullam id dolor id nibh ultricies vehicula ut id elit',
      cap: 'N',
      color: 'light-blue',
      date: 'Today at 12.30 PM',
      tags: [
        'Clients'
      ],
      priority: '!!'
    },
    {
      title: 'Cras mattis consectetur purus sit amet fermentum',
      cap: 'C',
      color: 'amber',
      date: 'Tomorrow at 10.30 AM',
      tags: [
        'Clients'
      ],
      priority: '!!'
    },
    {
      title: 'Integer posuere erat a ante venenatis dapibus posuere velit aliquet',
      cap: 'I',
      color: 'lime',
      date: '05/08/2017 at 08.00 AM',
      tags: [
        'Server',
        'Issue'
      ],
      priority: '!'
    },
    {
      title: 'Maecenas sed diam eget risus varius blandit sit amet non magna. Maecenas faucibus mollis interdum Aenean eu leo quam. Pellentesque ornare sem lacinia quam venenatis vestibulum',
      cap: 'M',
      color: 'green',
      date: '10/08/2016 at 04.00 AM',
      tags: [
        'Server'
      ],
      priority: '!!!'
    },
    {
      title: 'Integer posuere erat a ante venenatis dapibus posuere velit aliquet',
      cap: 'I',
      color: 'teal',
      date: '05/08/2017 at 08.00 AM',
      tags: [
        'Server'
      ],
      priority: '!'
    },
    {
      title: 'Duis mollis, est non commodo luctus, nisi erat porttitor ligula, eget lacinia odio sem nec elit. Vivamus sagittis lacus vel augue laoreet rutrum faucibus dolor auctor. Praesent commodo cursus magna, vel scelerisque nisl consectetur et',
      cap: 'D',
      color: 'purple',
      date: '10/08/2016 at 09.20 AM',
      tags: [
        'server'
      ],
      priority: '!!!'
    },
    {
      title: 'Praesent commodo cursus magnavel scelerisque nisl consectetur',
      cap: 'P',
      color: 'pink',
      date: '10/08/2016 at 04.00 AM',
      tags: [
        'Server', 'Severe', 'Bug'
      ],
      priority: '!!!'
    },
    {
      title: 'Aenean lacinia bibendum nulla sed consectetur. Vivamus sagittis lacus vel augue laoreet rutrum faucibus dolor auctor.',
      cap: 'A',
      color: 'cyan',
      date: '15/08/2016 at 10.22 PM',
      tags: [
        'Messages'
      ],
      priority: '!!'
    }
  ];
  todoListActions: Array<any> = [
    'Mark as completed',
    'Delete'
  ];
}
