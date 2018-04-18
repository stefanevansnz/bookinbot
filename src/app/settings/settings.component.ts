import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { DataStorageService } from '../shared/data-storage.service';
import { AuthenticationService } from '../shared/authentication.service';
import { Subscription } from 'rxjs/Subscription';
import { Response } from '@angular/http';
import { NotificationService } from '../shared/notification.service';
import { messages } from '../app-messages';
import { User } from '../shared/user.model';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit {
  @ViewChild('f') slForm: NgForm;  
  messageUpdate: Subscription;
  message: any;
  loading: boolean = false; 
  
  private users: User[] = [];
  

  constructor(
    private authenticationService: AuthenticationService,              
    private notificationService: NotificationService,
    private dataStorageService: DataStorageService) { }

  ngOnInit() {
    var self = this;

    this.messageUpdate = this.notificationService.getMessage()
    .subscribe(
      (message) => {
        this.message = message;
      }
    );

    var user = this.authenticationService.getUser();
    var userid = user.id;

    // get user group
    console.log('find user group');
    this.dataStorageService.getObjects('usergroup', userid)
    .subscribe(
      (success: Response) => {
        console.log('found user group for userid ' + userid);

      },
      (error: Response) => {
        console.log('error finding usergroup' + error );
        var message = JSON.parse(error.text());
        if (message.error !== messages.usergroup_not_found) {
          // usergroup found for this user
          self.notificationService.setMessage( messages.server_error + message.error ); 
        }
      })
  }

  onSearchUsers(form: NgForm) {
    var self = this;

    //this.loading = true;
    const email = form.value.email;
    console.log('find users ' + email);

    var params = {'name':'email', 'value': email};

    this.dataStorageService.getObjectsParams('users', params)
    .subscribe(
      (success: Response) => {
        console.log('found users for email ' + email);
        this.users = success.json();
        console.log('user is ' + this.users.length); 
      },
      (error: Response) => {
        console.log('error finding users' + error );
        self.notificationService.setMessage( messages.server_error ); 
        // create if doesn't exist.
      })
  } 
  
  onAddObject() {
    console.log('add object');
  }

  isLoading() {
    return this.loading;
  }

  


}
