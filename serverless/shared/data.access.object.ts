import { DynamoDb } from "./dynamodb";
import { ResponseBuilder } from "./response.builder";

export class DataAccessObject {

    db: DynamoDb;

    constructor(db) {
        this.db = db;
    }

    execute(responseBuilder: ResponseBuilder, 
            callback: any, 
            method: string, 
            username: string, 
            object: any) {
        console.log('Method is ' + method);
        switch(method) {
            case "POST":
                object.ownerid = username;
                this.db.putInTable(object, responseBuilder.build, callback);              
                break;
            case "GET":                
                this.db.getFromTable("ownerid", username, responseBuilder.build, callback);
                break;
            case "DELETE":
                let id = object.id;            
                this.db.deleteFromTable(id, username, responseBuilder.build, callback);
                break;
            }        
    }    

}