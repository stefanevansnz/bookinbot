// index.js

const serverless = require('serverless-http');
const bodyParser = require('body-parser');
const express = require('express')
const AWS = require('aws-sdk');
const uuidv1 = require('uuid/v1');
const app = express()

const USERS_TABLE = process.env.USERS_TABLE;
const IS_OFFLINE = process.env.IS_OFFLINE;
const AWS_ACCESS_KEY = process.env.AWS_ACCESS_KEY;
const AWS_SECRET_KEY = process.env.AWS_SECRET_KEY;

let dynamoDb;
let client;

if (IS_OFFLINE === 'true') {
  dynamoDb = new AWS.DynamoDB.DocumentClient({
    region: 'localhost',
    endpoint: 'http://localhost:8000'
  })
  console.log(dynamoDb);
} else {
  dynamoDb = new AWS.DynamoDB.DocumentClient();
};

AWS.config.update({accessKeyId: AWS_ACCESS_KEY, secretAccessKey: AWS_SECRET_KEY});
var CognitoIdentityServiceProvider = AWS.CognitoIdentityServiceProvider;
client = new CognitoIdentityServiceProvider({ apiVersion: '2016-04-19', region: 'ap-southeast-2' });


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

// List All Users
app.get('/users', function (req, res) {
  try {

    // Get Usergroup
    var email = req.param('email');
    console.log('email is: ' + email);  

    // Get Users
    client.listUsers({ Filter: 'email = "' + email + '"', UserPoolId: 'ap-southeast-2_WJTRV1aco'}, function(err, data) {
      if (!err) {
        console.log('successful' + JSON.stringify(data));
        res.json(data.Users);
      } else {
        // error finding group
        console.log('error' + JSON.stringify(err));
        res.status(err.statusCode).json({ error: String(err) });
      }
    });


  } catch (error) {
    res.status(500).json({ error: String(error) });
  }      
});


// List a user
app.get('/user/:id', function (req, res) {
  try {

    // Get User
    var id = req.param('id');

    console.log('list a user id is: ' + id);
    var items;
    // get username for each result
    //var items = items.concat(result.Items);

 
    console.log('search for user name: ' + item.userid );

    client.adminGetUser({ Username: item.userid, UserPoolId: 'ap-southeast-2_WJTRV1aco'}, function(err, data) {
      if (!err) {
        //console.log('successful' + JSON.stringify(data));
        var userAttributes = data.UserAttributes;

        for (let i = 0; i < userAttributes.length; i++) {      
          //console.log('attribute ' +  userAttributes[i].Name + ' has value ' +  userAttributes[i].Value);
          if(userAttributes[i].Name == 'family_name' ) {
            familyName = userAttributes[i].Value;
          } 
          if(userAttributes[i].Name == 'given_name' ) {
            givenName = userAttributes[i].Value;
          }           
        }
        var userName = givenName + ' ' + familyName;

        console.log('username is ' + userName);
        newItem.username = userName;
      }
    });
    console.log('send new items');    

    const params = {
      TableName: USERS_TABLE,
      Key: {
        id: id 
      }
//      KeyConditionExpression: "id = :a",
    };

    console.log('search...');
    dynamoDb.get(params, (error, result) => {
        if (error) {
          res.status(400).json({ error: 'Could not get users' });
        }
        if (result) {
          console.log('result found user firstname is ' + result.Item.firstname);
          res.json(result);
        } else {
          res.status(404).json({ error: "Users not found" });
        }
    });
  } catch (error) {
    res.status(500).json({ error: String(error) });
  }      
});

// Save User
app.put('/user', function (req, res) {
  try {  
    let { id, email, firstname, lastname } = req.body;

    var newUser = true;
    // always new check if the user exists

    var currentDateTime = new Date().toString();
    var params;


    console.log('newUser is: ' + newUser);
    console.log('id is: ' + id);
    console.log('currentDateTime is: ' + currentDateTime);

    if (typeof id !== 'string') {
      res.status(400).json({ error: 'Id must have a value.' });
    }
    if (typeof email !== 'string') {
      res.status(400).json({ error: 'email must have a value.' });
    }
    if (typeof firstname !== 'string') {
      res.status(400).json({ error: 'Firstname must have a value.' });
    }
    if (typeof lastname !== 'string') {
      res.status(400).json({ error: 'Lastname must have a value.' });
    }


    if (newUser) {
      // create in db
      params = {
        TableName: USERS_TABLE,
        Item: {
          id: id,
          email: email,
          firstname: firstname,
          lastname: lastname,                    
          createddate: currentDateTime, 
          updateddate: currentDateTime
        }
      }             
      dynamoDb.put(params, (error) => {
        if (error) {
          res.status(error.statusCode).json({ error: error});
        } else {
          res.json({ id, email, firstname, lastname });
        }
      });        
    } else {
      // update in db    
      params = {
        TableName: USERS_TABLE,
        Key:{
            "id": id
        },
        UpdateExpression: "set email = :email, updateddate = :updateddate",
        ExpressionAttributeValues:{
            ":email": email,
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

// Delete User
app.delete('/user', function (req, res) {

  try {  
    let { id, title } = req.body;  

    console.log('id is: ' + id);
    console.log('title: ' + title);    

    const params = {
      TableName: USERS_TABLE,
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