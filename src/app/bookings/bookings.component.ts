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
  editMode = false;
  resourceName;
  resourceOwner;  
  resource: Resource;
  bookings: Booking[] = [];

  private readonly timeFormat = 'DD/MM/YYYY hh:mm A';
  private readonly defaultTime = '10:00 AM';  
  private editBooking: Booking;
  private editIndex: number;
  private editCalendarEvent: any;
  private resourceId;

  constructor(private authenticationService: AuthenticationService,
              private dataStorageService: DataStorageService, 
              private dateRangePickerService: DateRangePickerService,
              private bookingsColourPickerService: BookingsColourPickerService,              
              private router: Router, 
              private route: ActivatedRoute) {}

  ngOnInit() {
    var self = this;

    this.route.params
      .subscribe(
        (params: Params) => {
          // something has changed
          console.log('resourceId = ' + params['id']);
          // get all bookings with this booking id
          this.resourceId = params['id'];

          this.dataStorageService.getObject('resource', this.resourceId)
          .subscribe(
            (success: Response) => { 
              var result = success.json();
              console.log('success loading resource info');
              this.resource = result.Item;
              console.log('resource name is ' + this.resource.title);
              this.resourceName = this.resource.title;
              console.log('resource owner is ' + this.resource.ownername);
              this.resourceOwner = this.resource.ownername;


            },
            (error: Response) => {
              console.log('error is ' + messages.server_error);
              this.message = messages.server_error;             
            }
          );


        }
      );

      this.dataStorageService.getObjects('bookings', this.resourceId)
      .subscribe(
        (response: Response) => {          
          this.bookings = response.json();  
          console.log('success loading bookings info');          
          // load calendar
          jQuery("#calendar").fullCalendar({           
            themeSystem: 'bootstrap4',
            header: {
              left: 'prev title next today',
              center: '',
              right: 'month,agendaWeek,agendaDay '
            },
            nowIndicator: true,
            height: 540,
            eventClick: function(calEvent, jsEvent, view) {
              var startItem = moment(calEvent.start).format(self.timeFormat);
              var endItem = moment(calEvent.end).format(self.timeFormat);
              console.log('calEvent.id: ' + calEvent.id);   
              console.log('calEvent.username: ' + calEvent.username);                        
              var booking = new Booking( calEvent.id,  calEvent.userid, calEvent.username, calEvent.resourceId, startItem, endItem);
              self.onEditObject( calEvent, booking);
            },            
            dayClick: function(date, jsEvent, view) {
              console.log('Clicked on: ' + date.format());
              var startItem = moment(date.format() + ' ' + self.defaultTime).format(self.timeFormat);
              // add a day
              var endItem = moment(date.format() + ' ' + self.defaultTime).add(1, 'days').format(self.timeFormat);
              console.log('form submitted start is ' + startItem);
              console.log('form submitted end is ' + endItem);          
              var booking = new Booking( '',  '',  '', '',  startItem, endItem);
              // add object
              self.onAddObject(booking);
              
            },           
            events: function(start, end, timezone, callback) {            

              jQuery.ajax({
                url: environment.api + '/bookings/' + self.resourceId,
                dataType: 'json',
                data: {
                  // our hypothetical feed requires UNIX timestamps
                  start: start.unix(),
                  end: end.unix(),

                },
                success: function(doc) {
                  var events = [];
                  //console.log('loop events start = ' + start);
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
                    index++;
                  });
                  // call back with all events
                  callback(events);                                          
                }
              });
            }
          });
                      

        },
        (error: Response) => {
          this.message = messages.server_error;             
        }
      );

  }


  onSubmit(form: NgForm) {
    const value = form.value;
    console.log('form submitted start is ' + value.start);
    console.log('form submitted end is ' + value.end);

    var user = this.authenticationService.getUser();
    var userid = user.id;
    var username = user.firstname + ' ' + user.lastname;
    var colour = this.bookingsColourPickerService.pickBookingColour(username);
    
    console.log('form submitted userid is ' + userid);
    var startDate = moment(value.start, this.timeFormat);
    var endDate = moment(value.end, this.timeFormat);

    if (startDate > endDate) {
      this.message = 'The start date is in front of the end date';
      return;
    }

    if (this.editMode) {
      let booking = new Booking( this.editBooking.id, 
                                 userid,
                                 username,
                                 this.resourceId,
                                 value.start, value.end);
      this.dataStorageService.storeObject(booking, 'booking')
      .subscribe(
        (success: Response) => {          
          booking.id = success.json().id;
          this.bookings[this.editIndex] = booking;
          this.message = '';

          this.editCalendarEvent.start = startDate;
          this.editCalendarEvent.end = endDate;

          jQuery('#calendar').fullCalendar('updateEvent', this.editCalendarEvent);

          jQuery("#editModal").modal("hide");          
        },
        (error: Response) => {
          console.log('found error');
          this.message = error.json().error;             
        }
      );
    } else {
      let booking = new Booking('', 
                                userid,
                                username,
                                this.resourceId,
                                value.start, 
                                value.end);
      this.dataStorageService.storeObject(booking, 'booking')
      .subscribe(
        (success: Response) => {          
          booking.id = success.json().id;
          this.bookings.push(booking);
          this.message = '';

          jQuery('#calendar').fullCalendar('renderEvent', {
            title: username,
            id: booking.id,
            start: startDate,
            end: endDate,
            color: colour
          });

          jQuery("#editModal").modal("hide");          
        },
        (error: Response) => {
          console.log('found error');
          this.message = error.json().error;             
        }
      );
    }
  }

  onAddObject(booking: Booking) {
    console.log('onAddObject');
    this.editMode = false;
    //this.slForm.reset();
    this.editBooking = booking;
    console.log('editBooking id is ' + this.editBooking.id);

    console.log('form submitted start is ' +  booking.start);
    console.log('form submitted end is ' +  booking.end); 
    
    this.slForm.setValue({
      start: booking.start,
      end: booking.end      
    });   
    
    this.dateRangePickerService.setDateRanges();
    
    jQuery("#editModal").modal("show");

  }    
  
  onEditObject(calEvent, booking: Booking) {
    console.log('onEditObject ' + calEvent.id);
    console.log('booking start ' + booking.start);
    console.log('booking end ' + booking.end);

    this.editCalendarEvent = calEvent;
    this.editBooking = booking;
    this.editIndex = calEvent.id;
    this.editMode = true;
    this.slForm.setValue({
      start: booking.start,
      end: booking.end,      
    });

    this.dateRangePickerService.setDateRanges();

    jQuery("#editModal").modal("show");
  }  

  onDelete() {
    var user = this.authenticationService.getUser();
    var userid = user.id;

    console.log('userid is ' + userid);
    console.log('delete id is ' + this.editBooking.id);
    console.log('resource id is ' + this.resourceId);

    let booking = new Booking(this.editBooking.id, userid, '', this.resourceId,'' ,'');    

    this.dataStorageService.deleteObject(booking)
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
  }  

}
