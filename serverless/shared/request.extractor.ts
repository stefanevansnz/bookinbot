export class RequestExtractor {

    getObject(body) {
        let object = JSON.parse(body);
        return object;
    }

    getUserName(authorizer) {
        console.log('in getUserName');
        let username = null;
        if (authorizer.claims != null) {
            //console.log('authorizer.claims is ' + JSON.stringify(authorizer.claims));
            username = authorizer.claims.sub;
        }        
        return username;
    }

}