# BookInBot

## Tasks
https://trello.com/b/LpDMQOWF/bookusin

## UX (edit with pop ups - mobile friendly)
Users and Groups - Cognito
bookinbot/admin - add users for my group

bookinbot - one Bookable e.g. Sydney Apartment
bookinbot/bookables - many bookables
bookinbot/bookables/#id - calendar of bookings

bookinbot/bookables/#id/booking/new

## DataStructures

User
    - id (UUID)
    - email
    - password
    - firstname
    - lastname

Resource
    - id (UUID)
    - ownerid
    - title e.g. Sydney Apartment

    - description (optional)
    - photo(s) (optional)

Booking
    - id (UUID)
    - userid (UUID)
    - starttime
    - endtime

## Sync code

aws s3api create-bucket --bucket bookinbotcode --region ap-southeast-2 --create-bucket-configuration LocationConstraint=ap-southeast-2

aws s3 sync . s3://bookinbotcode/ --exclude 'node_modules/*' --exclude 'serverless/node_modules/*' 

## Set up and test a local serverless backend API:

1) Install and set up Serverless framework with database (required once)
npm install -g serverless
npm install --save serverless-dynamodb-local
#npm install --save amazon-cognito-identity-js
npm install --save serverless-finch
npm install serverless-domain-manager --save-dev
npm install --save moment
npm install --save uuid
npm install npm

sls dynamodb install

2) Run locally (open a new prompt)
cd serverless
#sls dynamodb start --migrate
sls offline start

3) Test backend locally
curl -H "Content-Type: application/json" -X POST http://localhost:3000/resource -d '{"id": "1", "title": "Sydney Apartment"}'

curl -H "Content-Type: application/json" -X GET http://localhost:3000/resources

4) Clean and Deploy
serverless remove
sls create_domain
serverless deploy --verbose

## Set up and test a local angular front end

1) Install and set up Angular project (required once)
npm install -g @angular/cli
npm install

2) Run locally (open a new prompt)
ng serve

3) Test frontend locally
curl -H "Content-Type: application/json" -X GET http://localhost:4200

4) Build and deploy for production
ng build --prod --aot
serverless client deploy --stage prod

## Serverless References

** the following commands can be used to set up an inital project
mkdir serverless && cd serverless
npm init -f
npm install --save express serverless-http
npm install --save-dev serverless-offline
npm install --save-dev serverless-dynamodb-local

https://serverless.com/framework/docs/providers/aws/guide/quick-start/
https://serverless.com/blog/serverless-express-rest-api/

## Installing Bootstrap
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


## Angular References

https://angular.io/guide/quickstart
** the following commands can be used to set up an inital project
ng new bookinbot


## Others References:


Auth and Cognito:
https://github.com/aws/aws-amplify/tree/master/packages/amazon-cognito-identity-js
https://www.uplift.agency/blog/posts/2016/03/clearcare-dynamodb

https://github.com/fernando-mc/serverless-finch

http://jasonwatmore.com/post/2016/12/01/angular-2-communicating-between-components-with-observable-subject

https://stackoverflow.com/questions/34671715/angular2-http-get-map-subscribe-and-observable-pattern-basic-understan

https://www.linkedin.com/pulse/20140806003615-11158662-sample-list-of-50-real-names-useful-for-mockups/

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).

ng e2e
https://coryrylan.com/blog/introduction-to-e2e-testing-with-the-angular-cli-and-protractor
