import {AbstractWidget} from "./abstract-widget";
import {User} from "./user";
export class Category {

    children:Category[];
    collapsed:boolean = true;  // Hide the categories children
    hidden:boolean = false;    // Hide the category itself

    constructor(
        public name:string,
        public user:User,
        public order:number,
        children:Category[],
        public widgets:AbstractWidget[]
    ) {
        this.children = [];
        for (let child of children) {
            let cat = new Category(child.name, child.user, child.order, child.children, child.widgets);
            this.children.push(cat);
        }
    }

    toggleCollapsed() {
        this.collapsed = !this.collapsed;
    }
}