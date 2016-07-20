import {AbstractWidget} from "./abstract-widget";
import {User} from "./user";
export class Category {
    name:String;
    user:User;
    order:Number;
    children:Category[];
    widgets:AbstractWidget[];
}