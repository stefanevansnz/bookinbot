export class Share {
    constructor(
        public id: string,
        public ownerid: string,
        public ownername: string,  
        public resourceid: string,
        public resourcetitle: string,        
        public userid: string, 
        public username: string,         
        public email: string
    ) { }
}