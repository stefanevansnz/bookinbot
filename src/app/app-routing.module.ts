import { Routes, RouterModule } from "@angular/router";
import { NgModule } from "@angular/core";
import { ResourcesComponent } from "./resources/resources.component";
import { BookingsComponent } from "./bookings/bookings.component";
import { SignupComponent } from "./signup/signup.component";
import { SigninComponent } from "./signin/signin.component";
import { SignoutComponent } from "./signout/signout.component";
import { PageNotFoundComponent } from "./pagenotfound/pagenotfound.component";
import { AuthenticationGuardService as AuthenticationGuard } from "./shared/authentication-guard.service";
import { SettingsComponent } from "./settings/settings.component";

const appRoutes: Routes = [

    { path: 'bookings/:id', component: BookingsComponent, canActivate: [AuthenticationGuard] },
    { path: '', component: ResourcesComponent, canActivate: [AuthenticationGuard] },    
    { path: 'signup', component: SignupComponent },
    { path: 'signin', component: SigninComponent },
    { path: 'signout', component: SignoutComponent, canActivate: [AuthenticationGuard] },    
    { path: 'settings', component: SettingsComponent, canActivate: [AuthenticationGuard] } ,
    
    { path: '**', component: PageNotFoundComponent}    
];

@NgModule({
    imports: [RouterModule.forRoot(appRoutes)],
    exports: [RouterModule]
})
export class AppRoutingModule {

}
