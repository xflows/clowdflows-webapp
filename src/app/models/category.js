"use strict";
var Category = (function () {
    function Category(name, user, order, children, widgets) {
        this.name = name;
        this.user = user;
        this.order = order;
        this.children = children;
        this.widgets = widgets;
        this.collapsed = true; // Hide the categories children
        this.hidden = false; // Hide the category itself
    }
    return Category;
}());
exports.Category = Category;
//# sourceMappingURL=category.js.map