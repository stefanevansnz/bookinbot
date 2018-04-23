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
  searched: boolean = false;
  inviteready: boolean = false;

  private usergroupid: string;
    
  private searchusers: User[] = [];
  private users: User[] = [];
  private searchMessage: string;
  private inviteMessage: string;

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
    this.usergroupid = user.id;

    // get user group
    console.log('find user group');
    this.dataStorageService.getObjects('usergroup', this.usergroupid)
    .subscribe(
      (success: Response) => {
        console.log('found user group for userid ' + this.usergroupid);
        this.users = success.json();        
        console.log('user is ' + this.users.length);         
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

  keyDownFunction(event) {
    if(event.keyCode == 13) {      
      // rest of your code
    }
  }

  onSearchUsers(form: NgForm) {
    var self = this;

    //this.loading = true;
    const email = form.value.email;
    console.log('find users ' + email);
    this.searchMessage = 'Search for users...';

    var params = {'name':'email', 'value': email};

    this.dataStorageService.getObjectsParams('users', params)
    .subscribe(
      (success: Response) => {
        console.log('found users for search on email ' + email);
        this.searchusers = success.json();
        if (this.searchusers.length == 0) {
          this.inviteMessage = "Invite " + email + " to join your group.";
          this.searchMessage = "User not found. Press 'Invite' to send an invite to join your group.";
        } else {
          this.searchMessage = "User found. Press 'Add' to add to your group.";
        }
        this.searched = true;
        console.log(this.searchMessage); 
      
      },
      (error: Response) => {
        console.log('error finding users' + error );
        self.notificationService.setMessage( messages.server_error ); 
        // create if doesn't exist.
      })
  } 
  
onAddObject(index: number, user: User) {
    console.log('add user object');
    this.dataStorageService.storeObjectParams(user, 'usergroup', this.usergroupid )
    .subscribe(
      (success: Response) => {          
        this.users.push(user);
        this.message = '';
      },
      (error: Response) => {
        this.message = messages.server_error;             
      }
    );
}

onDeleteObject(index: number, user: User) {

  this.dataStorageService.deleteObjectParams(user, 'usergroup', this.usergroupid)
  .subscribe(
    (success: Response) => {          
      this.users.splice(index, 1);        
      this.message = '';
    },
    (error: Response) => {
      this.message = messages.server_error;             
    }
  );    


}

isLoading() {
  return this.loading;
}

  


}
