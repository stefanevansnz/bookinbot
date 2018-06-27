import { RequestExtractor } from './request.extractor';
import { ResponseModel } from './response.model';
import { DataAccessObject } from './data.access.object';
import { ResponseBuilder } from './response.builder';
import { UserAccess } from './user.access';
import { RequestValidator } from './request.validator';

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

    processRequest(event, callback) {
        console.log('process request');     
        let self = this;
        let eventHolder = self.requestExtractor.buildEventHolder(event);

        let method = eventHolder.path;

        // apply validation checks    
        console.log('1. Validate');        
        self.requestValidator[method](function() {                    
        // apply user updates
        console.log('2. User Admin Access');        
        self.userAccess[method](self.responseBuilder, eventHolder, function() {
        // execute data command
        console.log('3. Database Access');        
        self.dataAccessObject[method](self.responseBuilder, eventHolder, function() {
            // build response
            self.responseBuilder.build(function(response) {
            // call callback to return lambda
            callback(null, response);
        })})})});
    }
}
