import * as AWS from 'aws-sdk';
import { v4 as uuid } from 'uuid';
import { Parameter } from './parameter';

export class DynamoDb {

    tableName: string;
    dynamoDb: any;

    constructor(stage: string) {
        console.log('DynamoDb stage is ' + stage);
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

    setTableName(tableName: string) {
        this.tableName = tableName;
    }

    getFromGlobalSecondaryIndex(indexName: string, parameters: Parameter[], responseFunction, callback) {

        let keyConditionExpression = '';
        let expressionAttributeValues = '';        

        parameters.forEach((param) => {
            console.log('param name is ' + param.name + ' - ' + param.value );
            if (param.value != undefined) {
                keyConditionExpression += param.name + ' = :' + param.name;
                expressionAttributeValues += '":' + param.name + '" : "' + param.value + '"';
                //console.log('param name is ' + param.name + ' - ' + param.value );    
            } 
        });

        //let userid = 'a07d48d7-7786-4fc5-96a9-64071e3733ef';

        let params = {
            TableName: this.tableName,
            IndexName: indexName,
            //KeyConditionExpression: 'userid = :userid',
            //ExpressionAttributeValues: { ':userid': userid },
            KeyConditionExpression: keyConditionExpression,
            ExpressionAttributeValues:
                JSON.parse('{' + expressionAttributeValues + '}'),
            ProjectionExpression: "ownerid, email, resourceid, id",
            ScanIndexForward: false 
        } 

        console.log('running DB query params: ' + JSON.stringify(params));

        this.dynamoDb.query(params, (error, result) => {
            console.log('result is' + JSON.stringify(result));
            console.log('error is' + JSON.stringify(error));                
            if (result.Items) {
                result = result.Items;
            }
            responseFunction(error, result, callback);
        });

    }

    getFromTable(parameters: Parameter[], responseFunction, callback) {
        
        let numberOfParameters = parameters.length;
        let keyConditionExpression = '';
        let expressionAttributeNames = '';
        let expressionAttributeValues = '';
        let expressionCount = 1;
        parameters.forEach((param) => {
            console.log('param name is ' + param.name + ' - ' + param.value );
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

        console.log('keyConditionExpression is ' + keyConditionExpression);
        console.log('expressionAttributeNames is ' + expressionAttributeNames);
        console.log('expressionAttributeValues is ' + expressionAttributeValues);

        let params = {
            TableName: this.tableName,
            KeyConditionExpression: keyConditionExpression,
            ExpressionAttributeNames:                
                JSON.parse('{' + expressionAttributeNames + '}'),
            ExpressionAttributeValues: 
                JSON.parse('{' + expressionAttributeValues + '}')                
        } 

        console.log('running DB query params: ' + JSON.stringify(params));

        this.dynamoDb.query(params, (error, result) => {
            console.log('result is' + JSON.stringify(result));
            console.log('error is' + JSON.stringify(error));                
            if (result.Items) {
                result = result.Items;
            }
            responseFunction(error, result, callback);
        });
    }

    
    putInTable(object, responseFunction, callback) {
        // create in db
        if (object.id == null) {
            object.id = uuid();
        }        
        console.log('object.id is ' + object.id); 
        let params = {
            TableName: this.tableName,
            Item: object
        }    
        console.log('putInTable is ' + JSON.stringify(params));         
        this.dynamoDb.put(params, (error, result) => {
            //console.log('putInTable result is ' + JSON.stringify(result));                     
            result.id = object.id;
            responseFunction(error, result, callback);
        });      
    }
    
    deleteFromTable(parameters: Parameter[], responseFunction, callback) {

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
            TableName: this.tableName,
            Key: JSON.parse('{' + keyNameValues + '}')
        }     
        
        console.log('deleteFromTable is ' + JSON.stringify(params));         
        this.dynamoDb.delete(params, (error, result) => {
            responseFunction(error, result, callback);
        });      
    }

    
}
