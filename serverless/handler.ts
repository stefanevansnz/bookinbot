import { DynamoDb } from './shared/dynamodb';
import { ResponseBuilder } from './shared/response.builder';
import { RequestExtractor } from './shared/request.extractor';
import { ResponseModel } from './shared/response.model';
import { DataAccessObject } from './shared/data.access.object';
import { RequestProcessor } from './shared/request.processor';
import { UserAdmin } from './shared/user.admin';



export function execute(event: any, context, callback: any) {

    const STAGE = process.env.STAGE;

    let requestExtractor = new RequestExtractor();
    let db = new DynamoDb(STAGE);
    let dataAccessObject = new DataAccessObject(db);
    let responseBuilder = new ResponseBuilder();
    let userAdmin = new UserAdmin();
    
    let processor = new RequestProcessor(requestExtractor, dataAccessObject, responseBuilder, userAdmin);
    //console.log('processRequest is ' + JSON.stringify(event))

    processor.processRequest(event, callback)
}