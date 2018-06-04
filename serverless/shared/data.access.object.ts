import { DynamoDb } from "./dynamodb";
import { ResponseBuilder } from "./response.builder";
import { RequestExtractor } from "./request.extractor";

export class DataAccessObject {

    db: DynamoDb;

    constructor(db) {
        this.db = db;
    }

    execute(responseBuilder, requestExtractor, callback, event, username) {

        let body = event.body;
        let method = event.httpMethod;
        let path = event.path.split("/")[1];
        let id = event.path.split("/")[2];

        let object = requestExtractor.getObject(body, username);
        let tableName = requestExtractor.getTableName(path);
        let parameters = requestExtractor.getParameters(path, id, username);

        this.db.setTableName('bookinbot-' +tableName);
                        
        console.log('Method is ' + method + ' Table Name is ' + tableName);
        console.log('Object is ' + JSON.stringify(object));
        console.log('Parameters is ' + JSON.stringify(parameters));

        switch(method) {
            case "POST":
                this.db.putInTable(object, responseBuilder.build, callback);              
                break;
            case "GET":                
                this.db.getFromTable(parameters, responseBuilder.build, callback);
                break;
            case "DELETE":
                this.db.deleteFromTable(object, responseBuilder.build, callback);
                break;
            }        
    }    

}