import {mock, instance, when, verify, anyOfClass} from 'ts-mockito';
import { RequestValidator } from './request.validator';

const assert = require('assert');

describe("The request validator", function() {


  it("can validate bookings", function() {  
    let validator = new RequestValidator();       

    // bookings
    let bookingsForResource = [
      {"resourceid":"9c2ae2bc-ec9f-4d2b-80a5-5ed42654ffab",
       "start":"2018-08-08T10:00:00","end":"2018-08-09T10:00:00",
       "id":"da7b0c89-2f32-4149-8ac5-4c1426185829",
       "userid":"11b341d9-6df7-4bee-a353-13d689274a6a",
       "username":"Tom Tom"},
      {"resourceid":"9c2ae2bc-ec9f-4d2b-80a5-5ed42654ffab",
       "start":"2018-10-08T10:00:00","end":"2018-11-09T10:00:00",
       "id":"da7b0c89-2f32-4149-8ac5-4c1426185830",
       "userid":"11b341d9-6df7-4bee-a353-13d689274a6a",
       "username":"Tom Tom"}       
    ];

    let targetBooking;
    let description;
    let testResult;
    
    targetBooking = {
      "id":"da7b0c89-2f32-4149-8ac5-4c1426185829",
      "userid":"11b341d9-6df7-4bee-a353-13d689274a6c",
      "start":"2018-08-07T10:00:00","end":"2018-08-08T10:00:00"
    };    
    testResult = validator.searchBookingInList(bookingsForResource, targetBooking);
    assert(!testResult.bookingsExists, 'A booking does not exist just before a current booking');

    targetBooking = {
      "id":"da7b0c89-2f32-4149-8ac5-4c1426185830",
      "userid":"11b341d9-6df7-4bee-a353-13d689274a6c",
      "start":"2018-08-08T10:00:00","end":"2018-08-09T10:00:00"
    };    
    testResult = validator.searchBookingInList(bookingsForResource, targetBooking);
    assert(testResult.bookingsExists, 'A booking does exist during a current booking if different booking');

    targetBooking = {
      "id":"da7b0c89-2f32-4149-8ac5-4c1426185829",
      "userid":"11b341d9-6df7-4bee-a353-13d689274a6c",
      "start":"2018-08-09T10:00:00","end":"2018-08-10T10:00:00"
    };    
    testResult = validator.searchBookingInList(bookingsForResource, targetBooking);
    assert(!testResult.bookingsExists, 'A booking does not exist just after a current booking');

    targetBooking = {
      "id":"da7b0c89-2f32-4149-8ac5-4c1426185829",
      "userid":"11b341d9-6df7-4bee-a353-13d689274a6c",
      "start":"2018-09-09T10:00:00","end":"2018-09-10T10:00:00"
    };    
    testResult = validator.searchBookingInList(bookingsForResource, targetBooking);
    assert(!testResult.bookingsExists, 'A booking does not exist one month after a current booking');

    // just inside
    targetBooking = {
      "id":"da7b0c89-2f32-4149-8ac5-4c1426185830",
      "userid":"11b341d9-6df7-4bee-a353-13d689274a6c",
      "start":"2018-08-08T11:00:00","end":"2018-08-08T13:00:00"
    };    
    testResult = validator.searchBookingInList(bookingsForResource, targetBooking);
    assert(testResult.bookingsExists, 'A booking does exist inside a current booking if different booking');

    // same booking bit shorter
    targetBooking = {
      "id":"da7b0c89-2f32-4149-8ac5-4c1426185829",
      "userid":"11b341d9-6df7-4bee-a353-13d689274a6c",
      "start":"2018-08-08T11:00:00","end":"2018-08-08T13:00:00"
    };    
    testResult = validator.searchBookingInList(bookingsForResource, targetBooking);
    assert(!testResult.bookingsExists, 'A booking can be change to be a bit smaller');

    // same booking bit a moved back a bit
    targetBooking = {
      "id":"da7b0c89-2f32-4149-8ac5-4c1426185829",
      "userid":"11b341d9-6df7-4bee-a353-13d689274a6c",
      "start":"2018-08-08T13:00:00","end":"2018-08-09T23:00:00"
    };    
    testResult = validator.searchBookingInList(bookingsForResource, targetBooking);
    assert(!testResult.bookingsExists, 'A booking can be change to be moved back a bit');

    // same booking bit a moved forward a bit
    targetBooking = {
      "id":"da7b0c89-2f32-4149-8ac5-4c1426185829",
      "userid":"11b341d9-6df7-4bee-a353-13d689274a6c",
      "start":"2018-08-08T09:00:00","end":"2018-08-09T09:00:00"
    };    
    testResult = validator.searchBookingInList(bookingsForResource, targetBooking);
    assert(!testResult.bookingsExists, 'A booking can be change to be moved forward a bit');


  });

});