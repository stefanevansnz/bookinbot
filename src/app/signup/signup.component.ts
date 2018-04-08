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

  @ViewChild('signupform') slForm: NgForm;

  messageUpdate: Subscription;
  message: any;
  loading: boolean = false;

  constructor(private authenticationService: AuthenticationService,
              private notificationService: NotificationService,
              private router: Router) { }


  ngOnInit() {

    this.slForm.setValue({
      firstname: 'sdfsdf',
      lastname: 'sdfsdf'   
    });


    this.messageUpdate = this.notificationService.getMessage()
    .subscribe(
      (message) => {
        this.message = message;
      }
    );

  }

  onSignup(form: NgForm) {
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
