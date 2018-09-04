import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { NgForm } from '@angular/forms';
import { Response } from "@angular/http";
import { DataStorageService } from '../shared/data-storage.service';
import { messages } from '../app-messages';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Booking } from './bookings.model';
import { environment } from '../../environments/environment';
import { Resource } from '../resources/resources.model';
import { AuthenticationService } from '../shared/authentication.service';
import { DateRangePickerService } from '../shared/date-range-picker.service';
import { BookingsColourPickerService } from './bookings-colour-picker.service';
import { truncate } from 'fs';

declare var jQuery:any;
declare var moment:any;
//declare var _this: any

@Component({
  selector: 'app-bookings',
  templateUrl: './bookings.component.html',
  styleUrls: ['./bookings.component.css']
})
export class BookingsComponent implements OnInit {
  
  @ViewChild('f') slForm: NgForm;
  
  message;
  errorMessage;
  editMode = false;
  resourceLoading = true;
  resourceName;
  resourceOwner;  
  resource: Resource;
  bookings: Booking[] = [];
  editBooking: Booking;
  ownerOfResource = false;
  revertFunc;
  
  private readonly displayTimeFormat = 'DD/MM/YYYY hh:mm a';
  private readonly timeFormat = 'YYYY-MM-DDTHH:mm:00';
  private readonly timeFormatEvent = 'YYYY-MM-DD HH:mm:00';  
  private readonly defaultTime = '10:00';    
  private editCalendarEvent: any;
  private resourceId;
  private ownerId;  
  
  constructor(private authenticationService: AuthenticationService,
              private dataStorageService: DataStorageService, 
              private dateRangePickerService: DateRangePickerService,
              private bookingsColourPickerService: BookingsColourPickerService,              
              private router: Router, 
              private route: ActivatedRoute) {}


  ngOnInit() {
    this.route.params
      .subscribe(
        (params: Params) => {
          // get all bookings with this booking id
          let id = params['id'];
          console.log('resourceId = ' + id);
          this.resourceId = id;

          this.loadResourceDetails();
        }
      );
  }


  private loadResourceDetails() {
    console.log('loading resource object...');
    let self = this;

    //this.resource.title = 'Loading...';
    this.dataStorageService.getSharedObjectFromServer('resource', this.resourceId, this.ownerId, self, this.loadBookingDetails);          
    
  }

