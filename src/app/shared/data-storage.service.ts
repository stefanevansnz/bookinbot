import { Injectable } from "@angular/core";
import { environment } from '../../environments/environment';

@Injectable()
export class DataStorageService {

    storeObject(object: any) {        
        var name = object.constructor.name.toLowerCase();
        console.log(environment.api + '/' + name, object);
        //return this.http.put(environment.api + '/' + name, object);
    }


}