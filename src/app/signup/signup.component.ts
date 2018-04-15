import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
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

  constructor(private authenticationService: AuthenticationService,
              private notificationService: NotificationService,
              private dataStorageService: DataStorageService,
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
      firstname: 'Stefan',
      lastname: 'Evans'   
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

  successfulSignUp(userId, email, firstname, lastname) {
    console.log('successfulSignUp userId is ' + userId + ' email is ' + email + ' firstname is ' + firstname + ' lastname is ' + lastname );

    let user = new User(userId, email, firstname, lastname, null);
    this.dataStorageService.storeObject(user)
    .subscribe(
      (success: Response) => {      
        // add user to list    
        user.id = success.json().id;
        this.message = '';          
        this.router.navigateByUrl('/signup?status=confirm'); 
      },
      (error: Response) => {
        this.message = messages.server_error;
        ;             
      }
    );


  }

  isLoading() {
    return this.loading;
  }


}
