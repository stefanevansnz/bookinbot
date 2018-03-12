import { Routes, RouterModule } from "@angular/router";
import { NgModule } from "@angular/core";
import { ResourcesComponent } from "./resources/resources.component";
import { BookingsComponent } from "./bookings/bookings.component";
//import { UserListComponent } from "./user-list/user-list.component";
//import { SignupComponent } from "./auth/signup/signup.component";
//import { SigninComponent } from "./auth/signin/signin.component";

const appRoutes: Routes = [

    { path: 'bookings/:id', component: BookingsComponent },
    { path: '', component: ResourcesComponent }    

/*
    { path: 'resources', component: ResourcesComponent, children: [
        { path: ':id', component: ResourcesComponent }
    ] }
*/    
//    { path: 'signup', component: SignupComponent },
//    { path: 'signin', component: SigninComponent }        
];

@NgModule({
    imports: [RouterModule.forRoot(appRoutes)],
    exports: [RouterModule]
})
export class AppRoutingModule {

}
