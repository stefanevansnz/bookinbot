import { RequestExtractor } from './request.extractor';
import {mock, instance, when, verify} from 'ts-mockito';

describe("The request extractor ", function() {

    it("gets an object name when in request.", function() {        
        let testResourceInput = '{"id": "123", "name": "Test Resource"}';      
        let object = new RequestExtractor().getObject(testResourceInput);
        expect(object.id).toEqual("123");
        expect(object.name).toEqual("Test Resource");
    });

    it("gets the user name when in request.", function() {        
        let authorizer =  {
            claims: {
                username: 'abc',
            },
        };        
        let username = new RequestExtractor().getUserName(authorizer);
        expect(username).toEqual('abc');
    });

});