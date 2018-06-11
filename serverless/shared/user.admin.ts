const AWS = require('aws-sdk');

const AWS_ACCESS_KEY = process.env.AWS_ACCESS_KEY;
const AWS_SECRET_KEY = process.env.AWS_SECRET_KEY;
const COGNITO_USER_POOL_ID = process.env.COGNITO_USER_POOL_ID;

AWS.config.update({accessKeyId: AWS_ACCESS_KEY, secretAccessKey: AWS_SECRET_KEY});
var CognitoIdentityServiceProvider = AWS.CognitoIdentityServiceProvider;
let client = new CognitoIdentityServiceProvider({ apiVersion: '2016-04-19', region: 'ap-southeast-2' });

export class UserAdmin {


    processUsers(searchUsers) {
        var users = [];       
        // loop through data, tidy up and return
        for (let userIndex = 0; userIndex < searchUsers.length; userIndex++) {
          let id = searchUsers[userIndex].Username;
          let status = searchUsers[userIndex].UserStatus;
          //console.log('Username ' + searchUsers[userIndex].Username);
          //console.log('UserStatus ' + searchUsers[userIndex].UserStatus);   
          var userAttributes = searchUsers[userIndex].Attributes;
  
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
          let user = {
            id: id,
            email: email,
            firstname: firstname,
            lastname: lastname,
            status: status
          }
          users.push(user);
        }
        return users;
  
    }

    searchUser(caller: any, email: string, callback) {
        let self = this;
        // Get Users
        console.log('listing users for ' + email);
        client.listUsers({ Filter: 'email = "' + email + '"', UserPoolId: COGNITO_USER_POOL_ID}, 
            function(err, data) {
                if (!err) {
                    let searchUsers = data.Users;
                    console.log('successful');
                    let users = self.processUsers(data.Users);
                    console.log('successful' + JSON.stringify(users));
                    caller.errorMessage = 'Email ' + email + ' is a registered user.';

                } else {
                    // error finding group
                    console.log('error' + JSON.stringify(err));
                    caller.errorMessage = 'Email ' + email + ' is not a registered user.';
                }
                callback();
            }
        );
    }

    validateObject(caller, body, method, path, callback) {        
        console.log('in validateObject');
        if (path.includes('share') && method == 'POST') {
            let object = JSON.parse(body);
            console.log('object is ' + JSON.stringify(object));
            let email = object.email;
            console.log('email is ' + email);
            //caller.errorMessage = 'Email ' + email + ' is not a registered user.';
            this.searchUser(caller, email, callback);
            //console.log('set object is ' + JSON.stringify(caller));
        } else {
            callback();

        }
    }
}