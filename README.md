## BookInBot - an angular and serverless application

## Set up and test a local serverless backend API:

1) Install and set up Serverless framework with database (required once)
npm install -g serverless
npm install serverless-offline --save-dev
npm install --save serverless-dynamodb-local
npm install --save amazon-cognito-identity-js
npm install --save serverless-finch
npm install serverless-domain-manager --save-dev
npm install --save moment
npm install --save uuid
npm install npm

sls dynamodb install

2) Run locally
./run_serverless.sh

## Set up and test a local angular front end

1) Install and set up Angular project (required once)
npm install -g @angular/cli
npm install

2) Run locally
./run_angular.sh

## Other References

** the following commands can be used to set up an inital project
mkdir serverless && cd serverless
npm init -f
npm install --save express serverless-http
npm install --save-dev serverless-offline
npm install --save-dev serverless-dynamodb-local

https://serverless.com/framework/docs/providers/aws/guide/quick-start/
https://serverless.com/blog/serverless-express-rest-api/

** Installing Bootstrap
npm install --save bootstrap

Add        
      "styles": [
        "../node_modules/bootstrap/dist/css/bootstrap.min.css",        
        "styles.css"
      ],
to
.angular-cli.json

Add
        "../node_modules/bootstrap/dist/js/bootstrap.min.js",


Date Pickers
https://wireddots.com/products/datetimepicker
http://www.daterangepicker.com
https://ng-bootstrap.github.io/#/components/timepicker/examples

Auth and Cognito:
https://github.com/aws/aws-amplify/tree/master/packages/amazon-cognito-identity-js
https://www.uplift.agency/blog/posts/2016/03/clearcare-dynamodb


## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

./test_serverless.sh

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).

./test_e2e.sh
