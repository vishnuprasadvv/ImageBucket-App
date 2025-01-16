export class Image {
    constructor(
        public title: string,
        public url : string,
        public order: number,
        public userId: string,
        public _id?: string, 
    ){}
}