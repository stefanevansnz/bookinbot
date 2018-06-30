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
        console.log('RequestValidator bookings');
        callback();
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