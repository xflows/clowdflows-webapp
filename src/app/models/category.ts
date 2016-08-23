import {AbstractWidget} from "./abstract-widget";
import {User} from "./user";
export class Category {

    collapsed:boolean = true;  // Hide the categories children
    hidden:boolean = false;    // Hide the category itself

    constructor(
        public name:string,
        public user:User,
        public order:number,
        public children:Category[],
        public widgets:AbstractWidget[]
    ) { }
}