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
import { AuthenticationGuardService } from './shared/authentication-guard.service';
import { DateRangePickerService } from './shared/date-range-picker.service';
import { BookingsComponent } from './bookings/bookings.component';
import { HeadingComponent } from './heading/heading.component';
import { FooterComponent } from './footer/footer.component';
import { SigninComponent } from './signin/signin.component';
import { SignupComponent } from './signup/signup.component';
import { NotificationService } from './shared/notification.service';
import { SignoutComponent } from './signout/signout.component';
import { PageNotFoundComponent } from './pagenotfound/pagenotfound.component';
import { SplashComponent } from './splash/splash.component';
import { BookingsColourPickerService } from './bookings/bookings-colour-picker.service';
import { SharesComponent } from './shares/shares.component';
import { FeaturesComponent } from './features/features.component';
import { PricingComponent } from './pricing/pricing.component';
import { RecoverComponent } from './recover/recover.component';
import { ForgotComponent } from './forgot/forgot.component';

@NgModule({
  declarations: [
    AppComponent,
    ResourcesComponent,
    BookingsComponent,
    HeadingComponent,
    FooterComponent,
    SigninComponent,
    SignupComponent,
    SignoutComponent,
    PageNotFoundComponent,
    SplashComponent,
    SharesComponent,
    FeaturesComponent,
    PricingComponent,
    RecoverComponent,
    ForgotComponent
  ],
  imports: [
    BrowserModule,
    HttpModule,
    AppRoutingModule,
    FormsModule, 
    ModalModule  
  ],
  providers: [DataStorageService, AuthenticationService, NotificationService, AuthenticationGuardService, DateRangePickerService, BookingsColourPickerService ],
  bootstrap: [AppComponent]
})
export class AppModule { }
