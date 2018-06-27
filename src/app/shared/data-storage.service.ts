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

    getObjectArrayFromServer(name: string, id: string, component: any, postCallback) {
        this.getObjectsFromServer(true, name, id, undefined, component, postCallback);
    }

    private getObjectsFromServer(listRequired: boolean, name: string, id: string, ownerid: string, component: any, postCallback) {
        let self = this;
        let loadingName = name + 'Loading';
        this.addAuthorization(function(headers) {
            self.http.get(environment.api + '/' + 
                name + 
                (id != undefined ? '/' + id : '') +
                (ownerid != undefined ? '/' + ownerid : ''),
                {headers: headers})            
            .subscribe(
              (success: Response) => {   
                if (component.searchMode) {
                    console.log('search object on ' + component[name] + ' with ' +id);
                    component.successMessage = success.json().message;
                    component.editUser = success.json().user;
                    component.searching = false;
                    component.searchMode = false;
                } else {
                    console.log('setting ' + loadingName + ' to false');
                    component[loadingName] = false;                   
                    let result = success.json();
                    console.log('result is ' + JSON.stringify(result));                
                    component[name] = result;

                    console.log('name is ' + name + ' id is ' + id);

                    if (!listRequired && id != undefined && result != undefined && result.length > 0) {
                        // if there is an id get first result
                        console.log('not multi so get first');
                        component[name] = result[0];
                    } 

                    if (postCallback != null ) {
                        postCallback(component);
                    }
                    
                    //console.log(' component[name]' +  component[name]); 
                }

              },
              (error: Response) => {
                console.log('error' + JSON.stringify(error));
                component.loading = false;
                component.errorMessage = error.json().message;
                component.searching = false;            
              }
            );          
        });
    }

    setObjectOnServer(componentObjectList: string, componentObject: string, newObject: any, component: any) {
        let self = this;
         
        /*
        console.log('component.constructor.name :' + component.constructor.name);
        console.log('setObjectOnServer  component:' + component);
        console.log('component.editMode' + component.editMode);
        console.log('component.headingLoading' + component.headingLoading);
        console.log('component.loading' + component.loading);
        
        console.log('component.resource' + component.resource);
        console.log('component.shares' + component.shares);
        */
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
                if (component.editMode) {
                    console.log('set object on ' + component[name] + ' at ' + component.editIndex);
                    component[componentObjectList][component.editIndex] = newObject;
                    component[componentObject] = newObject;  
                    component.errorMessage = '';
                    component.closeSetModal();                  
                } else {
                    console.log('setObjectOnServer componentObjectList:' + componentObjectList + ' newObject:' + JSON.stringify(newObject) + ' component shares:' + component.shares);

                    console.log('push object on ' + newObject + ' onto ' + component[componentObjectList]);

                    component[componentObjectList].push(newObject);
                    component[componentObject] = newObject;
                    component.errorMessage = '';
                    component.closeSetModal();
                }
                             
              },
              (error: Response) => {
                console.log('error' + JSON.stringify(error));
                component.loading = false;
                component.errorMessage = error.text();             
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
                component.message = error.text();             
              }
            );          
        });
    }



    

}