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

  private message;

  private editMode = false;
  private editResource: Resource;
  private editIndex: number;

  private resources: Resource[] = [];

  constructor(private authenticationService: AuthenticationService,
              private dataStorageService: DataStorageService, 
              private router: Router, 
              private route: ActivatedRoute) {}

  ngOnInit() {

    this.route.params
      .subscribe(
        (params: Params) => {
          // something has changed
          console.log('id = ' + params['id']);
          this.initForm();
          this.dataStorageService.getObjects('resources', null)
          .subscribe(
            (success: Response) => {          
              this.resources = success.json()         
            },
            (error: Response) => {
              this.message = error.text();             
            }
          );          
        }
      );


    
  }


  private initForm() {  }  


  onViewBookings(index: number, resource: Resource) {
    console.log('onViewBookings resource id ' + resource.id);
    this.router.navigate(['/bookings/' + resource.id]);
  }

  onSubmit(form: NgForm) {
    const value = form.value;
    console.log('form submitted title is ' + value.title);

    var user = this.authenticationService.getUser();
    var ownerid = user.id;
    console.log('form submitted owner id is ' + ownerid);
    var ownername = user.firstname + ' ' + user.lastname;
    console.log('form submitted owner name is ' + ownername);    

    if (this.editMode) {
      let resource = new Resource( this.editResource.id, null, null, value.title);
      this.dataStorageService.storeObject(resource)
      .subscribe(
        (success: Response) => {          
          resource.id = success.json().id;
          this.resources[this.editIndex] = resource;
          this.message = '';
          jQuery("#editModal").modal("hide");          
        },
        (error: Response) => {
          this.message = error.text();             
        }
      );
    } else {
      let resource = new Resource(null, null, null, value.title);
      this.dataStorageService.storeObject(resource)
      .subscribe(
        (success: Response) => {          
          resource.id = success.json().id;
          this.resources.push(resource);
          this.message = '';
          jQuery("#editModal").modal("hide");          
        },
        (error: Response) => {
          this.message = error.text();             
        }
      );
    }
  }

  onAddObject() {
    this.editMode = false;
    this.slForm.reset();
    jQuery("#editModal").modal("show");
  }    
  
  onEditObject(index: number, resource: Resource) {
    //console.log('onEditObject ' + index);
    this.editResource = resource;
    this.editIndex = index;
    this.editMode = true;
    this.slForm.setValue({
      title: resource.title,
    });
    jQuery("#editModal").modal("show");
  }  

  onDelete() {

    let resource = new Resource(this.editResource.id, '', '', '');    
    console.log('delete id is ' + this.editResource.id);

    this.dataStorageService.deleteObject(resource)
    .subscribe(
      (success: Response) => {          
        this.resources.splice(this.editIndex, 1);        
        this.message = '';
        jQuery("#editModal").modal("hide");          
      },
      (error: Response) => {
        this.message = error.text();           
      }
    );    
  }

}
