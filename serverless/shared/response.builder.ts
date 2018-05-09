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
          },
          body: JSON.stringify(message) 
        }; 
        callback(null, response);     
    };           


}