const DynamoDb = require('../shared/dynamodb.js');
const Resources = require('./resources.service.js');
  
var responseFunction = function(error, result, callback) {
  console.log('result is ' + result + 'error is ' + error);  
  // response
  let response = {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
    body: JSON.stringify(result) 
  }; 
  callback(null, response);     
}; 


module.exports.handler = (event, context, callback) => {

    let db = new DynamoDb(process.env.RESOURCES_TABLE);
    let resources = new Resources(db);

    console.log('method is ' + event.httpMethod);
    console.log('method is ' + JSON.stringify(event.body));
    switch(event.httpMethod) {
      case "POST":
        let resource = JSON.parse(event.body);
        resources.putResource(resource, responseFunction, callback);
        break;
      case "GET":
        ownerid = event.pathParameters.ownerid;
        console.log('Put ownerid is ' + ownerid);
        resources.getResources(ownerid, responseFunction, callback);
        break;
      }


};