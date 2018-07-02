import { EventHolder } from "./event.holder";
import { ResponseBuilder } from "./response.builder";
import { DataAccessObject } from "./data.access.object";

export class RequestValidator {

    resources(response: ResponseBuilder, dataAccessObject: DataAccessObject, eventHolder: EventHolder, callback) { 
        console.log('RequestValidator resources');
        callback();
    }

    resource(response: ResponseBuilder, dataAccessObject: DataAccessObject, eventHolder: EventHolder, callback) { 
        console.log('RequestValidator resource');
        callback();
    }


    bookings(response: ResponseBuilder, dataAccessObject: DataAccessObject, eventHolder: EventHolder, callback) { 
        console.log('RequestValidator bookings path ' + eventHolder.path );

        if (eventHolder.method == 'POST') {
            console.log('Validating Booking Post');
            let validationResponse = new ResponseBuilder();
            // do a check before posting
            console.log('eventHolder ' + JSON.stringify(eventHolder));
            let object = eventHolder.object;        
      
            console.log('start is ' + object.start);  
            console.log('end is ' + object.end);                
            // get all shares for that resource
            eventHolder.method = 'GET';
            eventHolder.id = eventHolder.object.resourceid;
            dataAccessObject.bookings(validationResponse, eventHolder, function() { 
        
                // build response
                console.log('validating if booking already exists for this start ' + object.start + ' and end ' + object.end);
                let bookingsForResource = validationResponse.resultSet;
                let bookingsExists = false;
                let lastBookingUserName = '';
                bookingsForResource.forEach(booking => {
                    console.log('booking id ' + booking.id + 
                                ' start ' + booking.start + 
                                ' end ' + booking.end +
                                ' user ' + booking.username);
                    // check if already booked
                    if (object.start >= booking.start &&
                        object.end <= booking.end) {
                        console.log('bookings exist!');
                        bookingsExists = true;
                        lastBookingUserName = booking.username;
                    }
                });
                if (bookingsExists) {
                    response.errorMessage = 
                    'This resource is already booked between ' + 
                    object.start + ' and ' + object.end +
                    ' by ' + lastBookingUserName;  
                }
    
                eventHolder.method = 'POST';
                callback();
            })    
        } else {                
            callback();
        }
        
    }

    shares(response: ResponseBuilder, dataAccessObject: DataAccessObject, eventHolder: EventHolder, callback) { 
        console.log('RequestValidator method ' + eventHolder.method + ' path ' + eventHolder.path );
        callback();

    }

    sharessearch(response: ResponseBuilder, dataAccessObject: DataAccessObject, eventHolder: EventHolder, callback) { 
        //console.log('RequestValidator sharessearch method is ' + eventHolder.method);
        console.log('RequestValidator sharessearch method ' + eventHolder.method + ' path ' + eventHolder.path );

        let validationResponse = new ResponseBuilder();
        // do a search before posting
        //console.log('eventHolder ' + JSON.stringify(eventHolder));
        let email = eventHolder.email;        
  
        console.log('email is ' + email);    
        // get all shares for that resource
        dataAccessObject.shares(validationResponse, eventHolder, function() { 
    
            // build response
            console.log('validating if share already exists for this user email is ' + email);
            let sharesForResource = validationResponse.resultSet;
            //console.log('shareSearch is ' + JSON.stringify( validationResponse) );
            let emailExists = false;
            sharesForResource.forEach(share => {
                console.log('email for shard id ' + share.id +  ' is ' + share.email);
                if (share.email == email) {
                    emailExists = true;
                }
            });
            if (emailExists) {
                response.errorMessage = 'Email ' + email + ' is already shared with this resource';  
            }
            callback();
        })


        //callback();
    }

}