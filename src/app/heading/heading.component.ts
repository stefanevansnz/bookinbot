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
  
  fullNameUpdate: Subscription;
  fullName: any;

  constructor(              
    private router: Router,
    private route: ActivatedRoute,
    private authenticationService: AuthenticationService ) {
    

  }

  ngOnInit() { 

    // update on sign in
    var self = this;
    this.fullNameUpdate = this.authenticationService.getUser()
    .subscribe(
        (user: User) => {
          if (user != null) {
            this.fullName = user.firstname + ' ' + user.lastname;
            console.log('setting full name to ' + this.fullName);
            self.loggedIn = true;  
          } else {
            this.fullName = '';
          }
        }
      );  
  }

}
