import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { GraphExampleComponent } from './pages/graph-example/graph-example.component';
import {ChartsModule, ThemeService} from 'ng2-charts';
import {CinematicPage} from './pages/cinematic/cinematic.page';
import {FormsModule} from '@angular/forms';
import {SidebarComponent} from './layout/sidebar/sidebar.component';
import {HeaderComponent} from './layout/header/header.component';
import {FooterComponent} from './layout/footer/footer.component';
import {Layout1Component} from './layout/layouts/layout-1/layout.component';
import {SearchComponent} from './layout/header/search/search.component';
import {LogoComponent} from './layout/header/logo/logo.component';
import {NavigationTriggerComponent} from './layout/header/navigation-trigger/navigation-trigger.component';
import {UserComponent} from './layout/sidebar/user/user.component';
import {PageLoaderComponent} from './layout/page-loader/page-loader.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {NgScrollbarModule} from 'ngx-scrollbar';
import {BsDropdownModule} from 'ngx-bootstrap/dropdown';
import {ButtonsModule} from 'ngx-bootstrap/buttons';
import {HttpClientModule} from '@angular/common/http';
import {SimpleLinePlotComponent} from './components/simple-line-plot';

@NgModule({
  declarations: [
    AppComponent,
    SidebarComponent,
    HeaderComponent,
    FooterComponent,
    Layout1Component,
    SearchComponent,
    LogoComponent,
    NavigationTriggerComponent,
    UserComponent,
    PageLoaderComponent,
    GraphExampleComponent,
    SimpleLinePlotComponent,
    CinematicPage
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FormsModule,
    NgScrollbarModule,
    BsDropdownModule.forRoot(),
    ButtonsModule.forRoot(),
    HttpClientModule,
    ChartsModule,
    FormsModule
  ],
  providers: [ThemeService],
  bootstrap: [AppComponent]
})
export class AppModule { }
