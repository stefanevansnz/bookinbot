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
  //signUpEmail: string;
  email: string;  
  code: string  
  requiredAttributes: any;
  searchMode: boolean = true;


  constructor(private authenticationService: AuthenticationService,
              private notificationService: NotificationService,
              private dataStorageService: DataStorageService,
              private router: Router,
              private route: ActivatedRoute
              ) { }


  ngOnInit() {  
    this.loading = false;      
    this.messageUpdate = this.notificationService.getMessage()
    .subscribe(
      (message) => {
        this.message = message;
      }
    );

    let self = this;
    this.route.params
      .subscribe(
        (params: Params) => {
          // something has changed
          //this.status = params['status'];
          this.email = params['email'];
          console.log('load email = ' + this.email);
          if (this.email == undefined) {
            console.log('New sign up');
            this.status = 'new';
          } else if (this.email == 'confirm') {
            console.log('Confirm sign up');             
            // test code 
            this.status = 'confirm';
            //this.authenticationService.signinUser(this.email, null, null, this.code, null, null, this);
          } else if (this.email == 'completed') {
            console.log('completed sign up');                               
          } else {
            console.log('New Password ' + this.code);             
            this.code = params['code'];
            // test code 
            this.status = 'newpassword';
            this.authenticationService.signinUser(this.email, this.code, null, null, null, null, this);
          }
          console.log('load code = ' + this.code);

        }
      );    

  }


  ngAfterViewInit() {
    console.log('on after view init');
    if (this.status == 'new') {
      this.suForm.reset();
    }
  } 

  newPasswordRequired() {
    this.status = 'newpassword';
    console.log('load status = ' + this.status);          
  }


  onSubmit(form: NgForm) {
    console.log('submit');
    let email = form.value.email;
    let password = form.value.password;
    let newpassword = form.value.newpassword;      
    let firstname = form.value.firstname;
    let lastname = form.value.lastname;
    let code = form.value.code;
    
    this.loading = true;

    if (email == null) {
      console.log('complete sign in');
      email = this.email;
      console.log('using email ' + email);
      console.log('using code ' + code);      
      if (newpassword != password) {
        this.message = 'Passwords do not match';
      } else {
        console.log('signinUser');
        this.authenticationService.signinUser(email, password, newpassword, code, firstname, lastname, this);
      }  
    } else {
      console.log('sign up');      
      this.authenticationService.signupUser(email, password, firstname, lastname, this);
    }
  } 

  successfulSignUp(status, email) {
    console.log('successfulSignUp ' + status);
    this.status = status;
    this.loading = false;
  }

  successfulLogin() {
    console.log('successfulLogin');
    this.router.navigateByUrl('/resources'); 
  }

  isLoading() {
    return this.loading;
  }


}
