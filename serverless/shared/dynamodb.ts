import * as AWS from 'aws-sdk';
import { v4 as uuid } from 'uuid';
import { Parameter } from './parameter';
import { ResponseBuilder } from './response.builder';

export class DynamoDb {

    dynamoDb: any;

    constructor(stage: string) {
        //console.log('DynamoDb stage is ' + stage);
        if (stage == 'dev') {
            this.dynamoDb = new AWS.DynamoDB.DocumentClient({
                region: 'localhost',
                endpoint: 'http://localhost:8000'
            });    
        } else {
            // go production
            this.dynamoDb = new AWS.DynamoDB.DocumentClient();
        }
    }

    getIndex(response, tableName: string, indexName: string, parameters: Parameter[], projectionExpression, callback) {
        console.log('DynamoDb GET INDEX');
        let keyConditionExpression = '';
        let expressionAttributeValues = '';        

        parameters.forEach((param) => {
            //console.log('param name is ' + param.name + ' - ' + param.value );
            if (param.value != undefined) {
                keyConditionExpression += param.name + ' = :' + param.name;
                expressionAttributeValues += '":' + param.name + '" : "' + param.value + '"';
                //console.log('param name is ' + param.name + ' - ' + param.value );    
            } 
        });
        
        //console.log('keyConditionExpression ' + keyConditionExpression);
        //console.log('expressionAttributeValues ' + expressionAttributeValues);

        let params = {
            TableName: tableName,
            IndexName: indexName,
            //KeyConditionExpression: 'userid = :userid',
            //ExpressionAttributeValues: { ':userid': userid },
            KeyConditionExpression: keyConditionExpression,
            ExpressionAttributeValues:
                JSON.parse('{' + expressionAttributeValues + '}'),
            ProjectionExpression: projectionExpression,
            ScanIndexForward: false 
        } 

        console.log('Running DB query params: ' + JSON.stringify(params));

        this.dynamoDb.query(params, (error, result) => {
            console.log('Result is ' + JSON.stringify(result));
            console.log('Error is ' + JSON.stringify(error));                
            if (result.Items) {
                result = result.Items;
            }
            response.resultSet = result;
            callback();

        });

    }

    get(response: ResponseBuilder, tableName: string, parameters: Parameter[], object, callback) {
        console.log('DynamoDb GET');
        let numberOfParameters = parameters.length;
        let keyConditionExpression = '';
        let expressionAttributeNames = '';
        let expressionAttributeValues = '';
        let expressionCount = 1;
        parameters.forEach((param) => {
            console.log('Param name is ' + param.name + ' - ' + param.value );
            if (param.value != undefined) {
                keyConditionExpression += '#' + param.name + ' = :' + param.name;
                expressionAttributeNames += '"#' + param.name + '" : "' + param.name + '"';
                expressionAttributeValues += '":' + param.name + '" : "' + param.value + '"';
                if (expressionCount < numberOfParameters) {
                    keyConditionExpression += ' AND ';   
                    expressionAttributeNames += ', ';   
                    expressionAttributeValues += ', ';          
                }
                expressionCount++;
            }
        });
        let params = {
            TableName: tableName,
            KeyConditionExpression: keyConditionExpression,
            ExpressionAttributeNames:                
                JSON.parse('{' + expressionAttributeNames + '}'),
            ExpressionAttributeValues: 
                JSON.parse('{' + expressionAttributeValues + '}')                
        } 

        console.log('Running DB query params: ' + JSON.stringify(params));

        this.dynamoDb.query(params, (error, result) => {
            console.log('Result is ' + JSON.stringify(result));
            console.log('Error is ' + JSON.stringify(error));                
            if (result.Items) {
                result = result.Items;
            }
            response.resultSet = result;
            callback();
        });
    }

    post(response: ResponseBuilder, tableName: string, parameters: Parameter[], object, callback) {
        console.log('DynamoDb POST');
        
        // create in db
        if (object.id == null) {
            object.id = uuid();
        }        
        console.log('object.id is ' + object.id); 
        let params = {
            TableName: tableName,
            Item: object
        }    
        console.log('putInTable is ' + JSON.stringify(params));         
        this.dynamoDb.put(params, (error, result) => {
            response.resultSet  = { 'id' : object.id };
            console.log('putInTable result is ' + JSON.stringify(response));                     
            callback();
        });      
    }
    
    delete(response: ResponseBuilder, tableName: string, parameters: Parameter[], object, callback) {
        console.log('DynamoDb DELETE');

        let keyNameValues = '';
        let expressionCount = 1; 
        let numberOfParameters = parameters.length;       
        parameters.forEach((param) => {
            console.log('param name is ' + param.name + ' - ' + param.value );
            keyNameValues += '"' + param.name  + '": "' +  param.value  + '"';
            if (expressionCount < numberOfParameters) {
                keyNameValues += ', ';                    
            }  
            expressionCount++;
        });

        console.log('keyNameValues is ' + keyNameValues);
        
        let params = {
            TableName: tableName,
            Key: JSON.parse('{' + keyNameValues + '}')
        }     
        
        console.log('deleteFromTable is ' + JSON.stringify(params));         
        this.dynamoDb.delete(params, (error, result) => {
            callback();
        });      
    }

    
}
