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

@Component({
  selector: 'app-bookings',
  templateUrl: './bookings.component.html',
  styleUrls: ['./bookings.component.css']
})
export class BookingsComponent implements OnInit {
  
  @ViewChild('f') slForm: NgForm;

  //private readonly timeFormat = 'DD/MM/YYYY hh:mm a';
  private readonly timeFormat = 'DD/MM/YYYY';

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
            eventClick: function(item, jsEvent, view) {
              console.log('start: ' + item.start);              
              var startItem = moment(item.start).format(_this.timeFormat);
              var endItem = moment(item.end).format(_this.timeFormat);
              console.log('start: ' + startItem);
              var booking = new Booking( item.id,  item.userid,  item.resourceId, startItem, endItem);
              _this.onEditObject( item.id, booking);
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

                    var startItem = moment(item.start, _this.timeFormat);
                    var endItem = moment(item.end, _this.timeFormat);

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

  onAddObject() {
    this.editMode = false;
    this.slForm.reset();

    jQuery('#start').datetimepicker({                    
      useCurrent: false,       
      minDate: new Date(),      
      format: this.timeFormat,
      showTodayButton: true,
      sideBySide: true,
      showClose: true,
      showClear: true,
      toolbarPlacement: 'top',
      stepping: 15,
      //format: 'L'
    }
    );
    jQuery('#end').datetimepicker({
      useCurrent: false,       
      minDate: new Date(),      
      format: this.timeFormat,
      showTodayButton: true,
      sideBySide: true,
      showClose: true,
      showClear: true,
      toolbarPlacement: 'top',
      stepping: 15
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
