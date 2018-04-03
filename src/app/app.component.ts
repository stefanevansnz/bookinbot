import { Component } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { AuthenticationService } from "./shared/authentication.service";
import { User } from './shared/user.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  constructor(              
    private authenticationService: AuthenticationService ) {
  }

  userUpdate: Subscription;

}
