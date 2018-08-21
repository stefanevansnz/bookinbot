import { DataAccessObject } from "../shared/data.access.object";
import { RequestValidator } from "../shared/request.validator";
import { ResponseBuilder } from "../shared/response.builder";

export class BookingsCommand {

    private readonly timeFormat = 'DD/MM/YYYY hh:mm A';

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
                        let startParam = eventHolder.queryStringParameters.start;
                        let endParam = eventHolder.queryStringParameters.end;  
                        //var startItem = moment(startParam).format(self.timeFormat);
                        console.log('startParam is ' + startParam + ' endParam is ' + endParam);
                        eventHolder.start = startParam;
                        eventHolder.end = endParam;                             

                        self.dataAccessObject.bookings(responseBuilder, eventHolder, function() {
                            let bookingsForResource = responseBuilder.resultSet;
                            bookingsForResource.forEach(booking => {
                                console.log('booking id ' + booking.id +  ' is ' + booking.start + ' to ' + booking.end);
                            });                
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
            this.requestValidator.checkIfOwnerOfBooking(this.dataAccessObject, eventHolder, 
                function(ownerOfBooking) {
                    if (ownerOfBooking) {
                        eventHolder.method = 'POST';
                        let validationResponse = new ResponseBuilder();
                        self.requestValidator.checkIfBookingExists(validationResponse, self.dataAccessObject, eventHolder, 
                            function(bookingsExists, lastBookingUserName) {
                                if (!bookingsExists) {
                                    eventHolder.method = 'POST';
                                    self.dataAccessObject.bookings(responseBuilder, eventHolder, function() {
                                        callback();
                                    });
                                } else {
                                    responseBuilder.errorMessage = 
                                    lastBookingUserName + ' has already booked the resource during this time' ;
                                    callback();
                                }
                            });
                    } else {
                        responseBuilder.errorMessage = 
                        'Sorry, this is not your booking to change.';
                        callback();
                    }
                });
            break; 
            case 'DELETE': 
            this.requestValidator.checkIfOwnerOfBooking(this.dataAccessObject, eventHolder, 
                function(ownerOfBooking) {
                    if (ownerOfBooking) {
                        eventHolder.method = 'DELETE';
                        self.dataAccessObject.bookings(responseBuilder, eventHolder, function() {
                            callback();
                        });
                    } else {
                        responseBuilder.errorMessage = 
                        'Sorry, you cannot delete this booking.';
                        callback();
                    }
                });
            break;         
        }

    }

}