import { Routes, RouterModule } from "@angular/router";
import { NgModule } from "@angular/core";
import { ResourcesComponent } from "./resources/resources.component";
//import { UserListComponent } from "./user-list/user-list.component";
//import { SignupComponent } from "./auth/signup/signup.component";
//import { SigninComponent } from "./auth/signin/signin.component";

const appRoutes: Routes = [
    { path: '', component: ResourcesComponent},
//    { path: 'signup', component: SignupComponent },
//    { path: 'signin', component: SigninComponent }        
];

@NgModule({
    imports: [RouterModule.forRoot(appRoutes)],
    exports: [RouterModule]
})
export class AppRoutingModule {

}
