import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { NgForm } from '@angular/forms';
import { Response } from "@angular/http";
import { DataStorageService } from '../shared/data-storage.service';
import { messages } from '../app-messages';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Booking } from './bookings.model';
import { environment } from '../../environments/environment';

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

  private resourceId;

  private bookings: Booking[] = [];

  constructor(private dataStorageService: DataStorageService, 
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
        }
      );

      this.dataStorageService.getObjects('bookings')
      .subscribe(
        (success: Response) => {          
          this.bookings = success.json();  
          // load calendar
          jQuery("#calendar").fullCalendar({           
            themeSystem: 'bootstrap4',
            header: {
              left: 'prev,next today',
              center: 'title',
              right: 'month,agendaWeek,agendaDay,listMonth'
            },
            nowIndicator: true,
            height: 650,
            eventClick: function(item, jsEvent, view) {
              console.log('start: ' + item.start);              
              var startItem = moment(item.start).format(self.timeFormat);
              var endItem = moment(item.end).format(self.timeFormat);
              console.log('start: ' + startItem);
              var booking = new Booking( item.id,  item.userid,  item.resourceId, startItem, endItem);
              self.onEditObject( item.id, booking);
            },            
            dayClick: function(date, jsEvent, view) {
              console.log('Clicked on: ' + date.format());
              var startItem = moment(date.format() + ' ' + self.defaultTime).format(self.timeFormat);
              var endItem = moment(date.format()).format(self.timeFormat);
              console.log('form submitted start is ' + startItem);
              console.log('form submitted end is ' + endItem);          
              var booking = new Booking( '',  '',  '', startItem, endItem);
              //_this.onEditObject( item.id, booking);
              // add object
              self.onAddObject(booking);
                  //date time picker
              
            },           
            events: function(start, end, timezone, callback) {            

              jQuery.ajax({
                url: environment.api + '/bookings',
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
                    var username = 'stefanevansnz'
                    var colour = '#378006';
                    
                    //console.log('PUSH item.start ' + item.start + ', push ' + startItem);
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

    if (this.editMode) {
      let booking = new Booking( this.editBooking.id, 
                                 this.editBooking.userid,
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
          var username = 'stefanevansnz'
          var colour = '#378006';

          jQuery('#calendar').fullCalendar('renderEvent', {
            title: username,
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
    } else {
      let booking = new Booking('', 
                                'userid', // TODO add user id from token 
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
          var username = 'stefanevansnz';
          var colour = '#378006';

          jQuery('#calendar').fullCalendar('renderEvent', {
            title: username,
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

    this.editMode = false;
    //this.slForm.reset();
    this.editBooking = booking;

    console.log('form submitted start is ' +  booking.start);
    console.log('form submitted end is ' +  booking.end); 
    
    this.slForm.setValue({
      start: booking.start,
      end: booking.end      
    });    

    //date time picker
    jQuery('#start').daterangepicker({
      timePicker: true,
      timePickerIncrement: 15,
      singleDatePicker: true,
      locale: {
          format: this.timeFormat
      }
    });
    
    //jQuery('input[name="start"]').daterangepicker();


    /*
    jQuery('#start').datetimepicker({                    
      useCurrent: false,       
      //minDate: new Date(),      
      format: this.timeFormat,
      showTodayButton: true,
      //sideBySide: true,
      //inline: true,      
      //showClose: true,
      //showClear: true,
      //toolbarPlacement: 'top',
      //stepping: 15,
      //format: 'L'
    }
    );
    jQuery('#end').datetimepicker({
      useCurrent: false,       
      //minDate: new Date(),      
      format: this.timeFormat,
      showTodayButton: true,
      //sideBySide: true,
      //inline: true,
      //showClose: true,
      //showClear: true,
      //toolbarPlacement: 'top',
      //stepping: 15
    });  
    jQuery("#start").on("change.datetimepicker", function (e) {
      jQuery('#end').datetimepicker('minDate', e.date);
      let el = document.querySelector('#start > input');
      let ev = new Event('input',{bubbles:true})
      el.dispatchEvent(ev);

    });
    jQuery("#end").on("change.datetimepicker", function (e) {
      jQuery('#start').datetimepicker('maxDate', e.date); 
      let el = document.querySelector('#end > input');
      let ev = new Event('input',{bubbles:true})
      el.dispatchEvent(ev);

    });    
    */
    
    jQuery("#editModal").modal("show");

  }    
  
  onEditObject(index: number, booking: Booking) {
    console.log('onEditObject ' + index);
    this.editBooking = booking;
    this.editIndex = index;
    this.editMode = true;
    this.slForm.setValue({
      start: booking.start,
      end: booking.end,      
    });
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
