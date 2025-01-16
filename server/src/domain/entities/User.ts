export class User{
    constructor(
        public _id: string,
        public email : string,
        public phone : string, 
        public password ?: string 
    ){}
}