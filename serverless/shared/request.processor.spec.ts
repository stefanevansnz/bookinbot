import {mock, instance, when, verify} from 'ts-mockito';
import { RequestExtractor } from './request.extractor';
import { DataAccessObject } from './data.access.object';
import { ResponseBuilder } from './response.builder';
import { RequestProcessor } from './request.processor';

describe("The response builder ", function() {

  let mockedRequestExtractor:RequestExtractor;
  let mockedDataAccessObject:DataAccessObject;
  let mockedResponseBuilder:ResponseBuilder;

  beforeAll(function() {
    this.mockedRequestExtractor = mock(RequestExtractor);
    this.mockedDataAccessObject = mock(DataAccessObject);
    this.mockedResponseBuilder = mock(ResponseBuilder);    
  });

  it("process the request by calling the data access object", function() {  
    let username = 'abc';
    let testBodyInput = '{"id": "123", "name": "Test Resource"}';    
    let object = JSON.parse(testBodyInput);
    let authorizer =  {
      claims: {
          username: username,
      },
    };  
    let method = 'GET';        
    let callback = function() {};

    when(this.mockedRequestExtractor.getUserName(authorizer)).thenReturn("abc");
    when(this.mockedRequestExtractor.getObject(testBodyInput)).thenReturn(object);  
    let requestExtractor: RequestExtractor = instance(this.mockedRequestExtractor);
    let dataAccessObject: DataAccessObject = instance(this.mockedDataAccessObject);
    let responseBuilder:  ResponseBuilder = instance(this.mockedResponseBuilder);    

    let processor = new RequestProcessor( requestExtractor, 
                                          dataAccessObject,
                                          responseBuilder);                                                                              
    processor.processRequest(testBodyInput, authorizer, method, callback);
    verify(this.mockedDataAccessObject.execute(responseBuilder, callback, method, username, object)).once();    
  });
});