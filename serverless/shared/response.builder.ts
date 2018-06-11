export class ResponseBuilder {

    build(error, result, callback) {
        // response
        let statusCode;
        let message;
        if (error == null) {
          console.log('result is ' + JSON.stringify(result) );  
          let statusCode = 200;
          message = result;
        } else {
          console.log('error is ' + JSON.stringify(error));            
          statusCode = 500;
          message = error;
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