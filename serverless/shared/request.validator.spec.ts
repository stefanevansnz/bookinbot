import {mock, instance, when, verify, anyOfClass} from 'ts-mockito';
import { RequestExtractor } from './request.extractor';
import { DataAccessObject } from './data.access.object';
import { ResponseBuilder } from './response.builder';
import { RequestProcessor } from './request.processor';
import { RequestValidator } from './request.validator';

const assert = require('assert');

describe("The request validator ", function() {


  it("can validate bookings", function() {  
    let validator = new RequestValidator();       

    // bookings
    let bookingsForResource = [
      {"resourceid":"9c2ae2bc-ec9f-4d2b-80a5-5ed42654ffab",
       "start":"10/07/2018 10:00 AM","end":"11/07/2018 10:00 AM",
       "id":"da7b0c89-2f32-4149-8ac5-4c1426185829",
       "userid":"11b341d9-6df7-4bee-a353-13d689274a6a",
       "username":"Tom Tom"}
    ];

    let targetBooking;
    let description;
    let bookingsExists;
    let lastBookingUserName;
    
    description = 'Trying to book just before';
    console.log(description);
    targetBooking = {
      "userid":"11b341d9-6df7-4bee-a353-13d689274a6c",
      "start":"09/07/2018 10:00 AM",
      "end":"10/07/2018 10:00 AM"
    };    
    bookingsExists = validator.searchBookingInList(bookingsForResource, targetBooking);
    assert(!bookingsExists, description);

    description = 'Trying to book during';
    console.log(description);    
    targetBooking = {
      "userid":"11b341d9-6df7-4bee-a353-13d689274a6c",
      "start":"10/07/2018 10:00 AM",
      "end":"11/07/2018 10:00 AM"
    };    
    bookingsExists = validator.searchBookingInList(bookingsForResource, targetBooking);
    assert(bookingsExists, description);

    description = 'Trying to book just after';
    console.log(description);
    targetBooking = {
      "userid":"11b341d9-6df7-4bee-a353-13d689274a6c",
      "start":"12/07/2018 10:00 AM",
      "end":"13/07/2018 10:00 AM"
    };    
    bookingsExists = validator.searchBookingInList(bookingsForResource, targetBooking);
    assert(!bookingsExists, description);

    description = 'Trying to book one month after';
    console.log(description);
    targetBooking = {
      "userid":"11b341d9-6df7-4bee-a353-13d689274a6c",
      "start":"15/08/2018 10:00 AM",
      "end":"17/08/2018 10:00 AM"
    };    
    bookingsExists = validator.searchBookingInList(bookingsForResource, targetBooking);
    assert(!bookingsExists, description);


  });

});