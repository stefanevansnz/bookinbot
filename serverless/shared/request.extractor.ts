import { EventHolder } from "./event.holder";

export class RequestExtractor {

    buildEventHolder(event) {


/*        console.log('body is ' + body);
        if (event.body != null) {
            let object = JSON.parse(body);
            object.ownerid = username;
            return object;    
        }         
*/
        let eventHolder = new EventHolder();

        // set user session id
        let authorizer = event.requestContext.authorizer;
        let userSessionId = null;
        if (authorizer.claims != null) {
            //console.log('found authorizer.claims');
            userSessionId = authorizer.claims.sub;
        }     
        console.log('userSessionId is ' + userSessionId);          
        eventHolder.userSessionId = userSessionId;

        // set object for update with ownerid
        eventHolder.body = event.body;
        if (eventHolder.body != null) {
            eventHolder.object = JSON.parse(eventHolder.body); 
            eventHolder.object.ownerid = eventHolder.userSessionId;
        }
        eventHolder.method = event.httpMethod;

        eventHolder.path = event.path.split("/")[1];
        eventHolder.id = event.path.split("/")[2];
        eventHolder.ownerId = event.path.split("/")[3];

        return eventHolder;
    }

/*
    getObject(body, username) {
        console.log('body is ' + body);
        if (body == null) {
            return null;
        } else {
            let object = JSON.parse(body);
            object.ownerid = username;
            return object;    
        }
    }

    getUserName(authorizer) {
        console.log('in getUserName');

    }


    getTableName(path) {
        if (path.includes('resource')) {
            return 'resources';
        }
        if (path.includes('booking')) {
            return 'bookings';
        }
        if (path.includes('share')) {
            return 'shares';
        }
        return '';
    }

    getIndex(path, id) {
        if (path.includes('share') && id == null) {
            return 'shares_user_resources';
        } else {
            return null;
        }
    }

    getIndexFields(path, id) {
        if (path.includes('share') && id == null) {
            return 'ownerid, ownername, email, resourceid, resourcetitle, id';
        } else {
            return null;
        }

    }

    getParameters(path, id, username, object, method) {
        let parameters: Parameter[] = [];
        if (path.includes('resource')) {
            if (method == 'DELETE') {
                parameters.push(new Parameter('ownerid', username));
                parameters.push(new Parameter('id', object.id));
            } else {
                parameters.push(new Parameter('ownerid', username));
                if (id != null) {
                    parameters.push(new Parameter('id', id));
                }
            }            
        }
        if (path.includes('booking')) {
            if (method == 'DELETE') {
                parameters.push(new Parameter('resourceid', object.resourceid));
                parameters.push(new Parameter('id', object.id));
            } else {
                parameters.push(new Parameter('resourceid', id));
            }
        }
        if (path.includes('share')) {
            if (method == 'DELETE') {
                parameters.push(new Parameter('resourceid', object.resourceid));
                parameters.push(new Parameter('id', object.id));
            } else {
                console.log('share resourceid is ' + id);
                parameters.push(new Parameter('resourceid', id));
                if (id == null) {
                    // no resourceid add username
                    parameters.push(new Parameter('userid', username));                    
                }            
            }
        }
        
        return parameters;

    }
*/


}