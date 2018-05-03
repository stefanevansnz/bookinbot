const DynamoDb = require('../shared/dynamodb.js');
const Resources = require('./resources.service.js');
  
var responseFunction = function(error, result, callback) {
  console.log('result is ' + result + ' error is ' + error);  
  // response
  let statusCode = 200;
  let message = result;
  if (error != null) {
    statusCode = 500;
    message = error.message;
  }

  let response = {
    statusCode: statusCode,
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
    body: JSON.stringify(message) 
  }; 
  callback(null, response);     
}; 


module.exports.handler = (event, context, callback) => {

    let db = new DynamoDb(process.env.RESOURCES_TABLE);
    let resources = new Resources(db);

    console.log('event.body is ' + JSON.stringify(event.body));

    var username = event.requestContext.authorizer.claims.username;
    console.log('username is ' + JSON.stringify(username));    
    console.log('method is ' + event.httpMethod);
    switch(event.httpMethod) {
      case "POST":
        let resource = JSON.parse(event.body);
        resource.ownerid = username;
        resources.putResource(responseFunction, callback, resource);
        break;
      case "GET":
        resources.getResources(responseFunction, callback, username);
        break;
      }


};