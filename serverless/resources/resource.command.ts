import { DataAccessObject } from "../shared/data.access.object";
import { RequestValidator } from "../shared/request.validator";

export class ResourceCommand {

    requestValidator: RequestValidator;
    dataAccessObject: DataAccessObject;

    constructor(requestValidator: RequestValidator,
                dataAccessObject: DataAccessObject) {
        this.requestValidator = requestValidator;                    
        this.dataAccessObject = dataAccessObject;
    }

    execute(responseBuilder, eventHolder, callback) {
        console.log('ResourceCommand');
        let self = this;
        let method = eventHolder.method;
        switch (method) {
            case 'GET': 
            this.requestValidator.checkIfAccessAllowedToResource(this.dataAccessObject, eventHolder, 
                function(resourceAccessAllowed, resourceOwnerId) {
                    if (resourceAccessAllowed) {
                        // if different resource owner id then use this
                        if (resourceOwnerId != undefined) {
                            eventHolder.userSessionId = resourceOwnerId;
                        }
                        self.dataAccessObject.resources(responseBuilder, eventHolder, function() {
                            callback();
                        });
                    } else {
                        responseBuilder.errorMessage = 
                        'Access not allowed';
                        callback();
                    }
                });
            break;
            default:
            self.dataAccessObject.resources(responseBuilder, eventHolder, function() {
                callback();
            });
            break;            
        }

    }

}