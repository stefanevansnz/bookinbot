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
import { AuthenticationService } from './shared/authentication.service';
import { BookingsComponent } from './bookings/bookings.component';
import { HeadingComponent } from './heading/heading.component';
import { FooterComponent } from './footer/footer.component';
import { SigninComponent } from './signin/signin.component';
import { SignupComponent } from './signup/signup.component';
import { NotificationService } from './shared/notification.service';

@NgModule({
  declarations: [
    AppComponent,
    ResourcesComponent,
    BookingsComponent,
    HeadingComponent,
    FooterComponent,
    SigninComponent,
    SignupComponent
  ],
  imports: [
    BrowserModule,
    HttpModule,
    AppRoutingModule,
    FormsModule, 
    ModalModule  
  ],
  providers: [DataStorageService, AuthenticationService, NotificationService],
  bootstrap: [AppComponent]
})
export class AppModule { }