  private loadBookingDetails(self) {
    console.log('loading booking objects...');
    let resource = self.resource;
    let user = self.authenticationService.getUser();

    console.log('resource ownerid is ' + resource.ownerid + ' user id is ' + user.id );
    if (resource.ownerid == user.id) {
      // this is the owner of the resource
      self.ownerOfResource = true;
    }

    self.dataStorageService.addAuthorization(function(headers) {
      let authHeader = { Authorization: headers.get('Authorization')};
    

//    console.log('headers ' + JSON.stringify(authHeader));
    
      jQuery("#calendar").fullCalendar({           
        themeSystem: 'bootstrap4',
        header: {
          left: 'title',
          //right: 'month,agendaWeek  '
          right: 'prev today next'
        },
        footer: {
          //left: 'month,listWeek,agendaWeek,agendaDay',
          left: 'month,agendaWeek,agendaDay',
          //right: 'month,agendaWeek  '
          right: 'prev today next'
        },
        nowIndicator: true,   
        editable: true,
        height: 540,
        // open booking for update
        eventClick: function(calEvent, jsEvent, view) {
          console.log('calEvent.start: ' + calEvent.start);   
          console.log('calEvent.end: ' + calEvent.end);  
          console.log('calEvent.username: ' + calEvent.username);  
          console.log('calEvent.resourceId: ' + calEvent.resourceId);  
          
          var startItem = moment(calEvent.start).format(self.timeFormatEvent);
          var endItem = moment(calEvent.end).format(self.timeFormatEvent);
          console.log('startItem: ' + startItem);   
          console.log('endItem: ' + endItem);     

          console.log('calEvent.id: ' + calEvent.id);   
          console.log('calEvent.username: ' + calEvent.username);                        
          var booking = new Booking( calEvent.id,  calEvent.userid, calEvent.username, calEvent.resourceId, startItem, endItem);
          self.onEditObject( calEvent, null, booking);
        },            
        // open booking to be created
        dayClick: function(date, jsEvent, view) {
          var inputDate = date.format();
          var inputTime = date.format(this.dateFormat) + ' ' + self.defaultTime;
          if (inputDate.length > 10) {
            inputTime = date.format(this.dateFormat);
          }
          console.log('Clicked on inputDate: ' + inputDate + ' - ' + inputDate.length);
          var startItem = moment(inputTime).format(self.timeFormat);
          var endItem = moment(inputTime).add(1, 'days').format(self.timeFormat);
          console.log('form submitted start is ' + startItem);
          console.log('form submitted end is ' + endItem);          
          var booking = new Booking(null, null, null, null, startItem, endItem);
          // add object
          self.onAddObject(booking);
          
        },  
        eventDrop: function(calEvent, delta, revertFunc) {
          let inputTime = calEvent.start.format();
          console.log(calEvent.id + " was dropped on " +inputTime);
          console.log("user id " + calEvent.userid);
          console.log("resourceId " + calEvent.resourceId);          
          var startItem = moment(inputTime).format(self.timeFormat);
          var endItem = moment(inputTime).add(1, 'days').format(self.timeFormat);
          console.log('form submitted start is ' + startItem);
          console.log('form submitted end is ' + endItem);          
          
          var booking = new Booking( calEvent.id,  calEvent.userid, calEvent.username, calEvent.resourceId, startItem, endItem);
          self.onEditObject( calEvent, revertFunc, booking);

            
        },                 
        events: function(start, end, timezone, callback) {            
          self.dataStorageService.addAuthorization(function(headers) {
            let authHeader = { Authorization: headers.get('Authorization')};

            jQuery.ajax({
              url: environment.api + '/bookings/' + self.resourceId,
              headers: authHeader,
              dataType: 'json',
              data: {
                // our hypothetical feed requires UNIX timestamps
                start: start.unix(),
                end: end.unix(),

              },
              error: function(doc) {
                console.log('error ' + JSON.stringify(doc)); 
                return;             
              },
              success: function(doc) {
                var events = [];
                console.log('Loading events...');
                var index = 0;  
                doc.forEach( function (item) {

                  var startItem = moment(item.start, self.timeFormat);
                  var endItem = moment(item.end, self.timeFormat);

                  // need to load into an object when component created                        
                  var colour = self.bookingsColourPickerService.pickBookingColour(item.username);
                    
                  console.log('PUSH startItem ' + startItem + ', item.username ' + item.username);
                  // calendar events
                  events.push({
                    index: index,
                    id: item.id,
                    title: item.username,
                    start: startItem,
                    end: endItem, 
                    color: colour                                          
                  });
                  //console.log('push bookings');
                  //self.bookings.push(new Booking( calEvent.id,  calEvent.userid, calEvent.username, calEvent.resourceId, startItem, endItem);
                  index++;
                });
                console.log('Loaded ' + index + ' event onto calendar');
                // call back with all events
                callback(events);                                          
              }
            });

          });
        }
        
      });
    });    
                    
  }

  onSubmit(form: NgForm) {
    let self = this;

    const value = form.value;
    console.log('form submitted start is ' + value.start);
    console.log('form submitted end is ' + value.end);

    console.log('this.editBooking is ' + JSON.stringify(this.editBooking));

    var user = this.authenticationService.getUser();
    var userid = user.id;
    var username = user.firstname + ' ' + user.lastname;
    
    console.log('form submitted userid is ' + userid);
    var startDate = moment(value.start, this.displayTimeFormat);
    var endDate = moment(value.end, this.displayTimeFormat);

    console.log('form startDate is ' +  startDate);
    console.log('form endDate is ' +  endDate); 

    if (startDate > endDate) {
      console.log('The start date is in front of the end date'); 
      this.errorMessage = 'The start date is in front of the end date';
      return;
    }
    startDate = startDate.format(self.timeFormat);
    endDate = endDate.format(self.timeFormat);
    console.log('form startDate is ' +  startDate);
    console.log('form endDate is ' +  endDate); 

    let booking;
    console.log('edit mode is ' + this.editMode);
    if (this.editMode) {
      //resource = new Resource( this.editResource.id, null, null, value.title);
      console.log('this.editBooking.id is ' + this.editBooking.id);
      booking = new Booking( this.editBooking.id, 
        userid,
        username,
        this.resourceId,
        startDate, 
        endDate);      
    } else {
      //let resource = new Resource(null, null, null, value.title);
      booking = new Booking(null, 
        userid,
        username,
        this.resourceId,
        startDate, 
        endDate);      
    }
    
    this.dataStorageService.setObjectOnServer('bookings', 'editBooking', booking, this, null);          
    
  }

