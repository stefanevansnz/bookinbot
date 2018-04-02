import { Injectable } from "@angular/core";
import { Router } from '@angular/router';
import * as AWS from 'aws-sdk';
import { environment } from '../../environments/environment';
import { NotificationService } from "./notification.service";
import { User } from './user.model';
import { Subject } from "rxjs/Subject";


declare let AWSCognito: any;
declare let apigClientFactory: any;

@Injectable()
export class AuthenticationService {

    user = new Subject();

    constructor(private notificationService: NotificationService,
                private router: Router) {

        AWS.config.update({
            region: environment.region,
            credentials: new AWS.CognitoIdentityCredentials({ IdentityPoolId: ''})
        });
        AWSCognito.config.region = environment.region;
        AWSCognito.config.update({accessKeyId: 'null', secretAccessKey: 'null'});
    } 

    signinUser(email: string, password: string, callback ) {

        let self = this;

        let authenticationData = {
          Username : email,
          Password : password,
        };  

        let poolData : any = {
            UserPoolId: environment.userpoolid,
            ClientId: environment.clientid
        };

        let authenticationDetails = new AWSCognito.CognitoIdentityServiceProvider.AuthenticationDetails(authenticationData);
        let userPool = new AWSCognito.CognitoIdentityServiceProvider.CognitoUserPool(poolData);
        let userData = {
          Username : email,
          Pool : userPool
        };
        let cognitoUser = new AWSCognito.CognitoIdentityServiceProvider.CognitoUser(userData);

        cognitoUser.authenticateUser(authenticationDetails, {
            onSuccess: function (result) {
              
              let cognitoGetUser = userPool.getCurrentUser();
    
              if (cognitoGetUser != null) {
                cognitoGetUser.getSession(function(err, result) {
                  if (result) {
                    console.log ("Authenticated to Cognito User Pools! result is " + result);
                    let token = result.getAccessToken().getJwtToken();                                                        
                    cognitoGetUser.getUserAttributes(function (err, result) {
                        if (err) {
                            console.log('getUserAttributes() ERROR: ' + err);
                            self.notificationService.setMessage( err.message );  
                            callback.loading = false;                          
                        } else {
                            console.log('getUserAttributes() OK: ' + result);
                            self.createUser(cognitoUser.username, token, result);
                            self.router.navigateByUrl('/'); 
                           
                        }
                      });

                  }
                });
              }    
            },
            onFailure: function(err) {
                console.log ("Authenticated Error:" + err.message);    
                self.notificationService.setMessage( err.message );
                callback.loading = false;           
                
            },
            newPasswordRequired: function(userAttributes, requiredAttributes) {
              console.log ("newPasswordRequired:");
            }        
          });
          
    }
    
    createUser(userName: string, userToken: string, userAttributes: any) {            
        let givenName;
        let familyName;    
        for (let i = 0; i < userAttributes.length; i++) {      
          //console.log('attribute ' +  user[i].Name + ' has value ' +  user[i].Value);
          if(userAttributes[i].Name == 'given_name' ) {
            givenName = userAttributes[i].Value;
          } 
          if(userAttributes[i].Name == 'family_name' ) {
            familyName = userAttributes[i].Value;
          } 
        }
        let user = new User(userName, givenName, familyName, userToken);
        localStorage.setItem('user',  JSON.stringify(user));
        console.log('setting fill name to ' + givenName + ' ' + familyName);    
        this.user.next(user);    
    }
    
    deleteUser() {
        localStorage.removeItem("user");
        this.user.next();
    }

    getUser() {
        this.user.next(JSON.parse(localStorage.getItem("user")));        
        return this.user.asObservable();
    }
    
}