export class User {
    constructor(
        public id: string,
        public email: string,
        public firstname: string,
        public lastname: string,
        public status: string,
        public token: string
    ) { }
}
