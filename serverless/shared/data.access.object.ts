import { DynamoDb } from "./dynamodb";
import { Parameter } from "./parameter";
import { EventHolder } from "./event.holder";

export class DataAccessObject {

    db: DynamoDb;
    prefix: string;

    constructor(db) {
        this.db = db;
        this.prefix = 'bookinbot';
    }


    resources(response, eventHolder: EventHolder, callback) {   

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
    }    

    bookings(response, eventHolder: EventHolder, callback) {   
        //let databaseParameters = new DatabaseParameters();
        console.log('DataAccessObject bookings eventHolder.id is ' + eventHolder.id);
        
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
    }

    sharessearch(response, eventHolder: EventHolder, callback) { 
        console.log('DataAccessObject sharessearch');
        callback();
    }

    shares(response, eventHolder: EventHolder, callback) { 
        console.log('DataAccessObject shares id is ' + eventHolder.id);

        let parameters: Parameter[] = [];   
        let resourceId = eventHolder.id;

        if (eventHolder.method == 'DELETE') {
            parameters.push(new Parameter('resourceid', eventHolder.object.resourceid));
            parameters.push(new Parameter('id', eventHolder.object.id));
        } else {
            console.log('resource id is ' + eventHolder.id);
            parameters.push(new Parameter('resourceid', resourceId));
            if (resourceId == null) {
                // no resourceId included so add username
                parameters.push(new Parameter('userid', eventHolder.userSessionId));                    
            }            
        } 

        let tableName = this.prefix + '-shares'; 
        let method = eventHolder.method.toLowerCase();
        let object = eventHolder.object;
        console.log('DataAccessObject parameters length ' + parameters.length);

        // only use index on front page when no resource is included
        if (resourceId == null && eventHolder.method == 'GET') {
            // only use index for searching all resources a user has access.
            // hash is userid and range is resources      
            let indexName = 'shares_user_resources';
            let indexFields = 'ownername, resourceid, resourcetitle';            
            this.db.getIndex(response, tableName, indexName, parameters, indexFields, callback);                    
        } else {
            // use table
            this.db[method](response, tableName, parameters, object, callback);
        }
    }

}