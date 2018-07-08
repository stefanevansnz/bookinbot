import { EventHolder } from "./event.holder";

export class RequestExtractor {

    buildEventHolder(event) {


        let eventHolder = new EventHolder();

        // set user session id
        let authorizer = event.requestContext.authorizer;


        let userSessionId = null;
        if (authorizer.claims != null) {
            //console.log('found authorizer.claims');
            userSessionId = authorizer.claims.sub;
        }     
        // console.log('userSessionId is ' + userSessionId);          
        eventHolder.userSessionId = userSessionId;

        // get query parameters
        eventHolder.queryStringParameters = event.queryStringParameters;

        // set object for update with ownerid
        eventHolder.body = event.body;
        if (eventHolder.body != null) {
            eventHolder.object = JSON.parse(eventHolder.body); 
            eventHolder.object.ownerid = eventHolder.userSessionId;
        }
        console.log('eventHolder.body is ' +  eventHolder.body);          
        eventHolder.method = event.httpMethod;

        eventHolder.path = event.path.split("/")[1];
       // console.log('eventHolder.path is ' +  eventHolder.path);          
        if (eventHolder.path == 'sharessearch') {
            eventHolder.id = event.path.split("/")[2];
            eventHolder.email = event.path.split("/")[3];   
            //console.log('eventHolder.id is ' +  eventHolder.id);          
            //console.log('eventHolder.email is ' +  eventHolder.email);          
        } else {
            eventHolder.id = event.path.split("/")[2];
            eventHolder.ownerId = event.path.split("/")[3];    
            //console.log('eventHolder.id is ' +  eventHolder.id);          
            //console.log('eventHolder.ownerId is ' +  eventHolder.ownerId);          
        }
        console.log('eventHolder.id is ' +  eventHolder.id);          

        return eventHolder;
    }

}