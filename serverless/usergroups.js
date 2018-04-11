// index.js

const serverless = require('serverless-http');
const bodyParser = require('body-parser');
const express = require('express')
const AWS = require('aws-sdk');
const uuidv1 = require('uuid/v1');
const app = express()

const USERGROUPS_TABLE = process.env.USERGROUPS_TABLE;
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

// List All Usergroups
app.get('/usergroups', function (req, res) {
  try {
    // Get Usergroups
    const params = {
      TableName: USERGROUPS_TABLE,
    };

    dynamoDb.scan(params, (error, result) => {
        if (error) {
          res.status(400).json({ error: 'Could not get usergroups' });
        }
        if (result) {
            res.json(result.Items);
        } else {
          res.status(404).json({ error: "Usergroups not found" });
        }
    });
  } catch (error) {
    res.status(500).json({ error: String(error) });
  }      
});


// List a eesource
app.get('/usergroup/:id', function (req, res) {
  try {

    // Get Usergroup
    var id = req.param('id');

    console.log('id is: ' + id);

    const params = {
      TableName: USERGROUPS_TABLE,
      Key: {
        id: id 
      }
//      KeyConditionExpression: "id = :a",
    };

    console.log('search...');
    dynamoDb.get(params, (error, result) => {
        if (error) {
          res.status(400).json({ error: 'Could not get usergroups' });
        }
        if (result) {
          console.log('result found');
          res.json(result);
        } else {
          res.status(404).json({ error: "Usergroups not found" });
        }
    });
  } catch (error) {
    res.status(500).json({ error: String(error) });
  }      
});

// Save Usergroup
app.put('/usergroup', function (req, res) {
  try {  
    let { id, title, ownerid } = req.body;

    var newUsergroup = false;

    var currentDateTime = new Date().toString();
    var params;

    if (id == "") {
      newUsergroup = true;
      id = uuidv1();
    }

    console.log('newUsergroup is: ' + newUsergroup);
    console.log('id is: ' + id);
    console.log('ownerid is: ' + ownerid);    
    console.log('currentDateTime is: ' + currentDateTime);
    console.log('title: ' + title);

    if (typeof id !== 'string') {
      res.status(400).json({ error: 'Id must have a value.' });
    }
    if (typeof title !== 'string') {
      res.status(400).json({ error: 'Title must have a value.' });
    }
    if (typeof ownerid !== 'string') {
      res.status(400).json({ error: 'OwnerId must have a value.' });
    }


    if (newUsergroup) {
      // create in db
      params = {
        TableName: USERGROUPS_TABLE,
        Item: {
          id: id,
          ownerid: ownerid,
          createddate: currentDateTime, 
          updateddate: currentDateTime,           
          title: title, 
        }
      }             
      dynamoDb.put(params, (error) => {
        if (error) {
          res.status(error.statusCode).json({ error: error});
        } else {
          res.json({ id, title });
        }
      });        
    } else {
      // update in db    
      params = {
        TableName: USERGROUPS_TABLE,
        Key:{
            "id": id
        },
        UpdateExpression: "set title = :title, updateddate = :updateddate",
        ExpressionAttributeValues:{
            ":title": title,
            ":updateddate": currentDateTime
        },
        ReturnValues:"UPDATED_NEW"
      };

      dynamoDb.update(params, (error) => {
        if (error) {
          res.status(error.statusCode).json({ error: error});
        } else {
          res.json({ id, title });
        }
      });        
        
    }


  } catch (error) {
    res.status(500).json({ error: String(error) });
  } 
});    

// Delete Usergroup
app.delete('/usergroup', function (req, res) {

  try {  
    let { id, title } = req.body;  

    console.log('id is: ' + id);
    console.log('title: ' + title);    

    const params = {
      TableName: USERGROUPS_TABLE,
      Key: {
        id: id 
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