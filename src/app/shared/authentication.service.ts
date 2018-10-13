import { Injectable } from "@angular/core";
import { Router, CanActivate } from '@angular/router';
import * as AWS from 'aws-sdk';
import { environment } from '../../environments/environment';
import { NotificationService } from "./notification.service";
import { User } from './user.model';
import { Subject } from "rxjs/Subject";

declare let AWSCognito: any;
declare let apigClientFactory: any;

@Injectable()
export class AuthenticationService {

    loadedUser = new Subject();
    savedCognitoUser: any;
    saveAuthenticationDetails: any;

    constructor(private notificationService: NotificationService,
                private router: Router) {

        AWS.config.update({
            region: environment.region,
            credentials: new AWS.CognitoIdentityCredentials({ IdentityPoolId: ''})
        });
        AWSCognito.config.region = environment.region;
        AWSCognito.config.update({accessKeyId: 'null', secretAccessKey: 'null'});
    } 

    getUserSession(callback) {
        let poolData : any = {
            UserPoolId: environment.userpoolid,
            ClientId: environment.clientid
        };    
        let idToken = '';
        let userPool = new AWSCognito.CognitoIdentityServiceProvider.CognitoUserPool(poolData);
        let cognitoGetUser = userPool.getCurrentUser();
        console.log('getUserSession');
        if (cognitoGetUser != null) {
            cognitoGetUser.getSession(function(err, result) {
              if (result) {
                let idToken = result.getIdToken().getJwtToken();
                callback( idToken );         
              } else {
                console.log(' error is ' + JSON.stringify(err));
              }
            });
        } 

        
    }

