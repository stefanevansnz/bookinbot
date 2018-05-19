export class ResponseBuilder {

    build(error, result, callback) {
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
            'Access-Control-Allow-Methods': 'GET, POST, DELETE, OPTIONS',
            'Access-Control-Allow-Headers': 'Origin, Content-Type, X-Auth-Token'
          },
          body: JSON.stringify(message) 
        };         
        console.log('response is ' + JSON.stringify(response))
        callback(null, response);     
    };           


}