import { Injectable } from "@angular/core";
import { Http, Headers } from "@angular/http";
import { environment } from '../../environments/environment';

@Injectable()
export class DataStorageService {

    constructor(private http: Http) { }

    getObjects(name: string) {        
        return this.http.get(environment.api + '/' + name);
    }

    storeObject(object: any) { 
        let name = object.constructor.name.toLowerCase();
        console.log(environment.api + '/' + name, object);
        return this.http.put(environment.api + '/' + name, object)

    }


}