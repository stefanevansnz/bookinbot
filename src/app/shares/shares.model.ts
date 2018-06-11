export class Share {
    constructor(
        public id: string,
        public ownerid: string,
        public userid: string, 
        public email: string,           
        public status: string
    ) { }
}