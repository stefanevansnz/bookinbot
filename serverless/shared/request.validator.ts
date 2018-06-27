import { EventHolder } from "./event.holder";
import { ResponseBuilder } from "./response.builder";

export class RequestValidator {

    resources(response: ResponseBuilder, eventHolder: EventHolder, callback) { 
        console.log('RequestValidator resources');
        callback();
    }

    resource(response: ResponseBuilder, eventHolder: EventHolder, callback) { 
        console.log('RequestValidator resource');
        callback();
    }


    bookings(response: ResponseBuilder, eventHolder: EventHolder, callback) { 
        console.log('RequestValidator bookings');
        callback();
    }

    shares(response: ResponseBuilder, eventHolder: EventHolder, callback) { 
        console.log('RequestValidator shares');
        callback();
    }

    sharessearch(response: ResponseBuilder, eventHolder: EventHolder, callback) { 
        console.log('RequestValidator sharessearch');
        response.errorMessage = 'No good';
        callback();
    }

}