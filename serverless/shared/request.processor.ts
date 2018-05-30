import { RequestExtractor } from './request.extractor';
import { ResponseModel } from './response.model';
import { DataAccessObject } from './data.access.object';
import { ResponseBuilder } from './response.builder';

export class RequestProcessor {

    requestExtractor: RequestExtractor;
    dataAccessObject: DataAccessObject;
    responseBuilder: ResponseBuilder;

    constructor(requestExtractor: RequestExtractor, 
                dataAccessObject: DataAccessObject,
                responseBuilder: ResponseBuilder
            ) {
        console.log('constructor');        
        this.requestExtractor = requestExtractor;
        this.dataAccessObject = dataAccessObject;
        this.responseBuilder = responseBuilder;
    }  

    processRequest(event, callback) {
        console.log('process request');     
        console.log('processRequest is ' + JSON.stringify(event))

        let authorizer = event.requestContext.authorizer;
        let username = this.requestExtractor.getUserName(authorizer);

        if (username == null) {
            console.log('username is null');
            let error = new Error('User session no longer valid');
            this.responseBuilder.build(error, null, callback);
            // return error
        } else {
            console.log('execute');
            this.dataAccessObject.execute(this.responseBuilder, this.requestExtractor, callback, event, username);
        }
    }
}
