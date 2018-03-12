import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Http } from '@angular/http';
import { HttpModule } from '@angular/http';
import { ModalModule } from 'ngx-bootstrap/modal';

import { AppComponent } from './app.component';

import { AppRoutingModule } from './app-routing.module';
import { ResourcesComponent } from './resources/resources.component';
import { DataStorageService } from './shared/data-storage.service';
import { BookingsComponent } from './bookings/bookings.component';

@NgModule({
  declarations: [
    AppComponent,
    ResourcesComponent,
    BookingsComponent
  ],
  imports: [
    BrowserModule,
    HttpModule,
    AppRoutingModule,
    FormsModule, 
    ModalModule  
  ],
  providers: [DataStorageService],
  bootstrap: [AppComponent]
})
export class AppModule { }
