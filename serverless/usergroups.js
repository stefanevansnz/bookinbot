// index.js

const serverless = require('serverless-http');
const bodyParser = require('body-parser');
const express = require('express')
const AWS = require('aws-sdk');
const uuidv1 = require('uuid/v1');
const app = express()

const USERGROUPS_TABLE = process.env.USERGROUPS_TABLE;
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
userPoolId = 'ap-southeast-2_WJTRV1aco';

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


// List users in a user group
app.get('/usergroup/:id', function (req, res) {
  try {

    // Get Usergroup
    var id = req.param('id');

    console.log('id is: ' + id);    

    client.listUsersInGroup({ 
      GroupName: id, 
      UserPoolId: userPoolId
    }, function(err, data) {
      if (!err) {
        console.log('successful' + JSON.stringify(data));

        let searchUsers = data.Users;
        var users = [];       
        // loop through data, tidy up and return
        for (let userIndex = 0; userIndex < searchUsers.length; userIndex++) {
          let id = searchUsers[userIndex].Username;
          let status = searchUsers[userIndex].UserStatus;
          var userAttributes = searchUsers[userIndex].Attributes;

          var email = '';
          var firstname = '';
          var lastname = '';
          for (let attrIndex = 0; attrIndex < userAttributes.length; attrIndex++) {      
            if(userAttributes[attrIndex].Name == 'email' ) {
              //console.log('Email ' + userAttributes[attrIndex].Value); 
              email = userAttributes[attrIndex].Value;             
            }             
            if(userAttributes[attrIndex].Name == 'given_name' ) {
              //console.log('First Name ' + userAttributes[attrIndex].Value);              
              firstname = userAttributes[attrIndex].Value;
            }           
            if(userAttributes[attrIndex].Name == 'family_name' ) {
              //console.log('Last Name ' + userAttributes[attrIndex].Value);              
              lastname = userAttributes[attrIndex].Value;
            } 
          }
          let user = {
            id: id,
            email: email,
            firstname: firstname,
            lastname: lastname,
            status: status
          }
          users.push(user);
        }

        res.json(users);
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

// Save User in Usergroup
app.put('/usergroup/:id', function (req, res) {
  try {  

    var self = this;

    // Get Usergroup
    var usergroupid = req.param('id');
    let { id, email } = req.body;
    let userid = id;

    console.log('userid is: ' + userid);
    console.log('email is: ' + email);
    console.log('usergroupid is: ' + usergroupid);

    if (typeof usergroupid !== 'string') {
      res.status(400).json({ error: 'usergroupid must have a value.' });
    }
    if (typeof email !== 'string') {
      res.status(400).json({ error: 'email must have a value.' });
    }


    var saveUserInGroup = function (userid, email, usergroupid) {
      console.log('email in function is ' + email);
      // create group first if required
      client.createGroup({ 
        GroupName: usergroupid, 
        UserPoolId: userPoolId
        }, function(err, data) {
          if (!err) {
            console.log('createGroup successful' + JSON.stringify(data));
          } else {
            console.log('createGroup error was ' + err.error);
          }
          // then create user
          createUser(userid, email);
      });
      
    }

    var createUser = function (userid, email) {
      if (userid == null) {
        // add user to group if not found.
        console.log('AdminCreateUser for ' + email);
        var userAttributes = {
          'email': email 
        }
        client.adminCreateUser({ 
          //DesiredDeliveryMediums: ['EMAIL'], 
          //UserAttributes: userAttributes, 
          Username: email,
          UserPoolId: userPoolId
        }, function(err, data) {
          if (!err) {
            console.log('adminCreateUser successful' + JSON.stringify(data)); 
            // set new user id
            userid = data.User.Username; 
            console.log('user id returned is ' + userid);   
          } else {
            //res.status(err.statusCode).json({ error: String(err) });
            console.log('adminCreateUser error was ' + err.error);
          }
          // add user to group once done.
          addUserToGroup(userid);
        });            
      } else {
        // no need to create user and just add to group
        addUserToGroup(userid);
      }
    
    }

    var addUserToGroup = function(userid) {
      // add user to group
      client.adminAddUserToGroup({ 
        Username: userid, 
        GroupName: usergroupid, 
        UserPoolId: userPoolId
        }, function(err, data) {
        if (!err) {
          console.log('adminAddUserToGroup successful' + JSON.stringify(data)); 
          res.json(data);         
        } else {
          console.log('adminAddUserToGroup err.statusCode:' + err.statusCode + ', err:' + err);
          res.status(err.statusCode).json({ error: String(err) });
        }
      });
    }

    // create group and add user
    saveUserInGroup(userid, email, usergroupid);


  } catch (error) {
    res.status(500).json({ error: String(error) });
  } 
});



// Delete Usergroup
app.delete('/usergroup/:id', function (req, res) {
  try {
    // Get Usergroup
    var usergroupid = req.param('id');
    let { id, email } = req.body;
    let userid = id;

    console.log('userid is: ' + userid);
    console.log('usergroupid is: ' + usergroupid);    

    if (typeof usergroupid !== 'string') {
      res.status(400).json({ error: 'usergroupid must have a value.' });
    }
    if (typeof userid !== 'string') {
      res.status(400).json({ error: 'userid must have a value.' });
    }

    // add user to group
    client.adminRemoveUserFromGroup({ Username: userid, GroupName: usergroupid, UserPoolId: 'ap-southeast-2_WJTRV1aco'}, function(err, data) {
      if (!err) {
        console.log('adminAddUserToGroup successful' + JSON.stringify(data)); 
        res.json(data);         
      } else {
        res.status(err.statusCode).json({ error: String(err) });
      }
    });

  } catch (error) {
    res.status(500).json({ error: String(error) });
  }     
  
});

module.exports.handler = serverless(app);