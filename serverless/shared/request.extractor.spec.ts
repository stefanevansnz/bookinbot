import { RequestExtractor } from './request.extractor';
import {mock, instance, when, verify} from 'ts-mockito';

describe("The request extractor ", function() {

    it("gets an object name when in request.", function() {        
        let inputObject = '{"id": "123", "name": "Test Resource"}';  
        let username = 'abc';    
        let object = new RequestExtractor().getObject(inputObject, username);
        expect(object.id).toEqual("123");
        expect(object.name).toEqual("Test Resource");
        expect(object.ownerid).toEqual("abc");        
    });

    it("gets the user name when in request.", function() {        
        let authorizer =  {
            claims: {
                sub: 'abc',
            },
        };        
        let username = new RequestExtractor().getUserName(authorizer);
        expect(username).toEqual('abc');
    });

});