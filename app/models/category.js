"use strict";
var Category = (function () {
    function Category(name, user, order, children, widgets) {
        this.name = name;
        this.user = user;
        this.order = order;
        this.widgets = widgets;
        this.collapsed = true; // Hide the categories children
        this.hidden = false; // Hide the category itself
        this.children = [];
        for (var _i = 0, children_1 = children; _i < children_1.length; _i++) {
            var child = children_1[_i];
            var cat = new Category(child.name, child.user, child.order, child.children, child.widgets);
            this.children.push(cat);
        }
    }
    Category.prototype.toggleCollapsed = function () {
        this.collapsed = !this.collapsed;
    };
    return Category;
}());
exports.Category = Category;
//# sourceMappingURL=category.js.map