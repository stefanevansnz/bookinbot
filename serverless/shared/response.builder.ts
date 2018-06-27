export class ResponseBuilder {

/*
  console.log('error message is ' + self.errorMessage);
  if (self.errorMessage != null) {
      self.responseBuilder.build(self.errorMessage, null, callback);
      // return error
  } else if (self.successMessage != null) {
      let success = '{' + 
          '"message": "' + self.successMessage + '", ' + 
          '"user": ' + self.user + '' + 
      '}';
      self.responseBuilder.build(null, JSON.parse(success), callback);                
  } else {
      if (userId == null) {
          console.log('userSessionId is null');
          let error = new Error('User session no longer valid');
          self.responseBuilder.build(error, null, callback);
          // return error
      } else {
          console.log('execute');
          if (ownerId != null) {
              // if ownerid included in request target other user
              userId = ownerId;
          }
          // execute command
          self.dataAccessObject.applyDataUpdates(self.responseBuilder, self.requestExtractor, callback, event, userId);
      }
*/

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
            statusCode = 200;
            message = {message: this.successMessage, user: JSON.parse(this.resultSet) };
        } else if (this.errorMessage != null) {
            console.log('error is ' + JSON.stringify(this.errorMessage));            
            statusCode = 500;
            message = this.errorMessage;  
        } else if (this.resultSet == undefined) {
            console.log('result is undefined' );  
            let statusCode = 200;
            message = {};
        } else {
            console.log('result is ' + JSON.stringify(this.resultSet) );  
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
        console.log('response is ' + JSON.stringify(response))
        callback(response);     
    };           


}