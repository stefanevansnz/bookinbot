import { Injectable } from "@angular/core";
import { Http, Headers } from "@angular/http";
import { environment } from '../../environments/environment';

@Injectable()
export class DataStorageService {

    constructor(private http: Http) { }

    storeObject(object: any) { 

        let objectId = object.id;        
        let name = object.constructor.name.toLowerCase();

        console.log(environment.api + '/' + name, object);
        
        return this.http.put(environment.api + '/' + name, object)

    }


}