import { DataAccessObject } from "../shared/data.access.object";
import { RequestValidator } from "../shared/request.validator";

export class ResourcesCommand {

    requestValidator: RequestValidator;
    dataAccessObject: DataAccessObject;

    constructor(requestValidator: RequestValidator,
                dataAccessObject: DataAccessObject) {
        this.requestValidator = requestValidator;                    
        this.dataAccessObject = dataAccessObject;
    }

    execute(responseBuilder, eventHolder, callback) {
        console.log('ResourcesCommand');
        let self = this;
        eventHolder.id = null;
        self.dataAccessObject.resources(responseBuilder, eventHolder, function() {
            callback();
        });

    }

}