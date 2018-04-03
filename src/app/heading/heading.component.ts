import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthenticationService } from "../shared/authentication.service";
import { Subscription } from 'rxjs/Subscription';
import { User } from '../shared/user.model';

@Component({
  selector: 'app-heading',
  templateUrl: './heading.component.html',
  styleUrls: ['./heading.component.css']
})
export class HeadingComponent implements OnInit {

  loggedIn: boolean = false;
  
  userUpdate: Subscription;
  fullName: any;

  constructor(              
    private router: Router,
    private route: ActivatedRoute,
    private authenticationService: AuthenticationService ) {
  }

  setFullName( user: User ) {
    if (user != null) {
      this.fullName = user.firstname + ' ' + user.lastname;
    } else {
      // not logged in
      this.fullName = '';
    }
  }

  ngOnInit() { 

    self = this;

    // update on sign in
    var self = this;
    this.userUpdate = this.authenticationService.getloadedUser()
    .subscribe(
        (user: User) => {
          self.setFullName(user);
        }
    );   

    var user = this.authenticationService.getUser();
    self.setFullName(user);

  }

}
