export class Share {
    constructor(
        public id: string,
        public ownerid: string,
        public resourceid: string,
        public userid: string, 
        public email: string
    ) { }
}