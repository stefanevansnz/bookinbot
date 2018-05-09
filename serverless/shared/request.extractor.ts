export class RequestExtractor {

    getObject(body) {
        let object = JSON.parse(body);
        return object;
    }

    getUserName(authorizer) {
        console.log('in getUserName');
        let username = null;
        if (authorizer.claims != null) {
            username = authorizer.claims.username;
        }        
        return username;
    }

}