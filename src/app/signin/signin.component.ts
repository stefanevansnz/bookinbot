import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs/Subscription';
import { AuthenticationService } from '../shared/authentication.service';
import { Subject } from 'rxjs/Subject';
import { NotificationService } from '../shared/notification.service';
import { Router, ActivatedRoute, Params } from '@angular/router';


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

  email: string;
  code: string

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

    let self = this;
    this.route.params
      .subscribe(
        (params: Params) => {
          // something has changed
          this.email = params['email'];
          console.log('load email = ' + this.email);
          //form.value.email = email;
          if (params['code'] == undefined) {
            this.code = '';
          } else {
            this.code = params['code'];
          }
          console.log('load code = ' + this.code);

        }
      );    

  }

  ngAfterViewInit() {
    console.log('on after view init');
    setTimeout(_=> this.updateForm());
  } 

  updateForm() {
    if (this.email != undefined) {
      /*
      this.slForm.setValue({
        email: this.email,
        password: this.code,
      });
      */  
     this.slForm.controls['email'].setValue(this.email);

    }
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
