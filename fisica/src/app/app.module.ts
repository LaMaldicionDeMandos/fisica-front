import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { GraphExampleComponent } from './pages/graph-example/graph-example.component';
import {ChartsModule, ThemeService} from 'ng2-charts';
import {CinematicPage} from './pages/cinematic/cinematic.page';
import {FormsModule} from '@angular/forms';

@NgModule({
  declarations: [
    AppComponent,
    GraphExampleComponent,
    CinematicPage
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ChartsModule,
    FormsModule
  ],
  providers: [ThemeService],
  bootstrap: [AppComponent]
})
export class AppModule { }
