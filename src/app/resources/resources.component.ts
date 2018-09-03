import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { NgForm } from '@angular/forms';
import { Resource } from './resources.model';
import { Response } from "@angular/http";
import { DataStorageService } from '../shared/data-storage.service';
import { messages } from '../app-messages';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { AuthenticationService } from '../shared/authentication.service';

declare var jQuery:any;

@Component({
  selector: 'app-resources',
  templateUrl: './resources.component.html',
  styleUrls: ['./resources.component.css']
})
export class ResourcesComponent implements OnInit {

  @ViewChild('f') slForm: NgForm;

  message;
  resourcesLoading = true;
  sharesLoading = true;
  editMode = false;
  sureOfDelete = false;
  resources: Resource[] = [];
  editResource: Resource;

  private editIndex: number;

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
          console.log('id = ' + id);          
          this.dataStorageService.getObjectArrayFromServer('resources', id, self, self.successfullLoad);
        }
      );    
  }

  successfullLoad(self) {
    jQuery("#editModal").on('hidden.bs.modal', function (e) {
      console.log('hidding');
      self.slForm.reset();
      self.errorMessage = '';
      self.successMessage = '';
      self.editMode = false;
  
    })

    console.log('load shares');
    self.dataStorageService.getObjectArrayFromServer('shares', null, self, null);          
  }


  onViewBookings(index: number, resource: Resource) {
    console.log('onViewBookings resource id ' + resource.id);
    this.router.navigate(['/bookings/' + resource.id]);
  }

  onViewShareBookings(index: number, resourceid: string) {
    console.log('onViewBookings resource id ' + resourceid);
    this.router.navigate(['/bookings/' + resourceid]);
  }


  onAddObject() {
    this.editMode = false;
    this.slForm.reset();
    this.sureOfDelete = false;  
    this.message = '';      
    jQuery("#editModal").modal("show");
  }  
  
  closeSetModal() { 
    console.log('closeSetModal');
    jQuery("#editModal").modal("hide");
    this.slForm.reset();    
    this.sureOfDelete = false;    
  }

  closeDeleteModal() { 
    console.log('closeDeleteModal');
    jQuery("#editModal").modal("hide");
    this.slForm.reset();    
    this.sureOfDelete = false;    
  }


  onEditObject(index: number, resource: Resource) {
    //console.log('onEditObject ' + index);
    this.slForm.resetForm();   

    this.editResource = resource;
    console.log('this.editResource.id is ' + this.editResource.id);
    this.editIndex = index;
    this.editMode = true;
    this.sureOfDelete = false;    

    this.message = '';

    /*
    if (resource.title != undefined) {
      this.slForm.controls['title'].setValue(resource.title);
    }
    */

    this.slForm.setValue({
      title: resource.title
    });    
  
    jQuery("#editModal").modal("show");
  }  

  onDeleteSure() {
    console.log('onDeleteSure');
    this.sureOfDelete = true;
  }


  onSubmit(form: NgForm) {
    const value = form.value;
    console.log('sureOfDelete is ' + this.sureOfDelete);
    let self = this; 

    if (this.sureOfDelete) {
      console.log('form submitted suredelete is ' + value.suredelete);
      if (value.suredelete == 'DELETE') {
        this.onDelete();
      } else {
        this.message = 'Type DELETE in the field above.';
      }
    } else {
      console.log('form submitted title is ' + value.title);

      let resource = new Resource(null, null, null, value.title);
  
      if (this.editMode) {
        console.log('edit mode');
        resource = new Resource( this.editResource.id, null, null, value.title);
  
      }
      this.dataStorageService.setObjectOnServer('resources', 'editResource', resource, self, null);            
    }
  
  }


  onDelete() {
    let self = this;
    var user = this.authenticationService.getUser();
    var userid = user.id;

    let resource = new Resource(this.editResource.id, userid, '', '');    
    console.log('resource is ' + JSON.stringify(resource));
    this.dataStorageService.deleteObjectsOnServer('resources', resource, self);              
  }

}
