export class Booking {
    constructor(
        public id: string,
        public userid: string,
        public username: string,        
        public resourceid: string,        
        public start: string,
        public end: string    
    ) { }
}