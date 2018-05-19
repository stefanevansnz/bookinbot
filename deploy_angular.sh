export DOMAINNAME=bookinbot.com

ng build --prod --aot
cd serverless
serverless client deploy --stage prod
cd ..
# http://bookinbot.com-dist.s3-website-ap-southeast-2.amazonaws.com/signup/new