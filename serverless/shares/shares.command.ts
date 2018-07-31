import { DataAccessObject } from "../shared/data.access.object";
import { RequestValidator } from "../shared/request.validator";
import { UserAccess } from "../shared/user.access";

export class SharesCommand {

    requestValidator: RequestValidator;
    dataAccessObject: DataAccessObject;
    userAccess: UserAccess;

    constructor(requestValidator: RequestValidator,
                dataAccessObject: DataAccessObject,
                userAccess: UserAccess) {
        this.requestValidator = requestValidator;                    
        this.dataAccessObject = dataAccessObject;
        this.userAccess = userAccess;
    }

    execute(responseBuilder, eventHolder, callback) {
        let self = this;
        let path = eventHolder.path;
        let method = eventHolder.method;   
        let resourceId = eventHolder.id;     
        console.log('SharesCommand ' + path);
        switch (path) {
            case 'shares':
                switch (method) {
                    case 'POST': 
                        // create user in cognito first
                        self.userAccess.shares(responseBuilder, eventHolder, function(userid) {
                            console.log('User created is with user id of ' + userid);
                            eventHolder.object.userid = userid;
                            // load data into share table after that
                            self.dataAccessObject.shares(responseBuilder, eventHolder, function() {
                                callback();
                            });    
                        }); 
                    break;                         
                    default:
                    this.requestValidator.checkIfOwnerOfResource(this.dataAccessObject, eventHolder, 
                        function(resourceOwner) {
                            console.log('resourceOwner is ' + resourceOwner + ' resourceId is ' + resourceId);
                            if (resourceOwner || resourceId == undefined) {
                                // if resource owner or there no resource id show shares
                                eventHolder.id = resourceId;
                                self.dataAccessObject.shares(responseBuilder, eventHolder, function() {
                                    callback();
                                });                                 
                            } else {
                                responseBuilder.errorMessage = 
                                'Access not allowed';
                                callback();
                            }
                        });
                    break;
                }
            case 'sharessearch':
                eventHolder.id = eventHolder.resourceId;
                self.userAccess.sharessearch(responseBuilder, eventHolder, function() {
                    callback();
                });
                break;                

        }       

    }

}