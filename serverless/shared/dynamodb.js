const AWS = require('aws-sdk');
const uuidv1 = require('uuid/v1');

class DynamoDb {

    constructor(tableName) {
        this.dynamoDb = new AWS.DynamoDB.DocumentClient({
            region: 'localhost',
            endpoint: 'http://localhost:8000'
        });
        this.tableName = tableName;
    }

    putInTable(responseFunction, callback, object) {
        // create in db
        if (object.id == null) {
            object.id = uuidv1();
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
    

    getFromTable(name, id, responseFunction, callback) {
        const expressionName = '#' + name;
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
        console.log('running a query where ' + name + ' = ' + id);
        this.dynamoDb.query(params, (error, result) => {
            console.log('result is ' + JSON.stringify(result));
            console.log('error is ' + JSON.stringify(error))
            //console.log('count is ' + result.Items.length);
            responseFunction(error, result, callback);
        });
    }
    
}

module.exports = DynamoDb;