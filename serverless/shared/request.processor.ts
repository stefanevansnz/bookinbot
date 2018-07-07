import { RequestExtractor } from './request.extractor';
import { ResponseModel } from './response.model';
import { DataAccessObject } from './data.access.object';
import { ResponseBuilder } from './response.builder';
import { UserAccess } from './user.access';
import { RequestValidator } from './request.validator';
import { ResourceCommand } from '../resources/resource.command';
import { ResourcesCommand } from '../resources/resources.command';
import { BookingsCommand } from '../bookings/bookings.command';
import { SharesCommand } from '../shares/shares.command';

export class RequestProcessor {

    requestExtractor: RequestExtractor;
    dataAccessObject: DataAccessObject;
    responseBuilder: ResponseBuilder;
    errorMessage: string;
    successMessage: string;
    user: any;
    userAccess: UserAccess;
    requestValidator: RequestValidator;

    constructor(requestExtractor: RequestExtractor, 
                dataAccessObject: DataAccessObject,
                responseBuilder: ResponseBuilder,
                userAccess: UserAccess,
                requestValidator: RequestValidator
            ) {
        this.requestExtractor = requestExtractor;
        this.dataAccessObject = dataAccessObject;
        this.responseBuilder = responseBuilder;
        this.userAccess = userAccess;
        this.requestValidator = requestValidator;
    }  

    chooseClass(path) {
        switch (path) {
            case 'resource':
                return new ResourceCommand(this.requestValidator, this.dataAccessObject);
            case 'resources':
                return new ResourcesCommand(this.requestValidator, this.dataAccessObject);
            case 'bookings':
                return new BookingsCommand(this.requestValidator, this.dataAccessObject);
            case 'shares':
                return new SharesCommand(this.requestValidator, this.dataAccessObject, this.userAccess);
            case 'sharessearch':
                return new SharesCommand(this.requestValidator, this.dataAccessObject, this.userAccess);

            default:
                throw new Error('path not found for ' + path); 
        }
    }

    processRequest(event, callback) {
        console.log('process request');     
        let self = this;
        let eventHolder = self.requestExtractor.buildEventHolder(event);

        let command = this.chooseClass(eventHolder.path);
        command.execute(self.responseBuilder, eventHolder, function() {
            self.buildResponse(self.responseBuilder, callback);
        });

    }

    buildResponse(responseBuilder: ResponseBuilder, callback) {
        responseBuilder.build(function(response) {
            // validation fails                    
            callback(null, response);
        });
    }



}
