#cfn-create-or-update --region ap-southeast-2 --template-body file://route53.yaml --stack-name bookinbot-route53


# change DNS Name Servers to point to route 53 hosted zone
cfn-create-or-update --region ap-southeast-2 --template-body file://cloudfront.yaml --stack-name bookinbot-cloudfront --parameters ParameterKey=DomainName,ParameterValue=bookinbot.com ParameterKey=AcmCertificateArn,ParameterValue=arn:aws:acm:us-east-1:436941252749:certificate/8dbce871-fa81-482a-8d20-f3694e469597