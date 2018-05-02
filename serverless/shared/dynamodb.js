const AWS = require('aws-sdk');

class DynamoDb {

    constructor(tableName) {
        this.dynamoDb = new AWS.DynamoDB.DocumentClient({
            region: 'localhost',
            endpoint: 'http://localhost:8000'
        });
        this.tableName = tableName;
    }

    putInTable(object, responseFunction, callback) {
        // create in db
        let params = {
            TableName: this.tableName,
            Item: object
        }             
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
            responseFunction(error, result, callback);
        });
    }
    
}

module.exports = DynamoDb;