const DynamoDb = require('../shared/dynamodb.js');
const Resources = require('./resources.service.js');

describe("The resource service ", function() {

  let db;
  let resources;

  beforeAll(function() {
    db = new DynamoDb();
    resources = new Resources(db);    
  });

  it("can get resource from a database", function() {
    let testResource = {"id": "1", "ownerid": "1", "title": "Apartment"}
    spyOn(db, "getResources").and.returnValue(testResource);
    let result = resources.getResources(ownerid);
    expect(result).toBe(testResource);
  });
});