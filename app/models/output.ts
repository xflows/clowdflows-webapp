import {Widget} from "./widget";
export class Output {

    public value:any = null;
    public selected:boolean = false;

    constructor(
        public url:string,
        // public deserialized_value:any,
        public name:string,
        public short_name:string,
        public description:string,
        public variable:string,
        public order:number,
        public inner_output:string,
        public outer_output:string,
        public widget:Widget
    ) {
    }

    get x():number {
        return 96;
    }

    get y():number {
        return (this.order - 1)*(10+16) + 10
    }

    toDict(withIds:boolean = true) {
        let serialized = {
            url: this.url,
            // deserialized_value: this.deserialized_value,
            name: this.name,
            short_name: this.short_name,
            description: this.description,
            variable: this.variable,
            order: this.order,
            widget: this.widget.url
        };
        if (withIds) {
            serialized['url'] = this.url;
        }
        return serialized;
    }
}