  onShareResource(index: number, resource: Resource) {
    console.log('onShareResource resource id ' + resource.id);
    this.router.navigate(['/shares/' + resource.id]);
  }
  
  closeSetModal() { 
    console.log('editMode is ' + this.editMode);
    console.log('booking is ' + JSON.stringify(this.editBooking));
    let colour = this.bookingsColourPickerService.pickBookingColour(this.editBooking.username);
    let startDate = moment(this.editBooking.start, this.timeFormat);
    let endDate = moment(this.editBooking.end, this.timeFormat);
  
    if (this.editMode) {
      this.editCalendarEvent.start = startDate;
      this.editCalendarEvent.end = endDate;
      jQuery('#calendar').fullCalendar('updateEvent', this.editCalendarEvent);  
    } else {
      //console.log('Add booking to calender as renderEvent');
      jQuery('#calendar').fullCalendar('renderEvent', {
        title: this.editBooking.username,
        id: this.editBooking.id,
        start: startDate,
        end: endDate,
        color: colour
      });  
    }

    jQuery("#editModal").modal("hide");
  }

  onCancelModel() {
    console.log('cancel model');
    this.revertFunc();
  }

  onAddObject(booking: Booking) {
    console.log('onAddObject');
    let self = this;
    
    this.errorMessage = '';
    this.editMode = false;
    //this.slForm.reset();
    this.editBooking = booking;
    console.log('editBooking id is ' + this.editBooking.id);

    console.log('form submitted start is ' +  booking.start);
    console.log('form submitted end is ' +  booking.end); 
    
    // convert to display date using moment.
    let displayStartDate = moment(booking.start).format(self.displayTimeFormat);
    let displayEndDate = moment(booking.end).format(self.displayTimeFormat);

    console.log('form displayStartDate is ' +  displayStartDate);
    console.log('form displayEndDate is ' +  displayEndDate); 

    this.slForm.setValue({
      start: displayStartDate,
      end: displayEndDate      
    });   
    
    this.dateRangePickerService.setDateRanges();
    
    jQuery("#editModal").modal("show");

  }    


  onEditObject(calEvent, revertFunc, booking: Booking) {
    console.log('onEditObject ' + calEvent.id);
    console.log('booking start ' + booking.start);
    console.log('booking end ' + booking.end);
    console.log('booking id ' + booking.id);   

    let self = this; 

    this.errorMessage = '';
    this.editCalendarEvent = calEvent;
    this.editBooking = booking;
    this.editMode = true;
    self.revertFunc = revertFunc;

    // convert to display date using moment.
    let displayStartDate = moment(booking.start).format(self.displayTimeFormat);
    let displayEndDate = moment(booking.end).format(self.displayTimeFormat);

    console.log('form displayStartDate is ' +  displayStartDate);
    console.log('form displayEndDate is ' +  displayEndDate); 

    this.slForm.setValue({
      start: displayStartDate,
      end: displayEndDate      
    });

    this.dateRangePickerService.setDateRanges();

    jQuery("#editModal").modal("show");
  }  

  onDelete() {
    let self = this;    
    var user = this.authenticationService.getUser();
    var userid = user.id;

    console.log('userid is ' + userid);
    console.log('delete id is ' + this.editBooking.id);
    console.log('resource id is ' + this.resourceId);

    let booking = new Booking(this.editBooking.id, '', '', this.resourceId,'' ,'');    

    this.dataStorageService.deleteObjectsOnServer('bookings', booking, self);          

/*
    this.dataStorageService.deleteObject(booking, 'booking')
    .subscribe(
      (success: Response) => {          
        this.bookings.splice(this.editIndex, 1);  

        jQuery('#calendar').fullCalendar('removeEvents', 
          [this.editBooking.id]
        );

        this.message = '';
        jQuery("#editModal").modal("hide");   
      },
      (error: Response) => {
        this.message = messages.server_error;             
      }
    );
    */    
  }  

  closeDeleteModal() { 
    console.log('editMode is ' + this.editMode);
    console.log('booking is ' + JSON.stringify(this.editBooking));
    jQuery('#calendar').fullCalendar('removeEvents', 
      [this.editBooking.id]
    );    
    jQuery("#editModal").modal("hide");
  }
  

}
