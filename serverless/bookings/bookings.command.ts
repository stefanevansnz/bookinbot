import { DataAccessObject } from "../shared/data.access.object";
import { RequestValidator } from "../shared/request.validator";

export class BookingsCommand {

    requestValidator: RequestValidator;
    dataAccessObject: DataAccessObject;

    constructor(requestValidator: RequestValidator,
                dataAccessObject: DataAccessObject) {
        this.requestValidator = requestValidator;                    
        this.dataAccessObject = dataAccessObject;
    }

    execute(responseBuilder, eventHolder, callback) {
        console.log('BookingsCommand');
        let self = this;

        let method = eventHolder.method;
        switch (method) {
            case 'GET': 
            this.requestValidator.checkIfAccessAllowedToResource(this.dataAccessObject, eventHolder, 
                function(resourceAccessAllowed) {
                    if (resourceAccessAllowed) {
                        self.dataAccessObject.bookings(responseBuilder, eventHolder, function() {
                            callback();
                        });
                    } else {
                        responseBuilder.errorMessage = 
                        'Access not allowed';
                        callback();
                    }
                });
            break;
            case 'POST': 
            this.requestValidator.checkIfBookingExists(this.dataAccessObject, eventHolder, 
                function(bookingsExists) {
                    if (!bookingsExists) {
                        eventHolder.method = 'POST';
                        self.dataAccessObject.bookings(responseBuilder, eventHolder, function() {
                            callback();
                        });
                    } else {
                        responseBuilder.errorMessage = 
                        'This resource is already booked at that time';
                        callback();
                    }
                });
            break; 
            default:
            self.dataAccessObject.bookings(responseBuilder, eventHolder, function() {
                callback();
            });                       
        }

    }

}