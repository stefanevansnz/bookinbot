export class Booking {
    constructor(
        public id: string,
        public ownerid: string,
        public resourceid: string,        
        public start: string,
        public end: string    
    ) { }
}