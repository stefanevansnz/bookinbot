import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { NgForm } from '@angular/forms';
import { Response } from "@angular/http";
import { DataStorageService } from '../shared/data-storage.service';
import { messages } from '../app-messages';
import { Router, ActivatedRoute, Params } from '@angular/router';

@Component({
  selector: 'app-bookings',
  templateUrl: './bookings.component.html',
  styleUrls: ['./bookings.component.css']
})
export class BookingsComponent implements OnInit {
  
  constructor(private dataStorageService: DataStorageService, 
    private router: Router, 
    private route: ActivatedRoute) {}

  ngOnInit() {
    this.route.params
      .subscribe(
        (params: Params) => {
          // something has changed
          console.log('id = ' + params['id']);
          this.initForm();
        }
      );
  }

  private initForm() {  }    

}
