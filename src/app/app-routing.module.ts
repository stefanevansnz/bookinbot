import { Routes, RouterModule } from "@angular/router";
import { NgModule } from "@angular/core";
import { ResourcesComponent } from "./resources/resources.component";
import { BookingsComponent } from "./bookings/bookings.component";
import { SharesComponent } from "./shares/shares.component";
import { SplashComponent } from "./splash/splash.component";
import { SignupComponent } from "./signup/signup.component";
import { SigninComponent } from "./signin/signin.component";
import { SignoutComponent } from "./signout/signout.component";
import { PageNotFoundComponent } from "./pagenotfound/pagenotfound.component";
import { AuthenticationGuardService as AuthenticationGuard } from "./shared/authentication-guard.service";
import { SettingsComponent } from "./settings/settings.component";

const appRoutes: Routes = [

    { path: 'resources', component: ResourcesComponent, canActivate: [AuthenticationGuard] },
    { path: 'bookings/:id', component: BookingsComponent, canActivate: [AuthenticationGuard] },
    { path: 'bookings/:id/:ownerid', component: BookingsComponent, canActivate: [AuthenticationGuard] },
    { path: 'shares/:id', component: SharesComponent, canActivate: [AuthenticationGuard] },
    { path: 'settings', component: SettingsComponent, canActivate: [AuthenticationGuard] },    
    { path: 'signout', component: SignoutComponent, canActivate: [AuthenticationGuard] },    
    { path: '', component: SplashComponent },        
    { path: 'signup/:status/:id', component: SignupComponent },
    { path: 'signup/:status', component: SignupComponent },
    { path: 'signin', component: SigninComponent },    
    { path: '**', component: PageNotFoundComponent}    
];

@NgModule({
    imports: [RouterModule.forRoot(appRoutes)],
    exports: [RouterModule]
})
export class AppRoutingModule {

}
