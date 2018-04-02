import { Component, OnInit, ViewChild } from '@angular/core';
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

  constructor(private authenticationService: AuthenticationService,
              private notificationService: NotificationService) { }

  ngOnInit() {
    this.messageUpdate = this.notificationService.getMessage()
    .subscribe(
      (message) => {
        this.message = message;
      }
    );

  }

  onSignin(form: NgForm) {
    const email = form.value.email;
    const password = form.value.password;    
    this.authenticationService.signinUser(email, password,this);
  } 


}
