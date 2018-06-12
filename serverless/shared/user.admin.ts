import { AnyLengthString } from "aws-sdk/clients/comprehend";

const AWS = require('aws-sdk');

const AWS_ACCESS_KEY = process.env.AWS_ACCESS_KEY;
const AWS_SECRET_KEY = process.env.AWS_SECRET_KEY;
const COGNITO_USER_POOL_ID = process.env.COGNITO_USER_POOL_ID;

AWS.config.update({accessKeyId: AWS_ACCESS_KEY, secretAccessKey: AWS_SECRET_KEY});
var CognitoIdentityServiceProvider = AWS.CognitoIdentityServiceProvider;
let client = new CognitoIdentityServiceProvider({ apiVersion: '2016-04-19', region: 'ap-southeast-2' });

export class UserAdmin {


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

    searchUser(caller: any, email: string, callback) {
        let self = this;
        // Get Users
        console.log('listing users for ' + email);
        client.listUsers({ Filter: 'email = "' + email + '"', UserPoolId: COGNITO_USER_POOL_ID}, 
            function(err, data) {
                let user;
                console.log('err is ' + err + ' data is ' + data.Users.length);
                if (err == null && data.Users.length > 0) {
                    console.log('found user');
                    let user = self.processUsers(data.Users[0]);
                    console.log('successful' + JSON.stringify(user));
                    caller.successMessage = 'The email address ' + email +
                    ' has been found! ' +
                    'Click Add below to share your resource with this person.';
                    caller.user = JSON.stringify(user); 
                } else {
                    // error finding group
                    console.log('error ' + JSON.stringify(err));
                    caller.successMessage = 'OK, almost there. We cannot find the email address ' + email +
                    ' but click add below and an invite will be sent.';
                }
                callback();
            }
        );
    }

    validateObject(caller, id, method, path, callback) {        
        console.log('in validateObject');
        if (path == 'sharessearch' && method == 'GET') {
            //let object = JSON.parse(body);
            //console.log('object is ' + JSON.stringify(object));
            let email = id;
            console.log('email is ' + email);
            //caller.errorMessage = 'Email ' + email + ' is not a registered user.';
            this.searchUser(caller, email, callback);
            //console.log('set object is ' + JSON.stringify(caller));
        } else {
            callback();

        }
    }
}