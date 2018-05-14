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
  newpassword: boolean = false;

  constructor(private authenticationService: AuthenticationService,
              private notificationService: NotificationService,
              private dataStorageService: DataStorageService,
              private router: Router,
              private activatedRoute: ActivatedRoute) { }


  ngOnInit() {

    console.log('sign up');
    this.activatedRoute.params.subscribe((params: Params) => {
      let status = params['status'];
      console.log('status of sign up is ' + status);
      if (status == 'newpassword') {
        console.log('set newpassword to true');
        this.newpassword = true;
      }
    });    
  
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
      email: 'test@test.com',
      password: 'password',
      firstname: 'Test',
      lastname: 'Test'   
    });
  }


  onSubmit(form: NgForm) {
    //this.loading = true;
    const email = form.value.email;
    const password = form.value.password;
    const newpassword = form.value.newpassword;      
    const firstname = form.value.firstname;
    const lastname = form.value.lastname;

    if (this.newpassword) {
      this.authenticationService.completeNewPasswordChallenge(email, password, newpassword, firstname, lastname, this);
    } else {
      this.authenticationService.signupUser(email, password, firstname, lastname, this);
    }
  } 

  successfulSignUp() {
    console.log('successfulSignUp');
    this.router.navigateByUrl('/signup?status=confirm');    
  }

  isLoading() {
    return this.loading;
  }


}