    authenticateUser(cognitoUser: any, authenticationDetails: any, userPool: any,
                     callback: any, self: any) {
        cognitoUser.authenticateUser(authenticationDetails, {
            onSuccess: function (result) {
              
              let cognitoGetUser = userPool.getCurrentUser();
    
              if (cognitoGetUser != null) {
                cognitoGetUser.getSession(function(err, result) {
                  if (result) {
                    console.log("Authenticated to Cognito User Pools! result is " + result);
                    let token = result.getAccessToken().getJwtToken(); 
                    //console.log('access token is ' + token);                    
                    //let idToken = result.idToken.jwtToken;
                    let idToken = result.getIdToken().getJwtToken();
                    //console.log('idToken is ' + idToken);
                    let refreshToken = result.getRefreshToken().getToken()
                    //console.log('refreshToken is ' + refreshToken);

                    cognitoGetUser.getUserAttributes(function (err, result) {
                        if (err) {
                            console.log('getUserAttributes() ERROR: ' + err);
                            self.notificationService.setMessage( err.message );  
                            callback.loading = false;                                                      
                        } else {
                            console.log('getUserAttributes() OK: ' + result);
                            self.createUser(cognitoUser.username, idToken, result);
                            callback.successfulLogin();                           
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
                    var email = userAttributes.email;                
                    console.log ("email is " + email);
                    // save user session for later
                    self.savedCognitoUser = cognitoUser;
                    callback.loading = false;  
                    callback.newPasswordRequired();    
            }        
          });

    }


    resendConfirmationCode(email: string, callback ) {

        let self = this;

        let poolData : any = {
            UserPoolId: environment.userpoolid,
            ClientId: environment.clientid
        };

        console.log('resendConfirmationCode email is ' + email );
        let userPool = new AWSCognito.CognitoIdentityServiceProvider.CognitoUserPool(poolData);
        let userData = {
          Username : email,
          Pool : userPool
        };
        let cognitoUser = new AWSCognito.CognitoIdentityServiceProvider.CognitoUser(userData);

        cognitoUser.resendConfirmationCode(function(error, result) {
            if (error) {
                console.log('Error resendConfirmationCode ' + error.message);    
                self.notificationService.setMessage( error.message );
                callback.loading = false; 
                return;
            }
            console.log('resendConfirmationCode result: ' + result);
            self.savedCognitoUser = cognitoUser;
            
            // then ask to sign up
            callback.successfulResendConfirmationCode('confirm', email);

        });        
    }

    forgotPassword(email: string, callback ) {

        let self = this;

        let poolData : any = {
            UserPoolId: environment.userpoolid,
            ClientId: environment.clientid
        };

        console.log('forgotPassword email is ' + email );
        let userPool = new AWSCognito.CognitoIdentityServiceProvider.CognitoUserPool(poolData);
        let userData = {
          Username : email,
          Pool : userPool
        };
        let cognitoUser = new AWSCognito.CognitoIdentityServiceProvider.CognitoUser(userData);

        cognitoUser.forgotPassword({
            onSuccess: function (result) {
                console.log('forgotPassword result: ' + result);
                // then ask to sign up
                callback.successfulForgotPassword('confirm', email);
            },
            onFailure: function(error) {
                console.log('Error forgotPassword ' + error.message);    
                self.notificationService.setMessage( error.message );
                callback.loading = false; 
                return;
            },
            inputVerificationCode() {
                var verificationCode = prompt('Please input verification code ' ,'');
                var newPassword = prompt('Enter new password ' ,'');
                cognitoUser.confirmPassword(verificationCode, newPassword, this);
            }
        });      
    }

    signinUser(email: string, password: string, newPassword: string, code: string, firstname: string, lastname: string, callback ) {

        let self = this;

        let authenticationData = {
          Username : email,
          Password : password,
        };  

        let poolData : any = {
            UserPoolId: environment.userpoolid,
            ClientId: environment.clientid
        };

        console.log('email is ' + email + ' password is ' + password + ' code is ' + code);
        let authenticationDetails = new AWSCognito.CognitoIdentityServiceProvider.AuthenticationDetails(authenticationData);
        let userPool = new AWSCognito.CognitoIdentityServiceProvider.CognitoUserPool(poolData);
        let userData = {
          Username : email,
          Pool : userPool
        };

        if (code != null) {
            // sign in with code to complete sign up
            callback.loading = true; 
            // set authenticationDetails if previously saved
            authenticationDetails = self.saveAuthenticationDetails;

            console.log('confirmRegistration for ' + code); 
            self.savedCognitoUser.confirmRegistration(code, true,  
                function(error, result) {
                    if (error) {
                        console.log('Error Confirming Code ' + error.message);    
                        self.notificationService.setMessage( error.message );
                        callback.loading = false; 
                        return;
                    }
                    console.log('call result: ' + result);
                    console.log('Authenticate User authenticationDetails are ' + authenticationDetails);
                    if (authenticationDetails != undefined) {
                        self.authenticateUser(self.savedCognitoUser, authenticationDetails, userPool, callback, self);                        
                    } else {
                        callback.successfulSignUp('completed', email);
                    }

                } 
                
            );


        } else if (newPassword != null) {
            // sign in with new password to complete sign up
            console.log ("newPassword email is " + email);
            callback.loading = false;  
            var attributesData = {
                given_name: firstname,
                family_name: lastname
            }         
            if (self.savedCognitoUser == undefined) {
                let errorMessage = 'Unknown user';
                console.log('errorMessage ' + errorMessage);    
                self.notificationService.setMessage( errorMessage );
                callback.loading = false; 
                return;                                          
            }
            
            self.savedCognitoUser.completeNewPasswordChallenge(newPassword, attributesData,  {
                onSuccess: function(result) {
                    //callback.successfulSignUp();
                    //callback.successfulSignUp('completed', email);
                    console.log('Authenticate User');
                    let cognitoUser = new AWSCognito.CognitoIdentityServiceProvider.CognitoUser(userData);
                    self.authenticateUser(cognitoUser, authenticationDetails, userPool, callback, self);
                },
                onFailure: function(error) {
                    console.log('Authenticated Error ' + error.message);    
                    self.notificationService.setMessage( error.message );
                    callback.loading = false;                               
                }
            });
        } else {
            console.log('Authenticate User');
            let cognitoUser = new AWSCognito.CognitoIdentityServiceProvider.CognitoUser(userData);
            this.authenticateUser(cognitoUser, authenticationDetails, userPool, callback, self);          
        }                   
    }
    
    signupUser(email: string, password: string, firstname: string, lastname: string, callback ) {

        let self = this;

        console.log('email is ' + email);
        let authenticationData = {
            Username : email,
            Password : password,
        };  
  

        let authenticationDetails = new AWSCognito.CognitoIdentityServiceProvider.AuthenticationDetails(authenticationData);
  
        let poolData : any = {
            UserPoolId: environment.userpoolid,
            ClientId: environment.clientid
        };

        let userPool = new AWSCognito.CognitoIdentityServiceProvider.CognitoUserPool(poolData);
/*        
        let userData = {
          Username : email,
          Pool : userPool
        };
        let cognitoUser = new AWSCognito.CognitoIdentityServiceProvider.CognitoUser(userData);
*/
        var attributeEmail = new AWSCognito.CognitoIdentityServiceProvider.
            CognitoUserAttribute({
                Name : 'email',
                Value : email
            });           
        var attributeFirstName = new AWSCognito.CognitoIdentityServiceProvider.
            CognitoUserAttribute({
                Name : 'given_name',
                Value : firstname
            });
        var attributeLastName = new AWSCognito.CognitoIdentityServiceProvider.
            CognitoUserAttribute({
                Name : 'family_name',
                Value : lastname
            });
    
        var attributeList = [];  
        attributeList.push(attributeEmail);
        attributeList.push(attributeFirstName);
        attributeList.push(attributeLastName);                        

        console.log('attributeList ' + attributeList);    
        
        userPool.signUp(email, password, attributeList, null, ((err, result) => {
            if (err) {
                console.log('There was an error ', err);
                self.notificationService.setMessage( err.message ); 
                callback.loading = false; 

            } else {
                console.log('You have successfully signed up, please confirm your email ');
                console.log('User id is ' + result.userSub + ' firstname is ' + firstname);
                // add user with name etc to table
                //let cognitoUser = result.user;
                let userData = {
                    Username : email,
                    Pool : userPool
                  };
                let cognitoUser = new AWSCognito.CognitoIdentityServiceProvider.CognitoUser(userData);
                self.savedCognitoUser = cognitoUser;
                self.saveAuthenticationDetails = authenticationDetails;

                // save user email for later use for confirmation
                //localStorage.setItem('username',  email);

                // then ask to sign up
                callback.successfulSignUp('confirm', email);

            }        
        }))
          
    }
    
    private createUser(userId: string, userToken: string, userAttributes: any) {            
        let email;        
        let givenName;
        let familyName;    
        for (let i = 0; i < userAttributes.length; i++) {      
          console.log('attribute ' +  userAttributes[i].Name + ' has value ' +  userAttributes[i].Value);
          if(userAttributes[i].Name == 'email' ) {
            email = userAttributes[i].Value;
          } 
          if(userAttributes[i].Name == 'family_name' ) {
            familyName = userAttributes[i].Value;
          } 
          if(userAttributes[i].Name == 'given_name' ) {
            givenName = userAttributes[i].Value;
          }           
        }
        let user = new User(userId, email, givenName, familyName, '', userToken);
        localStorage.setItem('user',  JSON.stringify(user));
        console.log('setting fill name to ' + givenName + ' ' + familyName);    
        this.loadedUser.next(user);            
    }
   
    deleteUser() {
        localStorage.removeItem("user");
        this.loadedUser.next();    
    }

    getloadedUser() {
        this.loadedUser.next(JSON.parse(localStorage.getItem("user")));        
        return this.loadedUser.asObservable();
    }

    getUser() : User {        
        return JSON.parse(localStorage.getItem("user"));
    }

}