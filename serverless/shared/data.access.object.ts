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
        
        if (eventHolder.id == null && eventHolder.method == 'GET') {
            let indexName = 'shares_user_resources';
            let indexFields = 'ownerid, ownername, email, resourceid, resourcetitle, id';            
            // use index
            this.db.getIndex(response, tableName, indexName, parameters, indexFields, callback);                    
        } else {
            // use table
            this.db[method](response, tableName, parameters, object, callback);
        }
    }

}