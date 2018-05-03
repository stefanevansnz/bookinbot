import { Injectable } from "@angular/core";
import { Http, Headers, RequestOptions } from "@angular/http";
import { environment } from '../../environments/environment';
import { Subject } from "rxjs/Subject";
import { AuthenticationService } from "./authentication.service";

@Injectable()
export class DataStorageService {

    private addHeaders() {
        let user = this.authenticationService.getUser();                
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');        
        headers.append('Authorization', user.token);
        return headers;
    }

    constructor(private http: Http,
                private authenticationService: AuthenticationService) { }

    getObject(name: string, id: string) {  

        let user = this.authenticationService.getUser();        

        let headers = new Headers();
        headers.append('Content-Type', 'application/json');        
        headers.append('Authorization', user.token );
                        
        return this.http.get(environment.api + '/' + name + '/' + id, {headers: headers});
    }

    getObjects(name: string, id: string) {          
        let user = this.authenticationService.getUser();        

        let headers = new Headers();
        headers.append('Content-Type', 'application/json');        
        headers.append('Authorization', user.token);
        
        return this.http.get(environment.api + '/' + 
            name + (id != null ? '/' + id : ''), {headers: headers});
    }

    getObjectsParams(name: string, params: any) {          
        let user = this.authenticationService.getUser();        
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');        
        headers.append('Authorization', user.token);
        
        return this.http.get(environment.api + '/' + 
            name + (params != null ? '?' + params.name + '=' + params.value : ''), {headers: headers});
    }


    storeObject(object: any) { 
        let name = object.constructor.name.toLowerCase();
        let headers = this.addHeaders();
        console.log(environment.api + '/' + name, object);
        return this.http.post(environment.api + '/' + name, object, {headers: headers})
    }

    storeObjectParams(object: any, name: string, value: string) { 
        let headers = this.addHeaders();
        console.log(environment.api + '/' + name, object);
        return this.http.post(environment.api + '/' + name + '/' + value, object)
    }

    deleteObject(object: any) { 
        let name = object.constructor.name.toLowerCase();
        console.log(environment.api + '/' + name, object);

        let options = new RequestOptions({
            //headers: headers,
            body: object
         })

        return this.http.delete(environment.api + '/' + name, options)
    }

    deleteObjectParams(object: any, name: string, value: string) { 
        console.log(environment.api + '/' + name, object);

        let options = new RequestOptions({
            //headers: headers,
            body: object
        })

        return this.http.delete(environment.api + '/' + name +  '/' + value, options)
    }


}