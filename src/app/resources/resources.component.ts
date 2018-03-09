import { Component, OnInit, TemplateRef } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { NgForm } from '@angular/forms';
import { Resource } from './resources.model';
import { DataStorageService } from '../shared/data-storage.service';

@Component({
  selector: 'app-resources',
  templateUrl: './resources.component.html',
  styleUrls: ['./resources.component.css']
})
export class ResourcesComponent implements OnInit {
  
  editMode = false;

  constructor(private dataStorageService: DataStorageService) {}

  ngOnInit() {
  }

  onSubmit(form: NgForm) {
    const value = form.value;
    console.log('form submitted title is ' + value.title);

    if (this.editMode) {
      //console.log(this.editedItem.id);
      //this.userListService.saveUser(this.editedItemIndex,
      //  new User(this.editedItem.id, value.firstname, value.lastname));
    } else {
      this.dataStorageService.storeObject(new Resource('', '', value.title))

      this.editMode = false;
      form.reset();
    }

  }    

}
