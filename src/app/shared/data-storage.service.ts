import { Injectable } from "@angular/core";
import { Http, Headers, RequestOptions } from "@angular/http";
import { environment } from '../../environments/environment';

@Injectable()
export class DataStorageService {

    constructor(private http: Http) { }

    getObject(name: string, object: any) {  
        //let name = object.constructor.name.toLowerCase();
        console.log(environment.api + '/' + name, object);

        let options = new RequestOptions({
            //headers: headers,
            body: object
         })
        
        return this.http.get(environment.api + '/' + name, options);
    }

    getObjects(name: string) {        
        return this.http.get(environment.api + '/' + name);
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