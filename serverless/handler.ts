import { DynamoDb } from './shared/dynamodb';
import { ResponseBuilder } from './shared/response.builder';
import { RequestExtractor } from './shared/request.extractor';
import { ResponseModel } from './shared/response.model';
import { DataAccessObject } from './shared/data.access.object';
import { RequestProcessor } from './shared/request.processor';

export function hello(event: any, context, callback: any) {

    let requestExtractor = new RequestExtractor();
    let db = new DynamoDb('bookinbot-resources');
    let dataAccessObject = new DataAccessObject(db);
    let responseBuilder = new ResponseBuilder();

    console.log('event is ' + event.requestContext.authorizer);
    let body = event.body;
    let method = event.httpMethod;
    let authorizer = event.requestContext.authorizer;

    let processor = new RequestProcessor(requestExtractor, dataAccessObject, responseBuilder);
    processor.processRequest(body, authorizer, method, callback)
}