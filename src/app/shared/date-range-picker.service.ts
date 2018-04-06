import { Injectable } from "@angular/core";

declare var jQuery:any;

@Injectable()
export class DateRangePickerService {

    private readonly timeFormat = 'DD/MM/YYYY hh:mm A';
    private readonly defaultTime = '10:00 AM';
          
    setDateRanges() {

        console.log('setDateRanges on DateRangePickerService');

        //date time picker
        jQuery('#start').daterangepicker({
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
          timePicker: true,
          timePickerIncrement: 15,
          singleDatePicker: true,
          autoApply: true,
          locale: {
              format: this.timeFormat
          }
        });    
            
        
        jQuery("#start").on("change.datetimepicker", function (e) {
          //jQuery('#end').daterangepicker('minDate', e.date);
          let el = document.querySelector('input#start');
          let ev = new Event('input',{bubbles:true})
          el.dispatchEvent(ev);
    
        });
        
        jQuery("#end").on("change.datetimepicker", function (e) {
          //jQuery('#start').daterangepicker('maxDate', e.date); 
          let el = document.querySelector('input#end');
          let ev = new Event('input',{bubbles:true})
          el.dispatchEvent(ev);
    
        });    
        
 
      }
    
}    