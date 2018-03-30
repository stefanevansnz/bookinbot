import { Routes, RouterModule } from "@angular/router";
import { NgModule } from "@angular/core";
import { ResourcesComponent } from "./resources/resources.component";
import { BookingsComponent } from "./bookings/bookings.component";
import { SignupComponent } from "./signup/signup.component";
import { SigninComponent } from "./signin/signin.component";

const appRoutes: Routes = [

    { path: 'bookings/:id', component: BookingsComponent },
    { path: '', component: ResourcesComponent },    
    { path: 'signup', component: SignupComponent },
    { path: 'signin', component: SigninComponent }        
];

@NgModule({
    imports: [RouterModule.forRoot(appRoutes)],
    exports: [RouterModule]
})
export class AppRoutingModule {

}
