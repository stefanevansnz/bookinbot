class Resources {

    constructor(db) {
      this.db = db;
    }  

    getResources(ownerid, responseFunction, callback) {
        return this.db.getFromTable("id", ownerid, responseFunction, callback);
    }

    putResource(resource, responseFunction, callback) {
        return this.db.putInTable(resource, responseFunction, callback);        
    }
}

module.exports = Resources;