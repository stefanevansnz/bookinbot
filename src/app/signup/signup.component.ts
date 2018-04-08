import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs/Subscription';
import { AuthenticationService } from '../shared/authentication.service';
import { Subject } from 'rxjs/Subject';
import { NotificationService } from '../shared/notification.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {

  @ViewChild('f') suForm: NgForm;

  messageUpdate: Subscription;
  message: any;
  loading: boolean = false;

  constructor(private authenticationService: AuthenticationService,
              private notificationService: NotificationService,
              private router: Router) { }


  ngOnInit() {

    console.log('sign up');
  
    this.suForm.reset();
    this.messageUpdate = this.notificationService.getMessage()
    .subscribe(
      (message) => {
        this.message = message;
      }
    );

  }

  onSetDefault() {
    this.suForm.setValue({
      email: 'stefanevansnz@hotmail.com',
      password: 'password',
      firstname: 'sdfsdf',
      lastname: 'sdfsdf'   
    });
  }


  onSubmit(form: NgForm) {
    //this.loading = true;
    const email = form.value.email;
    const password = form.value.password;  
    const firstname = form.value.firstname;
    const lastname = form.value.lastname;          
    this.authenticationService.signupUser(email, password, firstname, lastname, this);
  } 

  successfulLogin() {
    console.log('successfulLogin');
    this.router.navigateByUrl('/resources'); 
  }

  isLoading() {
    return this.loading;
  }


}
