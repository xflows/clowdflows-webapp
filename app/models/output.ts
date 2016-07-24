export class Output {
    constructor(
        public url:string,
        public deserialized_value:any,
        public name:string,
        public short_name:string,
        public description:string,
        public variable:string,
        public order:number,
        public inner_output:string,
        public outer_output:string
    ) {

    }

    get x():number {
        return 96;
    }

    get y():number {
        return (this.order - 1)*(10+16) + 10
    }
}