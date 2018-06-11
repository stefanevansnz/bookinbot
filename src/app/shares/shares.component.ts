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

declare var jQuery:any;

@Component({
  selector: 'app-shares',
  templateUrl: './shares.component.html',
  styleUrls: ['./shares.component.css']
})
export class SharesComponent implements OnInit {

  @ViewChild('f') slForm: NgForm;

  messageModal;
  loading = true;
  headingLoading = true;
  editMode = false;
  resource: Resource;
  shares: Share[] = [];
  editShare: Share;

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
          this.dataStorageService.getObjectsFromServer('resource', this.resourceId, self);                   
          this.dataStorageService.getObjectsFromServer('shares', id, self);          
        }
      );    
  }

  onViewBookings(index: number, share: Share) {
    console.log('onViewBookings share id ' + share.id);
    this.router.navigate(['/bookings/' + share.id]);
  }

  onSubmit(form: NgForm) {
    const value = form.value;
    console.log('form submitted title is ' + value.email);
    let self = this; 
    let share = new Share(null, null, null, value.email, null);

    if (this.editMode) {
      console.log('edit mode');
      share = new Share( this.editShare.id, null, null, value.email, null);

    }
    this.dataStorageService.setObjectOnServer('shares', 'editShare', share, self);          
  
  }

  onAddObject() {
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
    this.editShare = share;
    console.log('this.editShare.id is ' + this.editShare.id);
    this.editIndex = index;
    this.editMode = true;
    this.slForm.setValue({
      title: share.userid,
    });
    jQuery("#editModal").modal("show");
  }  

  onDelete() {
    let self = this;
    var user = this.authenticationService.getUser();
    var userid = user.id;

    let share = new Share(this.editShare.id, userid, '', '', '');    
    console.log('share is ' + JSON.stringify(share));
    this.dataStorageService.deleteObjectsOnServer('shares', share, self);              
  }

  keyDownFunction(event) {
    if(event.keyCode == 13) {      
      // rest of your code
    }
  }
  

}
