import { Injectable } from "@angular/core";
import { Http, Headers, RequestOptions, Response } from "@angular/http";
import { environment } from '../../environments/environment';
import { Subject } from "rxjs/Subject";
import { AuthenticationService } from "./authentication.service";

@Injectable()
export class DataStorageService {

    addAuthorization(callback) {
        this.authenticationService.getUserSession(function(token) {
            // got token
            console.log('end of token value is ' + token.substr(token.length - 5));
            let headers = new Headers();
            headers.append('Content-Type', 'application/json');        
            headers.append('Authorization', token);
            callback(headers);
        }); 

    }

    constructor(private http: Http,
                private authenticationService: AuthenticationService) { }

    getSharedObjectFromServer(name: string, id: string, ownerid: string, component: any, postCallback) {
        this.getObjectsFromServer(false, name, id, ownerid, component, postCallback);
    }            
            
    getObjectFromServer(name: string, id: string, component: any, postCallback) {
        this.getObjectsFromServer(false, name, id, undefined, component, postCallback);
    }
    
    getSearchObjectArrayFromServer(name: string, resourceid: string, email: string, component: any, postCallback) {
        this.getObjectsFromServer(false, name, resourceid, email, component, postCallback);
    }            

    getObjectArrayFromServer(name: string, id: string, component: any, postCallback) {
        this.getObjectsFromServer(true, name, id, undefined, component, postCallback);
    }



    private getObjectsFromServer(listRequired: boolean, name: string, param1: string, param2: string, component: any, postCallback) {
        let self = this;
        let loadingName = name + 'Loading';
        let searchMode = component.searchMode;
        console.log('searchMode is ' + searchMode);
        console.log('calling ' + environment.api + '/' + 
        name + 
        (param1 != undefined ? '/' + param1 : '') +
        (param2 != undefined ? '/' + param2 : ''));

        this.addAuthorization(function(headers) {
            self.http.get(environment.api + '/' + 
                name + 
                (param1 != undefined ? '/' + param1 : '') +
                (param2 != undefined ? '/' + param2 : ''),
                {headers: headers})            
            .subscribe(
              (success: Response) => {   
                if (searchMode) {
                    console.log('successful search mode result on ' + param1 + ' and ' + param2);
                    component.successMessage = success.json().message;
                    component.errorMessage = '';

                    component.editUser = success.json().user;
                    component.searching = false;
                    component.searchMode = false;

                } else {
                    console.log('successful result on ' + param1 + ' and ' + param2);
                    component[loadingName] = false;                   
                    let result = success.json();
                    console.log('result is ' + JSON.stringify(result));                
                    component[name] = result;
                    component.errorMessage = '';

                    console.log('name is ' + name + ' id is ' + param1);

                    if (!listRequired && param1 != undefined && result != undefined && result.length > 0) {
                        // if there is an id get first result
                        console.log('not multi so get first');
                        component[name] = result[0];
                    } 

                    //console.log(' component[name]' +  component[name]); 
                }

                if (postCallback != null ) {
                    postCallback(component);
                }                

              },
              (error: Response) => {
                console.log('error' + JSON.stringify(error));
                component[loadingName] = false; 
                component.errorMessage = error.json().message;
                component.successMessage = '';
                component.searching = false;            
              }
            );          
        });
    }

    setObjectOnServer(componentObjectList: string, componentObject: string, newObject: any, component: any, postCallback) {
        let self = this;
         
        console.log('new object is ' + JSON.stringify(newObject));

        this.addAuthorization(function(headers) {
            let options = new RequestOptions({
                headers: headers,
                body: newObject
            })
            self.http.post(environment.api + '/' + componentObjectList, newObject, options)            
            .subscribe(
              (success: Response) => {   
                component.loading = false;                     
                newObject.id = success.json().id;  
                console.log('newObject.id is ' + newObject.id);
                if (component.editMode) {
                    console.log('set object on ' + component[name] + ' at ' + component.editIndex);
                    component[componentObjectList][component.editIndex] = newObject;
                    component[componentObject] = newObject;  
                    component.errorMessage = '';
                    component.closeSetModal();                  
                } else {
                    console.log('setObjectOnServer componentObjectList:' + componentObjectList + ' newObject:' + JSON.stringify(newObject) + ' component shares:' + component.shares);

                    console.log('push object on ' + newObject + ' onto ' + component[componentObjectList]);

                    //component[componentObjectList].push(newObject);
                    component[componentObjectList].unshift(newObject);
                    component[componentObject] = newObject;
                    component.errorMessage = '';
                    component.closeSetModal();
                }

                if (postCallback != null ) {
                    postCallback(component);
                }
                             
              },
              (error: Response) => {
                console.log('error' + JSON.stringify(error));
                component.loading = false;
                //component.errorMessage = error.text();  
                component.errorMessage = error.json().message;           
              }
            );          
        });
    }

    deleteObjectsOnServer(name: string, object: any, component: any) {
        let self = this;
        console.log('delete object ' + JSON.stringify(object));
        this.addAuthorization(function(headers) {
            let options = new RequestOptions({
                headers: headers,
                body: object
            })
            self.http.delete(environment.api + '/' + name, options)            
            .subscribe(
              (success: Response) => {   
                component.loading = false;                     
                //component[name] = success.json() ;   
                component[name].splice(component.editIndex, 1);
                component.message = '';                     
                component.closeDeleteModal();                        
              },
              (error: Response) => {
                console.log('error' + JSON.stringify(error));
                component.loading = false;
                //component.message = error.text();             
                component.errorMessage = error.json().message;
              }
            );          
        });
    }



    

}