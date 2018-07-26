import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs/Subscription';
import { AuthenticationService } from '../shared/authentication.service';
import { Subject } from 'rxjs/Subject';
import { NotificationService } from '../shared/notification.service';
import { DataStorageService } from '../shared/data-storage.service';
import { User } from '../shared/user.model';
import { Response } from '@angular/http';
import { messages } from '../app-messages';

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
  status: string;
  signUpEmail: string;
  requiredAttributes: any;

  constructor(private authenticationService: AuthenticationService,
              private notificationService: NotificationService,
              private dataStorageService: DataStorageService,
              private router: Router,
              private activatedRoute: ActivatedRoute) { }


  ngOnInit() {

    console.log('sign up');
/*
    this.activatedRoute
      .queryParams
      .subscribe(params => {
        // Defaults to 0 if no query param provided.
        this.requiredAttributes = params['requiredAttributes']
        console.log('requiredAttributes is ' + this.requiredAttributes);
    });
*/
    this.activatedRoute.params.subscribe((params: Params) => {
      this.status = params['status'];
      this.signUpEmail = params['id'];      
      console.log('status of sign up is ' + this.status);
      console.log('signUpEmail of sign up is ' + this.signUpEmail);
      //let requiredAttributes = params['requiredAttributes'];
      this.messageUpdate = this.notificationService.getMessage()
      .subscribe(
        (message) => {
          this.message = message;
        }
      );
    });    
  }

  ngAfterViewInit() {
    console.log('on after view init');
    if (this.status == 'new') {
      this.suForm.reset();
    }
  } 

  onSetDefault() {
    this.suForm.setValue({
      email: 'test@test.com',
      password: 'password',
      firstname: 'Test',
      lastname: 'Test'   
    });
  }


  onSubmit(form: NgForm) {
    //this.loading = true;
    let email = form.value.email;
    let password = form.value.password;
    let newpassword = form.value.newpassword;      
    let firstname = form.value.firstname;
    let lastname = form.value.lastname;

    if (this.status == 'newpassword') {
      if (email == null) {
        email = this.signUpEmail;
      }
      console.log('new password');
      this.authenticationService.signinUser(email, password, newpassword, firstname, lastname, this);
    } else {
      console.log('sign up');
      this.authenticationService.signupUser(email, password, firstname, lastname, this);
    }
  } 

  successfulSignUp(status, email) {
    console.log('successfulSignUp ' + status);
    this.router.navigateByUrl('/signup/'+ status+ '/' + email);    
  }

  isLoading() {
    return this.loading;
  }


}
