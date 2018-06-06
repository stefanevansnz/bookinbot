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


    getObjectsFromServer(name: string, id: string, component: any) {
        let self = this;
        this.addAuthorization(function(headers) {
            self.http.get(environment.api + '/' + 
                name + (id != undefined ? '/' + id : ''), {headers: headers})            
            .subscribe(
              (success: Response) => {   
                component.loading = false;                     
                let result = success.json();
                console.log('result is ' + JSON.stringify(result));                
                component[name] = result;
                if (id != undefined) {
                    // if there is an id get first result
                    component[name] = result[0];
                } 
              },
              (error: Response) => {
                console.log('error' + JSON.stringify(error));
                component.loading = false;
                component.message = error.text();             
              }
            );          
        });
    }

    setObjectOnServer(componentObjectList: string, componentObject: string, newObject: any, component: any) {
        console.log('setObjectOnServer componentObjectList:' + componentObjectList + ' newObject:' + JSON.stringify(newObject) + ' component:' + component);
        let self = this;
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
                } else {
                    component[componentObjectList].push(newObject);
                    component[componentObject] = newObject;
                }
                component.message = '';
                component.closeSetModal();                             
              },
              (error: Response) => {
                console.log('error' + JSON.stringify(error));
                component.loading = false;
                component.message = error.text();             
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