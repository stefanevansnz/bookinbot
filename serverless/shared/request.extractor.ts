import { Parameter } from "./parameter";

export class RequestExtractor {

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
        let username = null;
        if (authorizer.claims != null) {
            console.log('found authorizer.claims');
            username = authorizer.claims.sub;
        }     
        console.log('username is ' + username);   
        return username;
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
                /*
                parameters.push(new Parameter('ownerid', username));
                if (id != null) {
                    parameters.push(new Parameter('resourceid', id));
                } 
                */              
            }
        }
        
        return parameters;

    }



}