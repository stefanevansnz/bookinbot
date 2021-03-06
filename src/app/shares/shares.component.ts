import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { NgForm } from '@angular/forms';
import { Share } from './shares.model';
import { Response } from "@angular/http";
import { Resource } from '../resources/resources.model';
import { DataStorageService } from '../shared/data-storage.service';
import { messages } from '../app-messages';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { AuthenticationService } from '../shared/authentication.service';
import { User } from '../shared/user.model';

declare var jQuery:any;

@Component({
  selector: 'app-shares',
  templateUrl: './shares.component.html',
  styleUrls: ['./shares.component.css']
})
export class SharesComponent implements OnInit {

  @ViewChild('f') slForm: NgForm;

  message;
  errorMessage;
  successMessage;
  searching = false;
  resourceLoading = true;
  sharesLoading = true;
  editMode = false;
  searchMode = false;
  resource: Resource;
  shares: Share[] = [];
  editShare: Share;
  editUser: User;

  private editIndex: number;
  private resourceId;  

  constructor(private authenticationService: AuthenticationService,
              private dataStorageService: DataStorageService, 
              private router: Router, 
              private route: ActivatedRoute) {}

  ngOnInit() {
    let self = this;
    this.route.params
      .subscribe(
        (params: Params) => {
          // something has changed
          let id = params['id'];
          console.log('load resource resourceId = ' + id);
          this.resourceId = id;          
          this.dataStorageService.getObjectFromServer('resource', this.resourceId, self, this.resourceLoaded);                   
        }
      );    
  }

  resourceLoaded(self) {

    jQuery("#editModal").on('hidden.bs.modal', function (e) {
      console.log('hidding');
      self.slForm.reset();
      self.errorMessage = '';
      self.successMessage = '';
      self.searchMode = true;
      self.editMode = false;
  
    })

    console.log('load shares for resource resourceId = ' + self.resourceId);
    self.dataStorageService.getObjectArrayFromServer('shares', self.resourceId, self, self.sharesLoaded);
  }

  sharesLoaded(self) {
    console.log('shares loaded');
    self.shares.forEach(function(share) {
      let subComponent = self;
      subComponent.searchMode = true; 
      self.dataStorageService.getSearchObjectArrayFromServer('sharessearch', 
          self.resourceId, share.email, subComponent, function(resultComponent) {
            let user = resultComponent.editUser;            
            if (user.status == undefined) {
              user.status = 'UNKNOWN';
            }
            console.log('user ' + share.email + ' status is ' + user.status + 
              ' user name is ' + user.firstname + ' ' + user.lastname);
            share.status = user.status;
            share.username = user.firstname + ' ' + user.lastname;
          });                   


      });

  }


  onViewBookings(index: number, share: Share) {
    console.log('onViewBookings share id ' + share.id);
    this.router.navigate(['/bookings/' + share.id]);
  }  

  onSubmit(form: NgForm) {
    const value = form.value;
    console.log('form submitted title is ' + value.email);
    let self = this; 

    if (this.searchMode) {
      console.log('search mode');
      self.searching = true;
      this.dataStorageService.getSearchObjectArrayFromServer('sharessearch', this.resourceId, value.email, self, null);          
    } else {
      // add shared user     
      let user = this.authenticationService.getUser();
      let ownername = user.firstname + ' ' + user.lastname;
      let userid = null;
      let username = null;
      let email = value.email;
      let status = null;
      if (self.editUser != null) {
        // user has been found
        console.log('found editUser from search ' + self.editUser);
        userid = self.editUser.id;
        username = self.editUser.firstname + ' ' + self.editUser.lastname;
        email = self.editUser.email;
        status = self.editUser.status;
        console.log('add shared user userid is ' + userid + ' email is ' + email);
      } else {
        console.log('cannot find editUser from search');
      }
      let share = new Share(null, null, ownername, self.resourceId, self.resource.title, userid, username, email);      
      this.dataStorageService.setObjectOnServer('shares', 'editShare', share, self, this.sharesLoaded);          
    }
  
  }

  onAddObject() {
    this.errorMessage = '';
    this.successMessage = '';
    this.searchMode = true;
    this.editMode = false;

    this.slForm.reset();
    jQuery("#editModal").modal("show");
  }  
  
  closeSetModal() { 
    jQuery("#editModal").modal("hide");
  }

  closeDeleteModal() { 
    jQuery("#editModal").modal("hide");
  }




  
  onEditObject(index: number, share: Share) {
    //console.log('onEditObject ' + index);
    this.errorMessage = '';
    this.successMessage = '';
    this.editShare = share;
    console.log('this.editShare.id is ' + this.editShare.id);
    this.editIndex = index;
    this.editMode = true;    
    this.searchMode = false;
    this.slForm.reset();

    this.slForm.setValue({
      email: share.email
    });
    jQuery("#editModal").modal("show");
    jQuery("#editModal").modal('handleUpdate')
  }  

  onReSendObject(index: number, share: Share) {
    //console.log('onEditObject ' + index);
    this.editShare = share;
    console.log('this.editShare.id is ' + this.editShare.id);
    console.log('this.editShare.email is ' + this.editShare.email);
    this.dataStorageService.getObjectArrayFromServer('sharesresend', this.editShare.email, self, null);       
  }  

  onDelete() {
    let self = this;
    var user = this.authenticationService.getUser();
    var userid = user.id;

    console.log('resource id is ' + this.resourceId);    

    let share = new Share(this.editShare.id, userid, null, this.resourceId, null, null, '', '');    
    console.log('share is ' + JSON.stringify(share));
    this.dataStorageService.deleteObjectsOnServer('shares', share, self);              
  }

  keyDownFunction(event) {
    if(event.keyCode == 13) {      
      // rest of your code
    }
  }
  

}
