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

    processRequest(body, authorizer, method, callback) {
        console.log('process request');        
        let username = this.requestExtractor.getUserName(authorizer);
        let object = this.requestExtractor.getObject(body);
        if (username == null) {
            console.log('username is null');
        }
        this.dataAccessObject.execute(this.responseBuilder, callback, method, username, object);
    }
}
