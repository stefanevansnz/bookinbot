import { EventHolder } from "./event.holder";
import { ResponseBuilder } from "./response.builder";
import { DataAccessObject } from "./data.access.object";

export class RequestValidator {

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


    checkIfBookingExists(dataAccessObject: DataAccessObject, eventHolder: EventHolder, callback) { 
        console.log('RequestValidator bookings path ' + eventHolder.path );
        let bookingsExists = false;
        console.log('Validating Booking Post');
        let validationResponse = new ResponseBuilder();
        // do a check before posting
        console.log('eventHolder ' + JSON.stringify(eventHolder));
        let object = eventHolder.object;        
    
        console.log('start is ' + object.start);  
        console.log('end is ' + object.end);

        // get all shares for that resource
        eventHolder.id = eventHolder.object.resourceid;
        eventHolder.method = 'GET';
        dataAccessObject.bookings(validationResponse, eventHolder, function() {         
            // build response
            console.log('validating if booking already exists for this start ' + object.start + ' and end ' + object.end);
            let bookingsForResource = validationResponse.resultSet;
            let lastBookingUserName = '';
            bookingsForResource.forEach(booking => {
                console.log('booking id ' + booking.id + 
                            ' start ' + booking.start + 
                            ' end ' + booking.end +
                            ' user ' + booking.username);
                // check if already booked
                if ((object.start >= booking.start && object.start <= booking.start) ||
                    (object.end >= booking.end && object.end <= booking.end)) {
                    console.log('bookings exist!');
                    bookingsExists = true;
                    lastBookingUserName = booking.username;
                }
            });

            callback(bookingsExists, lastBookingUserName);
        });    
        
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