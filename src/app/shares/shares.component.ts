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
  messageModal;
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
          console.log('resourceId = ' + id);
          this.resourceId = id;          
          console.log('id = ' + id); 
          this.dataStorageService.getObjectFromServer('resource', this.resourceId, self);                   
          this.dataStorageService.getObjectArrayFromServer('shares', id, self);          
        }
      );    
  }
/*
  onViewBookings(index: number, share: Share) {
    console.log('onViewBookings share id ' + share.id);
    this.router.navigate(['/bookings/' + share.id]);
  }
*/
  onSubmit(form: NgForm) {
    const value = form.value;
    console.log('form submitted title is ' + value.email);
    let self = this; 

    if (this.searchMode) {
      console.log('search mode');
      self.searching = true;
      this.dataStorageService.getObjectArrayFromServer('sharessearch', value.email, self);          
    } else {
      // add shared user
      let userid = null;
      let email = value.email;
      if (self.editUser != null) {
        // user has been found
        console.log('found editUser from search ' + JSON.stringify(self.editUser));
        userid = self.editUser.id;
        email = self.editUser.email;
      }
      console.log('add shared user userid is ' + userid + ' email is ' + email);
      let share = new Share(null, null, self.resourceId ,userid, email);
      this.dataStorageService.setObjectOnServer('shares', 'editShare', share, self);          
    }
  
  }

  onAddObject() {
    this.messageModal = '';
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
    this.messageModal = '';
    this.successMessage = '';
    this.editShare = share;
    console.log('this.editShare.id is ' + this.editShare.id);
    this.editIndex = index;
    this.editMode = true;    
    this.searchMode = false;
    this.slForm.setValue({
      email: share.email
    });
    jQuery("#editModal").modal("show");
  }  

  onReSendObject(index: number, share: Share) {
    //console.log('onEditObject ' + index);
    this.editShare = share;
    console.log('this.editShare.id is ' + this.editShare.id);
    console.log('this.editShare.email is ' + this.editShare.email);
    this.dataStorageService.getObjectArrayFromServer('sharesresend', this.editShare.email, self);          
  }  

  onDelete() {
    let self = this;
    var user = this.authenticationService.getUser();
    var userid = user.id;

    console.log('resource id is ' + this.resourceId);    

    let share = new Share(this.editShare.id, userid, this.resourceId, '', '');    
    console.log('share is ' + JSON.stringify(share));
    this.dataStorageService.deleteObjectsOnServer('shares', share, self);              
  }

  keyDownFunction(event) {
    if(event.keyCode == 13) {      
      // rest of your code
    }
  }
  

}
