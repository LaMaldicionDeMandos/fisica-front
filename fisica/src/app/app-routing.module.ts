import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {CinematicPage} from './pages/cinematic/cinematic.page';
import {Layout1Component} from './layout/layouts/layout-1/layout.component';


const routes: Routes = [
  { path: '', component: Layout1Component,
    children: [
      { path: '', redirectTo: 'cinematic', pathMatch: 'full'},
      { path: 'cinematic', component:  CinematicPage}
    ]
  },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
