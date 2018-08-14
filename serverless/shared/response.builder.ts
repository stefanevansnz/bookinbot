export class ResponseBuilder {

    resultSet: any;

    errorMessage: string;

    successMessage: string;

    build(callback) {
        // response
        console.log('Building Response');
        let statusCode;
        let message;
        if (this.successMessage != null) {   
            console.log('successMessage is ' + JSON.stringify(this.successMessage));
            console.log('resultSet is ' + JSON.stringify(this.resultSet));            
            statusCode = 200;
            message = {message: this.successMessage, user: JSON.parse(this.resultSet) };
        } else if (this.errorMessage != null) {
            console.log('error is ' + JSON.stringify(this.errorMessage));            
            statusCode = 500;
            message = {message: this.errorMessage};  
        } else if (this.resultSet == undefined) {
            console.log('result is undefined' );  
            let statusCode = 200;
            message = {};
        } else {
            //console.log('result is ' + JSON.stringify(this.resultSet) );  
            let statusCode = 200;
            message = this.resultSet;
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
        //console.log('response is ' + JSON.stringify(response))
        callback(response);     
    };           


}