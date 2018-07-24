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
        console.log('SharesCommand ' + path);
        switch (path) {
            case 'shares':
                if (eventHolder.method == 'POST') {
                    // create user in cognito first
                    self.userAccess.shares(responseBuilder, eventHolder, function(userid) {
                        console.log('User created is with user id of ' + userid);
                        eventHolder.object.userid = userid;
                        // load data into share table after that
                        self.dataAccessObject.shares(responseBuilder, eventHolder, function() {
                            callback();
                        });    
                    });                
                }                
                if (eventHolder.method == 'GET' || eventHolder.method == 'DELETE') {
                    // get shares from database first
                    self.dataAccessObject.shares(responseBuilder, eventHolder, function() {
                        callback();
                    });    
                }                

                break;
            case 'sharessearch':
                eventHolder.id = eventHolder.resourceId;
                self.userAccess.sharessearch(responseBuilder, eventHolder, function() {
                    callback();
                });
                break;                

        }       

    }

}