export class Otp {
    constructor(
        public email: string,
        public otp : string,
        public expiresAt: Date,
        public _id ?: string
    ){}
}