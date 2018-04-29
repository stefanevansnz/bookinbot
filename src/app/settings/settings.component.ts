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
  userNotFound: boolean = false;
  
  private emailInvite: string;
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
    console.log('find user group for user ' + this.usergroupid);
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
        this.searchusers = success.json();
        if (this.searchusers.length == 0) {
          this.searchMessage = "User not found. Press 'Invite' to send an invite to join your group.";
          this.userNotFound = true;
          this.emailInvite = email;
        } else {
          this.searchMessage = "User found. Press 'Add' to add to your group.";
          this.userNotFound = false;          
        }
        this.searched = true;
        this.message = '';
        console.log(this.searchMessage); 
      
      },
      (error: Response) => {
        console.log('error finding users' + error );
        self.notificationService.setMessage( messages.server_error ); 
        // create if doesn't exist.
      })
  } 
  
onAddUser(user: User) {  
    console.log('add user object user id is ' + user.id);
    var message = 'User has been added to your group.';
    if (user.id == null) {
      message = 'User has been added to your group and an invite email has been sent';
    }
    
    this.dataStorageService.storeObjectParams(user, 'usergroup', this.usergroupid )
    .subscribe(
      (success: Response) => {  
        user.id = success.json().id;                
        this.users.push(user);
        this.searchusers.splice(0, 1); 
        this.searchMessage = message;
        this.message = '';
      },
      (error: Response) => {
        this.message = messages.server_error;             
      }
    );
}

onInviteUser(email: string) {
  console.log('invite user object. email is ' + email);
  var user = new User(null, email, null, null, null, null);
  this.onAddUser(user);
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
