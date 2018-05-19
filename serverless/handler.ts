import { DynamoDb } from './shared/dynamodb';
import { ResponseBuilder } from './shared/response.builder';
import { RequestExtractor } from './shared/request.extractor';
import { ResponseModel } from './shared/response.model';
import { DataAccessObject } from './shared/data.access.object';
import { RequestProcessor } from './shared/request.processor';



export function execute(event: any, context, callback: any) {

    const STAGE = process.env.STAGE;
    let requestExtractor = new RequestExtractor();
    let db = new DynamoDb('bookinbot-resources', STAGE);
    let dataAccessObject = new DataAccessObject(db);
    let responseBuilder = new ResponseBuilder();

    console.log('event is ' + event.requestContext.authorizer);
    console.log('event is ' + JSON.stringify(event));
    let body = event.body;
    let method = event.httpMethod;
    let authorizer = event.requestContext.authorizer;

    let processor = new RequestProcessor(requestExtractor, dataAccessObject, responseBuilder);
    processor.processRequest(body, authorizer, method, callback)
}