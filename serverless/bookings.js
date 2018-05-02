// index.js

const serverless = require('serverless-http');
const bodyParser = require('body-parser');
const express = require('express')
const AWS = require('aws-sdk');
const uuidv1 = require('uuid/v1');
//const moment = require('moment');
const app = express()

const BOOKINGS_TABLE = process.env.BOOKINGS_TABLE;
const IS_OFFLINE = process.env.IS_OFFLINE;

let dynamoDb;

if (IS_OFFLINE === 'true') {
  dynamoDb = new AWS.DynamoDB.DocumentClient({
    region: 'localhost',
    endpoint: 'http://localhost:8000'
  })
  console.log(dynamoDb);
} else {
  dynamoDb = new AWS.DynamoDB.DocumentClient();
};

app.use((req, res, next) => {
    // Allow CORS
    res.append('Access-Control-Allow-Origin', ['*']);
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');      
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');
    // allow preflight
    if (req.method === 'OPTIONS') {
        res.send(200);
    } else {
        next();
    }    
});

app.use(
    bodyParser.json({ strict: false }
));    

// List all bookings for a resource
app.get('/bookings/:id', function (req, res) {
  try {
    // Get resource
    var resourceid = req.param('id');

    console.log('resourceid is: ' + resourceid);

    const params = {
        TableName: BOOKINGS_TABLE,
        KeyConditionExpression: "#resourceid = :resourceid",
        ExpressionAttributeNames:{
            "#resourceid": "resourceid"
        },
        ExpressionAttributeValues: {
            ":resourceid": resourceid
        }    
    }
    dynamoDb.query(params, (error, result) => {
        if (error) {
          res.status(400).json({ error: 'Could not get bookings' });
        }
        if (result) {
            res.json(result.Items);
        } else {
          res.status(404).json({ error: "Bookings not found" });
        }
    });
  } catch (error) {
    res.status(500).json({ error: String(error) });
  }      
});


// Save Booking
app.put('/booking', function (req, res) {
  try {  
    let { id, resourceid, userid, username, start, end } = req.body;    
    
    if (typeof id !== 'string') {
      res.status(400).json({ error: 'Id must have a value.' });
    }    
    if (typeof start !== 'string') {
      res.status(400).json({ error: 'Start must have a value.' });
    }
    if (typeof end !== 'string') {
      res.status(400).json({ error: 'End must have a value.' });
    }

    var findBookings = function(resourceid, start, end) {
      var params = {
        TableName: BOOKINGS_TABLE,
        KeyConditionExpression: "#resourceid = :resourceid and " +
                                ":start > #start_name and " +
                                ":end < #end_name",
        ExpressionAttributeNames:{
            "#resourceid": "resourceid",
            "#start_name": "start",
            "#end_name": "end"
        },
        ExpressionAttributeValues: {
            ":resourceid": resourceid,
            ":start": start,
            ":end": end,                      
        }    
      }
      dynamoDb.query(params, (error, result) => {
          if (error) {
            res.status(400).json({ error: 'Could not check bookings' });
          }
          if (result) {
              //res.json(result.Items);
              console.log('result.Items.length ' + result.Items.length );
              return true;
          } 
      });      
      return false;
    }

    var createOrUpdateBooking = function(id, resourceid, userid, username, start, end) {
      var newBooking = false;

      var currentDateTime = new Date().toString();
  
      if (id == "") {
        newBooking = true;
        id = uuidv1();
      }    
  
      console.log('newBooking is: ' + newBooking);
      console.log('id is: ' + id);
      console.log('resourceid is: ' + resourceid);    
      console.log('userid is: ' + userid); 
      console.log('username is: ' + username); 
         
      console.log('currentDateTime is: ' + currentDateTime);    
      console.log('start: ' + start);
      console.log('end: ' + end);

      if (newBooking) {
        // create in db
        var params = {
          TableName: BOOKINGS_TABLE,
          Item: {
            id: id,
            resourceid: resourceid,
            userid: userid,
            username: username,
            createddate: currentDateTime,
            updateddate: currentDateTime,
            start: start,
            end: end,  
          }
        }             
        dynamoDb.put(params, (error) => {
          if (error) {
            res.status(error.statusCode).json({ error: error});
          } else {
            res.json({ id, start, end });
          }
        });        
      } else {
        // update in db    
        params = {
          TableName: BOOKINGS_TABLE,
          Key:{
              "id": id,
              "resourceid": resourceid
          },
          UpdateExpression: "set #start_name = :start, #end_name = :end, updateddate = :updateddate",
          ExpressionAttributeValues:{
              ":start": start,
              ":end": end,            
              ":updateddate": currentDateTime
          },
          ExpressionAttributeNames:{
            '#start_name': 'start',
            '#end_name': 'end'
          },
          ReturnValues:"UPDATED_NEW"
        };
  
        dynamoDb.update(params, (error) => {
          if (error) {
            res.status(error.statusCode).json({ error: error});
          } else {
            res.json({ id, start, end });
          }
        });        
          
      }      
    }

    if (findBookings(resourceid, start, end)) {
      res.status(400).json({ error: "Sorry, this booking is already taken" });    
    } else {
      createOrUpdateBooking(id, resourceid, userid, username, start, end);
    }

  } catch (error) {
    res.status(500).json({ error: String(error) });
  } 
});    

// Delete Booking
app.delete('/booking', function (req, res) {

  try {  
    let { id, resourceid } = req.body;  

    console.log('id is: ' + id);
    console.log('resourceid: ' + resourceid);    

    const params = {
      TableName: BOOKINGS_TABLE,
      Key: {
        "id": id,
        "resourceid": resourceid         
      },
    };

    dynamoDb.delete(params, (error) => {
      if (error) {
        res.status(error.statusCode).json({ error: error});
      } else {
        res.json({ id });
      }
    });

  } catch (error) {
    res.status(500).json({ error: String(error) });
  }     
  
});

module.exports.handler = serverless(app);