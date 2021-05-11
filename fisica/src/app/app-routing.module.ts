import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {CinematicMruPage} from './pages/cinematic/mru/cinematic-mru-page';
import {CinematicMruvPage} from './pages/cinematic/mruv/cinematic-mruv-page';
import {Layout1Component} from './layout/layouts/layout-1/layout.component';
import {DinamicPage} from './pages/dinamic/dinamic-page';

const routes: Routes = [
  { path: '', component: Layout1Component,
    children: [
      { path: '', redirectTo: 'cinematic_mru', pathMatch: 'full'},
      { path: 'cinematic_mru', component:  CinematicMruPage},
      { path: 'cinematic_mv', component:  CinematicMruvPage},

      { path: 'dinamic', component:  DinamicPage}
    ]
  },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
