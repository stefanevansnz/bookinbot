//const AWS = require('aws-sdk');
//const uuidv1 = require('uuid/v1');
import * as AWS from 'aws-sdk';
import { v4 as uuid } from 'uuid';
//const uuidv1: string = uuid();

export class DynamoDb {

    tableName: string;
    dynamoDb: any;

    constructor(tableName: string, stage: string) {
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
        this.tableName = tableName;
    }

    getFromTable(name, id, responseFunction, callback) {
        let expressionName = '#' + name;
        let expressionValue = ':' + name;
        let params = {
            TableName: this.tableName,
            KeyConditionExpression: expressionName + " = " + expressionValue,
            ExpressionAttributeNames:{
                [expressionName] : name
            },
            ExpressionAttributeValues: {
                [expressionValue]: id
            }    
        }
        console.log('db params: ' + JSON.stringify(params));
        console.log('running a query where ' + name + ' = ' + id);
        this.dynamoDb.query(params, (error, result) => {
            responseFunction(error, result.Items, callback);
        });
    }

    putInTable(object, responseFunction, callback) {
        // create in db
        if (object.id == null) {
            object.id = uuid();
        }        
        let params = {
            TableName: this.tableName,
            Item: object
        }    
        console.log('putInTable is ' + JSON.stringify(params));         
        this.dynamoDb.put(params, (error, result) => {
            responseFunction(error, result, callback);
        });      
    }
    
    deleteFromTable(id, ownerid, responseFunction, callback) {
        let params = {
            TableName: this.tableName,
            Key: {
                id: id,
                ownerid: ownerid 
            }
        }      
        console.log('deleteFromTable is ' + JSON.stringify(params));         
        this.dynamoDb.delete(params, (error, result) => {
            responseFunction(error, result, callback);
        });      
    }

    
}
