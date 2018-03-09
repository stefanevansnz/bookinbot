import { Component, OnInit, TemplateRef } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { NgForm } from '@angular/forms';
import { Resource } from './resources.model';
import { Response } from "@angular/http";
import { DataStorageService } from '../shared/data-storage.service';
import { messages } from '../app-messages';

declare var jQuery:any;

@Component({
  selector: 'app-resources',
  templateUrl: './resources.component.html',
  styleUrls: ['./resources.component.css']
})
export class ResourcesComponent implements OnInit {
  
  private message;

  private editMode = false;
  private resources: Resource[] = [];

  constructor(private dataStorageService: DataStorageService) {}

  ngOnInit() {
    this.dataStorageService.getObjects('resources')
    .subscribe(
      (success: Response) => {          
        this.resources = success.json()         
      },
      (error: Response) => {
        this.message = messages.server_error;             
      }
    );   
  }

  onSubmit(form: NgForm) {
    const value = form.value;
    console.log('form submitted title is ' + value.title);

    if (this.editMode) {
      //console.log(this.editedItem.id);
      //this.userListService.saveUser(this.editedItemIndex,
      //  new User(this.editedItem.id, value.firstname, value.lastname));
    } else {
      let resource = new Resource('', '', value.title);
      this.dataStorageService.storeObject(resource)
      .subscribe(
        (success: Response) => {          
          resource.id = success.json().id;
          this.resources.push(resource);
          this.message = '';
          jQuery("#editModal").modal("hide");          
        },
        (error: Response) => {
          this.message = messages.server_error;             
        }
      );


      
      //this.message = 'sdfdsf';
      //this.editMode = false;
      //form.reset();
    }

  }    

}
