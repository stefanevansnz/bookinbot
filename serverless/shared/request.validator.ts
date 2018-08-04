import { EventHolder } from "./event.holder";
import { ResponseBuilder } from "./response.builder";
import { DataAccessObject } from "./data.access.object";

export class RequestValidator {

    checkIfOwnerOfBooking(dataAccessObject: DataAccessObject, eventHolder: EventHolder, callback) {
        // is this user the owner of the booking
        console.log('Check checkIfOwnerOfBooking');
        //console.log('Resource Path is ' + eventHolder.path);
        let validationResponse = new ResponseBuilder();
        //eventHolder.id = null;
        console.log('eventHolder ' + JSON.stringify(eventHolder));
        let userSessionId = eventHolder.userSessionId;   
        let bookingOwnedByUser = false;   
        let bookingId = eventHolder.object.id;
  
        console.log('Get booking for this user');
        eventHolder.method = 'GET'; 
        eventHolder.id = eventHolder.object.resourceid;
       
        dataAccessObject.bookings(validationResponse, eventHolder, function() { 
            console.log('validating if booking is owned by user id ' + userSessionId );
            let bookingsForResource = validationResponse.resultSet;
            bookingsForResource.forEach(booking => {
                if (bookingId == booking.id) {
                    console.log('booking id ' + booking.id + 
                    ' booking userid is ' + booking.userid);
                    // check if already booked
                    if (userSessionId == booking.userid) {
                        console.log('booking owner found!');
                        bookingOwnedByUser = true;
                    }

                }
            });

            callback(bookingOwnedByUser);
        });

    }


    checkIfOwnerOfResource(dataAccessObject: DataAccessObject, eventHolder: EventHolder, callback) {
        // is this user allowed access to this resource?
        console.log('Check checkIfOwnerOfResource');
        //console.log('Resource Path is ' + eventHolder.path);
        let resourceId = eventHolder.id;
        let validationResponse = new ResponseBuilder();
        //eventHolder.id = null;
  
        // get all shares for this user
        console.log('Get resource for this user');
        dataAccessObject.resources(validationResponse, eventHolder, function() { 
            console.log('Got response for resource');
            if (validationResponse.resultSet.length > 0) {                    
                console.log('Resource is owned by this user');
                callback(true);
                return;
            } else {
                console.log('Resource is not owned by this user');
                callback(false);
                return;
            }

        });

    }



    checkIfAccessAllowedToResource(dataAccessObject: DataAccessObject, eventHolder: EventHolder, callback) {
        // is this user allowed access to this resource?
        console.log('Check ResourceAccessAllowed');
        //console.log('Resource Path is ' + eventHolder.path);
        let resourceId = eventHolder.id;
        let validationResponse = new ResponseBuilder();
        let resourceAccessAllowed = false;
        let resourceOwnerId = null;
        //eventHolder.id = null;
  
        // get all shares for this user
        console.log('Get resource for this user');
        dataAccessObject.resources(validationResponse, eventHolder, function() { 
            console.log('Got response for resource');
            if (validationResponse.resultSet.length > 0) {                    
                console.log('Resource is owned by this user');
                callback(true);
                return;
            } 
            console.log('Get all shares for this user');
            dataAccessObject.shares(validationResponse, eventHolder, function() { 
                // build response
                //console.log('validating if resource id ' + resourceId + ' is shared with current user ' + eventHolder.userSessionId);
                let sharesForResource = validationResponse.resultSet;
                //console.log('shareSearch is ' + JSON.stringify( validationResponse) );
                sharesForResource.forEach(share => {
                    console.log('User ' + share.ownerid + ' is sharing ' + share.resourceid +  ' with current user ' +  eventHolder.userSessionId);
                    if (share.resourceid == resourceId) {
                        resourceAccessAllowed = true; 
                        resourceOwnerId = share.ownerid;
                    }
                });
                console.log('ResourceAccessAllowed is ' + resourceAccessAllowed);
                console.log('resourceOwnerId is ' + resourceOwnerId);

                callback(resourceAccessAllowed, resourceOwnerId);
            })    

        });

    }


    checkIfBookingExists(validationResponse: ResponseBuilder, dataAccessObject: DataAccessObject, eventHolder: EventHolder, callback) { 
        let self = this;
        console.log('RequestValidator bookings path ' + eventHolder.path );
        console.log('Validating Booking Post');
        // do a check before posting
        console.log('eventHolder ' + JSON.stringify(eventHolder));
        let targetBooking = eventHolder.object;       
    
        console.log('target start is ' + targetBooking.start);  
        console.log('target end is ' + targetBooking.end);
        console.log('target userid is ' + targetBooking.userid); 

        // get all shares for that resource
        eventHolder.id = eventHolder.object.resourceid;
        eventHolder.method = 'GET';
        
        dataAccessObject.bookings(validationResponse, eventHolder, function() {         
            // build response
            let bookingsForResource = validationResponse.resultSet;
            let {bookingsExists, lastBookingUserName} = self.searchBookingInList(bookingsForResource, targetBooking);
            console.log('lastBookingUserName is ' + lastBookingUserName);
            callback(bookingsExists, lastBookingUserName);
        });    
        
    }

    searchBookingInList(bookingsForResource, targetBooking) {
        let bookingsExists = false;
        let lastBookingUserName = '';
        console.log('validating if target booking already exists for this start ' + targetBooking.start + ' and end ' + targetBooking.end);
        bookingsForResource.forEach(booking => {
            console.log('booking id ' + booking.id + 
                        ' start ' + booking.start + 
                        ' end ' + booking.end +
                        ' username ' + booking.username + 
                        ' userid ' + booking.userid );
            // check if already booked
            if ((targetBooking.start >= booking.start && targetBooking.start < booking.end) ||
                (targetBooking.end > booking.start && targetBooking.end <= booking.end) &&
                (targetBooking.userid != booking.userid)) {
                console.log('booking is taken!');
                bookingsExists = true;
                lastBookingUserName = booking.username;
                console.log('lastBookingUserName is ' + lastBookingUserName);
            }
        });
        return { bookingsExists, lastBookingUserName};
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