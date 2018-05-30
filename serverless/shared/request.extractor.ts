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
        return '';
    }

    getParameters(path, id, username) {
        let parameters: Parameter[] = [];
        if (path.includes('resource')) {
            parameters.push(new Parameter('ownerid', username));
            if (id != null) {
                parameters.push(new Parameter('id', id));
            }
        }
        if (path.includes('booking')) {
            parameters.push(new Parameter('resourceid', id));
        }
        
        return parameters;

    }

/*
    getPrimaryKey(path, id) {
        if (path.includes('resource')) {
            if (id) {
                return 'id';
            } else {
                return 'ownerid';
            }            
            //return 'ownerid';
            //return 'id';
        }
        if (path.includes('booking')) {
            return 'resourceid';
        }
        return '';
    }

    getPrimaryId(path, id, username) {
        if (path.includes('resource')) {
            if (id) {
                return id;
            } else {
                return username;
            }
        }
        if (path.includes('booking')) {
            return id;
        }
        return '';
        
    }
 */   



}