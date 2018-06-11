import { RequestExtractor } from './request.extractor';
import { ResponseModel } from './response.model';
import { DataAccessObject } from './data.access.object';
import { ResponseBuilder } from './response.builder';
import { UserAdmin } from './user.admin';

export class RequestProcessor {

    requestExtractor: RequestExtractor;
    dataAccessObject: DataAccessObject;
    responseBuilder: ResponseBuilder;
    errorMessage: string;
    userAdmin: UserAdmin;

    constructor(requestExtractor: RequestExtractor, 
                dataAccessObject: DataAccessObject,
                responseBuilder: ResponseBuilder,
                userAdmin: UserAdmin
            ) {
        console.log('constructor');        
        this.requestExtractor = requestExtractor;
        this.dataAccessObject = dataAccessObject;
        this.responseBuilder = responseBuilder;
        this.userAdmin = userAdmin;
    }  

    processRequest(event, callback) {
        console.log('process request');     
        //console.log('processRequest is ' + JSON.stringify(event))
        this.errorMessage = null;
        let self = this;
        let authorizer = event.requestContext.authorizer;
        let username = this.requestExtractor.getUserName(authorizer);

        let body = event.body;
        let method = event.httpMethod;
        let path = event.path.split("/")[1];

        let validatedObject = this.userAdmin.validateObject(this, body, method, path, function() {
            console.log('error message is ' + self.errorMessage);
            if (self.errorMessage != null) {
                self.responseBuilder.build(self.errorMessage, null, callback);
                // return error
            } else {
                if (username == null) {
                    console.log('username is null');
                    let error = new Error('User session no longer valid');
                    self.responseBuilder.build(error, null, callback);
                    // return error
                } else {
                    console.log('execute');
                    self.dataAccessObject.execute(self.responseBuilder, self.requestExtractor, callback, event, username);
                }
        
            }            
        });



    }
}
