import { Injectable } from "@angular/core";
import * as AWS from 'aws-sdk';
import { environment } from '../../environments/environment';
import { NotificationService } from "./notification.service";

declare let AWSCognito: any;
declare let apigClientFactory: any;

@Injectable()
export class AuthenticationService {

    constructor(private notificationService: NotificationService) {

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
              this.token = result.getIdToken().getJwtToken();
              
              console.log('success ' + this.token.length);
              let cognitoGetUser = userPool.getCurrentUser();
    
              if (cognitoGetUser != null) {
                cognitoGetUser.getSession(function(err, result) {
                  if (result) {
                    console.log ("Authenticated to Cognito User Pools! result is " + result);
                    self.setToken( result.getAccessToken().getJwtToken());
                  }
                });
              }    
            },
            onFailure: function(err) {
                console.log ("Authenticated Error:" + err.message);    
                self.notificationService.setMessage( err.message );           
                
            },
            newPasswordRequired: function(userAttributes, requiredAttributes) {
              console.log ("newPasswordRequired:");
            }        
          });
          
    }
    
    setToken(token: string) {
        localStorage.setItem('token', token);
    }
    
    getToken() {
        return localStorage.getItem("token");
    }

}