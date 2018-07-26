import { AnyLengthString } from "aws-sdk/clients/comprehend";
import { EventHolder } from "./event.holder";
import { ResponseBuilder } from "./response.builder";

const AWS = require('aws-sdk');

const COGNITO_AWS_ACCESS_KEY = process.env.COGNITO_AWS_ACCESS_KEY;
const COGNITO_AWS_SECRET_KEY = process.env.COGNITO_AWS_SECRET_KEY;
const COGNITO_USER_POOL_ID = process.env.COGNITO_USER_POOL_ID;

AWS.config.update({accessKeyId: COGNITO_AWS_ACCESS_KEY, secretAccessKey: COGNITO_AWS_SECRET_KEY});
var CognitoIdentityServiceProvider = AWS.CognitoIdentityServiceProvider;
let client = new CognitoIdentityServiceProvider({ apiVersion: '2016-04-19', region: 'ap-southeast-2' });

export class UserAccess {


    processUsers(user: any) {
        let id = user.Username;
        let status = user.UserStatus;
        var userAttributes = user.Attributes;

        var email = '';
        var firstname = '';
        var lastname = '';
        for (let attrIndex = 0; attrIndex < userAttributes.length; attrIndex++) {      
            if(userAttributes[attrIndex].Name == 'email' ) {
            //console.log('Email ' + userAttributes[attrIndex].Value); 
            email = userAttributes[attrIndex].Value;             
            }             
            if(userAttributes[attrIndex].Name == 'given_name' ) {
            //console.log('First Name ' + userAttributes[attrIndex].Value);              
            firstname = userAttributes[attrIndex].Value;
            }           
            if(userAttributes[attrIndex].Name == 'family_name' ) {
            //console.log('Last Name ' + userAttributes[attrIndex].Value);              
            lastname = userAttributes[attrIndex].Value;
            } 
        }

        return {
            id: id,
            email: email,
            firstname: firstname,
            lastname: lastname,
            status: status
        }
  
    }

    searchUser(response: ResponseBuilder, email: string, callback) {
        let self = this;
        // Get Users
        console.log('listing users for ' + email);
        client.listUsers({ Filter: 'email = "' + email + '"', UserPoolId: COGNITO_USER_POOL_ID}, 
            function(err, data) {
                let successMessage;
                let user;
                console.log('err is ' + err + ' data is ' + data);
                if (err == null && data != null && data.Users.length > 0) {
                    console.log('found user');
                    let user = self.processUsers(data.Users[0]);
                    console.log('successful' + JSON.stringify(user));
                    response.successMessage = 'The email address ' + email +
                    ' has been found and ' + user.status +
                    '. Click Add below to share your resource with this person.';
                    response.resultSet = JSON.stringify(user); 
                } else {
                    // error finding group
                    console.log('error ' + JSON.stringify(err));
                    response.successMessage = 'OK, almost there. We cannot find the email address ' + email +
                    ' but click add below and an invite will be sent.';
                    let user = {email: email, firstname: '', lastname: ''};
                    //response.resultSet = '[]'; 
                    response.resultSet = JSON.stringify(user); 
                }

                callback();
            }
        );
    }

    resendUserEmail(response: any, email: string, callback) {
        let self = this;
        // Get Users
        console.log('resend user email for ' + email);

        client.adminCreateUser({ 
            Username: email, 
            UserPoolId: COGNITO_USER_POOL_ID,
            MessageAction: "RESEND"
        }, 
            function(err, data) {
            if (err == null) {
                console.log('resend sent successful' + JSON.stringify(data)); 
                // set new user id
            } else {
                //res.status(err.statusCode).json({ error: String(err) });
                console.log('resend error was ' + err.error);
                console.log('error ' + JSON.stringify(err));
                response.errorMessage = 'Could not resend email for user.';
            }
            callback();
        });            

    }    



    addUser(response: any, email: string, callback) {
        let self = this;
        // Get Users
        console.log('create user for ' + email);

        client.adminCreateUser({ 
            Username: email, 
            UserPoolId: COGNITO_USER_POOL_ID
        }, 
            function(err, data) {
            let userid = null;
            if (err == null) {
                console.log('adminCreateUser successful' + JSON.stringify(data)); 
                // set new user id
                userid = data.User.Username; 
                console.log('user id returned is ' + userid);   
            } else {
                //res.status(err.statusCode).json({ error: String(err) });
                console.log('adminCreateUser error was ' + err.error);
                console.log('error ' + JSON.stringify(err));
                response.errorMessage = 'Could not create user.';
            }
            callback(userid);
        });            

    }  
    
    resources(response, eventHolder: EventHolder, callback) {   
        console.log('UserAccess resources');
        callback();
    }    

    resource(response, eventHolder: EventHolder, callback) {   
        console.log('UserAccess resource');
        callback();
    }    

    bookings(response, eventHolder: EventHolder, callback) {   
        console.log('UserAccess bookings');
        callback();
    }
    
    sharessearch(response, eventHolder: EventHolder, callback) {   
        console.log('UserAccess sharessearch');
        console.log('get to sharessearch');
        let email = eventHolder.email;        
        console.log('email is ' + email);    
        this.searchUser(response, email, callback);

        //callback();
    }

    
    sharesresend(response, eventHolder: EventHolder, callback) {   
        console.log('UserAccess sharesresend');
        let id = eventHolder.id;        
        console.log('get to sharesresend');
        let email = id;
        console.log('email is ' + email);    
        this.resendUserEmail(response, email, callback);

        //callback();
    }


    shares(response, eventHolder: EventHolder, callback) {        
        console.log('UserAccess shares');
        let path = eventHolder.path;
        let id = eventHolder.id;
        let method = eventHolder.method;
        let body = eventHolder.body;

        let object = JSON.parse(body);
        console.log('object received in request is ' + JSON.stringify(object));
        if (method == 'POST') {
            let existingUserId = object.userid;
            console.log('existingUserId is ' + existingUserId );
            if (existingUserId == undefined || existingUserId == null ) {
                console.log('no userid passed in from request');
                // no user so add first.
                this.addUser(response, object.email, function(userid) {
                    console.log('Result from addUser is ' + userid);                
                    callback(userid);
                });
            } else {
                console.log('userid passed in from request is ' + existingUserId);
                callback(existingUserId);
            }                
        } else {
            callback();
        }

    }
    
}