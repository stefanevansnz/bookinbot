import { Injectable } from "@angular/core";

declare var jQuery:any;

@Injectable()
export class DateRangePickerService {

    private readonly timeFormat = 'DD/MM/YYYY hh:mm A';
          
    setDateRanges() {

        console.log('setDateRanges on DateRangePickerService');

        var self = this;

        jQuery('div#start-icon').on("click", function () {
            jQuery('input#start').select();
        });

        jQuery('div#end-icon').on("click", function () {
            jQuery('input#end').select();
        });

        //date time picker
        jQuery('#start').daterangepicker({
          //maxDate: endDate,             
          timePicker: true,
          timePickerIncrement: 15,
          singleDatePicker: true,
          autoApply: true,
          locale: {
              format: this.timeFormat
          }
        });
    
        //date time picker
        jQuery('#end').daterangepicker({
          //minDate: startDate,            
          timePicker: true,
          timePickerIncrement: 15,
          singleDatePicker: true,
          autoApply: true,
          locale: {
              format: this.timeFormat
          }
        });    
            
        
        jQuery("#start").on("change.datetimepicker", function (e) {
          let el = document.querySelector('input#start');
          let ev = new Event('input',{bubbles:true})
          el.dispatchEvent(ev);
/*
          let date = jQuery('input#start').val();
          //jQuery('#end').daterangepicker('minDate', date); 
          
          jQuery('#end').daterangepicker({ 
            minDate: date,
            timePicker: true,
            timePickerIncrement: 15,
            singleDatePicker: true,
            autoApply: true,
            locale: {
                format: self.timeFormat
            }               
          });
 */         
  
        });
        
        jQuery("#end").on("change.datetimepicker", function (e) {
          //jQuery('#start').daterangepicker('maxDate', e.date); 
          let el = document.querySelector('input#end');
          let ev = new Event('input',{bubbles:true})
          el.dispatchEvent(ev);

          /*
          let date = jQuery('input#end').val();
          //jQuery('#start').daterangepicker('maxDate', date);           
          jQuery('#start').daterangepicker({ 
            maxDate: date,
            timePicker: true,
            timePickerIncrement: 15,
            singleDatePicker: true,
            autoApply: true,
            locale: {
                format: self.timeFormat
            }               
          });
          */
        
    
        });    
        
 
      }
    
}    