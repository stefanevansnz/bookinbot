import { Injectable } from "@angular/core";
import { Http, Headers, RequestOptions } from "@angular/http";
import { environment } from '../../environments/environment';
import { Subject } from "rxjs/Subject";
import { AuthenticationService } from "./authentication.service";

@Injectable()
export class DataStorageService {

    constructor(private http: Http,
                private authenticationService: AuthenticationService) { }

    getObject(name: string, id: string) {  

        let headers = new Headers();
        headers.append('Content-Type', 'application/json');        
        headers.append('Authorization', this.authenticationService.getToken());
                
        console.log(environment.api + '/' + name + ' id is ' + id + ' token is ' + this.authenticationService.getToken());
        
        return this.http.get(environment.api + '/' + name + '/' + id, {headers: headers});
    }

    getObjects(name: string, id: string) {  
        
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');        
        headers.append('Authorization', this.authenticationService.getToken());

        console.log(environment.api + '/' + name + ' id is ' + id + ' token is ' + this.authenticationService.getToken());        
        
        return this.http.get(environment.api + '/' + 
            name + (id != null ? '/' + id : ''), {headers: headers});

    }

    storeObject(object: any) { 
        let name = object.constructor.name.toLowerCase();
        console.log(environment.api + '/' + name, object);
        return this.http.put(environment.api + '/' + name, object)
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


}