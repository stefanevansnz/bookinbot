import { Injectable } from "@angular/core";
import { Http, Headers, RequestOptions, Response } from "@angular/http";
import { environment } from '../../environments/environment';
import { Subject } from "rxjs/Subject";
import { AuthenticationService } from "./authentication.service";

@Injectable()
export class DataStorageService {

    private addAuthorization(callback) {
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
                component[name] = success.json();                
              },
              (error: Response) => {
                console.log('error' + JSON.stringify(error));
                component.loading = false;
                component.message = error.text();             
              }
            );          
        });
    }

    setObjectOnServer(name: string, object: any, component: any) {
        let self = this;
        this.addAuthorization(function(headers) {
            let options = new RequestOptions({
                headers: headers,
                body: object
            })
            self.http.post(environment.api + '/' + name, object, options)            
            .subscribe(
              (success: Response) => {   
                component.loading = false;                     
                object.id = success.json().id;  
                if (component.editMode) {
                    component[name][component.editIndex] = object;
                } else {
                    component[name].push(object);
                }
                component.message = '';
                component.closeModel();                             
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
                component.closeModel();                        
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