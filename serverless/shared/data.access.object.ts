import { DynamoDb } from "./dynamodb";
import { Parameter } from "./parameter";
import { EventHolder } from "./event.holder";

import { ResponseBuilder } from "./response.builder";
import { RequestExtractor } from "./request.extractor";

export class DataAccessObject {

    db: DynamoDb;
    prefix: string;

    constructor(db) {
        this.db = db;
        this.prefix = 'bookinbot';
    }

    resource(response, eventHolder: EventHolder, callback) {   
        this.resources(response, eventHolder, callback);
    }

    resources(response, eventHolder: EventHolder, callback) {   
        //let databaseParameters = new DatabaseParameters();
        console.log('DataAccessObject resources');

        let parameters: Parameter[] = [];        
        if (eventHolder.method == 'DELETE') {
            parameters.push(new Parameter('ownerid', eventHolder.userSessionId));
            parameters.push(new Parameter('id', eventHolder.object.id));
        } else {
            parameters.push(new Parameter('ownerid', eventHolder.userSessionId));
            if (eventHolder.id != null) {
                parameters.push(new Parameter('id', eventHolder.id));
            }
        }    
        let tableName = this.prefix + '-resources'; 
        let method = eventHolder.method.toLowerCase();
        let object = eventHolder.object;
        // use table
        this.db[method](response, tableName, parameters, object, callback);    
        
        /*
        databaseParameters.parameters = parameters;
        databaseParameters.object = eventHolder.object;
        databaseParameters.tableName = 'resource'; 
        databaseParameters.method = eventHolder.method;
        //this.applyDataUpdates(caller, eventHolder, databaseParameters, callback);
        */ 
    }    

    bookings(response, eventHolder: EventHolder, callback) {   
        //let databaseParameters = new DatabaseParameters();
        console.log('DataAccessObject bookings');
        
        let parameters: Parameter[] = [];        
        if (eventHolder.method == 'DELETE') {
            parameters.push(new Parameter('resourceid', eventHolder.object.resourceid));
            parameters.push(new Parameter('id', eventHolder.object.id));
        } else {
            parameters.push(new Parameter('resourceid', eventHolder.id));
        }

        let tableName = this.prefix + '-bookings'; 
        let method = eventHolder.method.toLowerCase();
        let object = eventHolder.object;
        // use table
        this.db[method](response, tableName, parameters, object, callback);        
/*
        databaseParameters.parameters = parameters;
        databaseParameters.object = eventHolder.object;
        databaseParameters.tableName = 'booking'; 
        databaseParameters.method = eventHolder.method;
*/
        //this.applyDataUpdates(caller, eventHolder, databaseParameters, callback);    
    }

    sharessearch(response, eventHolder: EventHolder, callback) { 
        console.log('DataAccessObject sharessearch');
        callback();
    }

    shares(response, eventHolder: EventHolder, callback) { 
        console.log('DataAccessObject shares');

        let parameters: Parameter[] = [];        
        if (eventHolder.method == 'DELETE') {
            parameters.push(new Parameter('resourceid', eventHolder.object.resourceid));
            parameters.push(new Parameter('id', eventHolder.object.id));
        } else {
            console.log('share resourceid is ' + eventHolder.id);
            parameters.push(new Parameter('resourceid', eventHolder.id));
            if (eventHolder.id == null) {
                // no resourceid add username
                parameters.push(new Parameter('userid', eventHolder.userSessionId));                    
            }            
        } 

        let tableName = this.prefix + '-shares'; 
        let method = eventHolder.method.toLowerCase();
        let object = eventHolder.object;

//        console.log('object is ' + JSON.stringify(object));
//        console.log('tableName is ' + tableName);
        
        if (eventHolder.id == null && eventHolder.method == 'GET') {
            let indexName = 'shares_user_resources';
            let indexFields = 'ownerid, ownername, email, resourceid, resourcetitle, id';            
            // use index
            this.db.getIndex(response, tableName, indexName, parameters, indexFields, callback);                    
        } else {
            // use table
            this.db[method](response, tableName, parameters, object, callback);
        }
        //this.applyDataUpdates(caller, eventHolder, databaseParameters, callback);
    }

    
/*  
    applyDataUpdates(caller, eventHolder: EventHolder, databaseParameters: DatabaseParameters, callback) {
      
        console.log('userId is ' + userId);        
        let body = event.body;
        let method = event.httpMethod;
        let path = event.path.split("/")[1];
        let id = event.path.split("/")[2];
        console.log('Path is ' + path);
        console.log('Id is ' + id);

        let object = requestExtractor.getObject(body, userId);        
        let parameters = requestExtractor.getParameters(path, id, userId, object, method);
        let indexFields = requestExtractor.getIndexFields(path, id);
        let tableName = requestExtractor.getTableName(path);
        let indexName = requestExtractor.getIndex(path, id);

        let method = databaseParameters.method;
        let parameters = databaseParameters.parameters;
        let object = databaseParameters.object;
        let tableName = databaseParameters.tableName;        
        let indexFields = databaseParameters.indexFields;
        let indexName = databaseParameters.indexName;                        

        console.log('Object is ' + JSON.stringify(object));
        console.log('Parameters is ' + JSON.stringify(parameters));

        this.db.setTableName('bookinbot-' + tableName);
                        
        console.log('Method is ' + method + ' Table Name is ' + tableName);
        console.log('Index Name is ' + indexName);

        switch(method) {
            case "POST":
                this.db.putInTable(object, callback);              
                break;
            case "GET":    
                if (indexName != null) {
                    // use index
                    this.db.getFromGlobalSecondaryIndex(indexName, parameters, indexFields, callback);                    
                } else {
                    // use table
                    this.db.getFromTable(parameters, callback);
                }            
                break;
            case "DELETE":
                this.db.deleteFromTable(parameters, callback);
                break;
            }   
        }
*/
}