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

  private readonly timeFormat = 'DD/MM/YYYY hh:mm A';
  private readonly defaultTime = '10:00 AM';

  private message;

  private editMode = false;
  private editBooking: Booking;
  private editIndex: number;

  private editCalendarEvent: any;

  private resourceId;
  private resourceName;
  private resourceOwner;  
  private resource: Resource;

  private bookings: Booking[] = [];

  constructor(private authenticationService: AuthenticationService,
              private dataStorageService: DataStorageService, 
              private dateRangePickerService: DateRangePickerService,
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
              this.resource = result.Item;
              console.log('resource name is ' + this.resource.title);
              this.resourceName = this.resource.title;
              console.log('resource owner is ' + this.resource.ownerid);
              this.resourceOwner = this.resource.ownerid; 

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
        (success: Response) => {          
          this.bookings = success.json();  
          // load calendar
          jQuery("#calendar").fullCalendar({           
            themeSystem: 'bootstrap4',
            header: {
              left: 'prev',
              center: 'title',
              right: 'next'
            },
            nowIndicator: true,
            height: 540,
            eventClick: function(calEvent, jsEvent, view) {
              var startItem = moment(calEvent.start).format(self.timeFormat);
              var endItem = moment(calEvent.end).format(self.timeFormat);
              console.log('item.id: ' + calEvent.id);
              var booking = new Booking( calEvent.id,  calEvent.userid,  calEvent.resourceId, startItem, endItem);
              self.onEditObject( calEvent, booking);
            },            
            dayClick: function(date, jsEvent, view) {
              console.log('Clicked on: ' + date.format());
              var startItem = moment(date.format() + ' ' + self.defaultTime).format(self.timeFormat);
              // add a day
              var endItem = moment(date.format() + ' ' + self.defaultTime).add(1, 'days').format(self.timeFormat);
              console.log('form submitted start is ' + startItem);
              console.log('form submitted end is ' + endItem);          
              var booking = new Booking( '',  '',  '', startItem, endItem);
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
                  end: end.unix()
                },
                success: function(doc) {
                  var events = [];
                  //console.log('loop events start = ' + start);
                  var index = 0;  
                  doc.forEach( function (item) {

                    var startItem = moment(item.start, self.timeFormat);
                    var endItem = moment(item.end, self.timeFormat);

                    // need to load into an object when component created
                    var username = item.userid;
                    var colour = '#378006';
                    
                    console.log('PUSH item.start ' + item.start + ', username ' + username);
                    // calendar events
                    events.push({
                      index: index,
                      id: item.id,
                      title: username,
                      start: startItem,
                      end: endItem, 
                      color: colour                                          
                    });
                    index++;
                  });
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
    var userid = user.username;
    console.log('form submitted userid is ' + userid);

    if (this.editMode) {
      let booking = new Booking( this.editBooking.id, 
                                 userid,
                                 this.resourceId,
                                 value.start, value.end);
      this.dataStorageService.storeObject(booking)
      .subscribe(
        (success: Response) => {          
          booking.id = success.json().id;
          this.bookings[this.editIndex] = booking;
          this.message = '';

          var startDate = moment(value.start, this.timeFormat);
          var endDate = moment(value.end, this.timeFormat);

          // need to load into an object when component created
          var username = userid;
          var colour = '#378006';

          this.editCalendarEvent.start = startDate;
          this.editCalendarEvent.end = endDate;

          jQuery('#calendar').fullCalendar('updateEvent', this.editCalendarEvent);

          jQuery("#editModal").modal("hide");          
        },
        (error: Response) => {
          console.log('error ' + messages.server_error)
          this.message = messages.server_error;             
        }
      );
    } else {
      let booking = new Booking('', 
                                userid,
                                this.resourceId, 
                                value.start, 
                                value.end);
      this.dataStorageService.storeObject(booking)
      .subscribe(
        (success: Response) => {          
          booking.id = success.json().id;
          this.bookings.push(booking);
          this.message = '';

          var startDate = moment(value.start, this.timeFormat);
          var endDate = moment(value.end, this.timeFormat);

          // need to load into an object when component created
          var username = userid;
          var colour = '#378006';

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
          this.message = messages.server_error;             
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

    let booking = new Booking(this.editBooking.id, '', '','' ,'');    
    console.log('delete id is ' + this.editBooking.id);

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
