import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {CinematicPage} from './pages/cinematic/cinematic.page';


const routes: Routes = [
  { path: '', redirectTo: 'cinematic', pathMatch: 'full'},
  { path: 'cinematic', component:  CinematicPage},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
