import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs/Subscription';
import { AuthenticationService } from '../shared/authentication.service';
import { Subject } from 'rxjs/Subject';
import { NotificationService } from '../shared/notification.service';
import { Router, ActivatedRoute, Params } from '@angular/router';

@Component({
  selector: 'app-forgot',
  templateUrl: './forgot.component.html',
  styleUrls: ['./forgot.component.css']
})
export class ForgotComponent implements OnInit {

  @ViewChild('f') slForm: NgForm;
  messageUpdate: Subscription;
  message: any;
  loading: boolean = false;
  signUpEmail: string;  
  status: string;  

  constructor(private authenticationService: AuthenticationService,
    private notificationService: NotificationService,
    private router: Router,
    private route: ActivatedRoute) { }

  ngOnInit() {    
    this.messageUpdate = this.notificationService.getMessage()
    .subscribe(
      (message) => {
        this.message = message;
      }
    );
    this.status = 'new';

    let self = this;
  }

  onForgot(form: NgForm) {
    this.loading = true;
    let email = form.value.email;
    if (email == undefined) {
      email = email.toLowerCase();
    }      
    this.signUpEmail = email;
    const password = form.value.password;    
    this.authenticationService.forgotPassword(email, this);
  } 


  onConfirmPasswordCode(form: NgForm) {
    console.log('submit');
    let password = form.value.password;
    let code = form.value.code;
    
    this.loading = true;


      console.log('sign up');      
      this.authenticationService.confirmPasswordCode(code, password, this);
  } 

  successfulSendForgotPassword() {
    console.log('successfulSendForgotPassword');
    this.loading = false;
    this.status = 'confirm';
    //this.router.navigateByUrl('/signup/confirm'); 
  }

  successfulConfirmPassword() {
    console.log('successfulConfirmPassword');
    this.loading = false;
    this.status = 'completed';
  }

  isLoading() {
    return this.loading;
  }  

}
