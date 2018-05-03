class Resources {

    constructor(db) {
      this.db = db;
    }  

    getResources(responseFunction, callback, ownerid) {
        return this.db.getFromTable("ownerid", ownerid, responseFunction, callback);
    }

    putResource(responseFunction, callback, resource ) {
        return this.db.putInTable(responseFunction, callback, resource);        
    }
}

module.exports = Resources;