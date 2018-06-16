import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs/Subscription';
import { AuthenticationService } from '../shared/authentication.service';
import { Subject } from 'rxjs/Subject';
import { NotificationService } from '../shared/notification.service';


@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.css']
})
export class SigninComponent implements OnInit {
  @ViewChild('f') slForm: NgForm;
  messageUpdate: Subscription;
  message: any;
  loading: boolean = false;
  signUpEmail: string;  

  constructor(private authenticationService: AuthenticationService,
              private notificationService: NotificationService,
              private router: Router) { }

  ngOnInit() {    
    this.messageUpdate = this.notificationService.getMessage()
    .subscribe(
      (message) => {
        this.message = message;
      }
    );

  }

  onSignin(form: NgForm) {
    this.loading = true;
    const email = form.value.email;
    this.signUpEmail = email;
    const password = form.value.password;    
    this.authenticationService.signinUser(email, password, null, null, null, this);
  } 

  successfulLogin() {
    console.log('successfulLogin');
    this.router.navigateByUrl('/resources'); 
  }

  newPasswordRequired() {
    //this.router.navigateByUrl('/signup/newpassword/' + this.signUpEmail);
    this.router.navigate(['/signup/newpassword/' + this.signUpEmail], {
      skipLocationChange: true
    });
  }


  isLoading() {
    return this.loading;
  }


}
