import { Component, OnInit } from '@angular/core';
import { DataStorageService } from '../shared/data-storage.service';
import { AuthenticationService } from '../shared/authentication.service';
import { Subscription } from 'rxjs/Subscription';
import { Response } from '@angular/http';
import { NotificationService } from '../shared/notification.service';
import { messages } from '../app-messages';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit {
  messageUpdate: Subscription;
  message: any;

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
        var result = success.json();  
        console.log('found user group for userid ' + userid);
      },
      (error: Response) => {
        console.log('error finding usergroup' + error );
        self.notificationService.setMessage( messages.server_error ); 
        // create if doesn't exist.
      })


  }

}
