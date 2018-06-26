import { DynamoDb } from './shared/dynamodb';
import { ResponseBuilder } from './shared/response.builder';
import { RequestValidator } from './shared/request.validator';
import { RequestExtractor } from './shared/request.extractor';
import { ResponseModel } from './shared/response.model';
import { DataAccessObject } from './shared/data.access.object';
import { RequestProcessor } from './shared/request.processor';
import { UserAccess } from './shared/user.access';



export function execute(event: any, context, callback: any) {

    const STAGE = process.env.STAGE;

    let db = new DynamoDb(STAGE);
    let requestValidator = new RequestValidator();
    let requestExtractor = new RequestExtractor();
    let dataAccessObject = new DataAccessObject(db);
    let responseBuilder = new ResponseBuilder();
    let userAccess = new UserAccess();
    
    let processor = new RequestProcessor(requestExtractor, dataAccessObject, responseBuilder, userAccess, requestValidator);
    //console.log('processRequest is ' + JSON.stringify(event))

    processor.processRequest(event, callback)
}