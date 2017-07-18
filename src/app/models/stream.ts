
export class Stream {
    constructor(public id:number,
                public url:string,
                public last_executed:string,
                public period:number,
                public active:boolean) {}
}