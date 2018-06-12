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
  editMode = false;
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
          this.dataStorageService.getObjectArrayFromServer('resources', id, self);          
        }
      );    
  }

  onViewBookings(index: number, resource: Resource) {
    console.log('onViewBookings resource id ' + resource.id);
    this.router.navigate(['/bookings/' + resource.id]);
  }
 
  onShareResource(index: number, resource: Resource) {
    console.log('onShareResource resource id ' + resource.id);
    this.router.navigate(['/shares/' + resource.id]);
  }

  onSubmit(form: NgForm) {
    const value = form.value;
    console.log('form submitted title is ' + value.title);
    let self = this; 
    let resource = new Resource(null, null, null, value.title);

    if (this.editMode) {
      console.log('edit mode');
      resource = new Resource( this.editResource.id, null, null, value.title);

    }
    this.dataStorageService.setObjectOnServer('resources', 'editResource', resource, self);          
  
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


  onEditObject(index: number, resource: Resource) {
    //console.log('onEditObject ' + index);
    this.editResource = resource;
    console.log('this.editResource.id is ' + this.editResource.id);
    this.editIndex = index;
    this.editMode = true;
    this.slForm.setValue({
      title: resource.title,
    });
    jQuery("#editModal").modal("show");
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
