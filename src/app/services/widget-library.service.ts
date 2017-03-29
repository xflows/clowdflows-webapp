import {Injectable} from '@angular/core';
import {ClowdFlowsDataService} from "./clowdflows-data.service";
import {Category} from "../models/category";
import {specialCategoryName, specialWidgetNames} from "./special-widgets";
import {AbstractWidget} from "../models/abstract-widget";


@Injectable()
export class WidgetLibraryService {

    // A mapping between abstract input ids and abstract output ids
    public widgetTree: Category[];

    constructor(public clowdflowsDataService: ClowdFlowsDataService) {
        this.init();
    }

    init() {
        this.clowdflowsDataService.getWidgetLibrary()
            .then(data => {
                let library = this.parseWidgetLibrary(data);
                library = this.addSpecialWidgets(library);
                this.widgetTree = library;
            });
    }

    private parseWidgetLibrary(data:Category[]):Category[] {
        let widgetTree:Category[] = [];
        for (let cat of <Category[]> data) {
            widgetTree.push(new Category(cat.name, cat.user, cat.order, cat.children, cat.widgets));
        }
        return widgetTree;
    }

    private addSpecialWidgets(library:Category[]):Category[] {
        let specialWidgets:AbstractWidget[] = [];
        specialWidgets.push(<AbstractWidget> {
            name: specialWidgetNames.subprocessWidget,
            static_image: "/public/images/gears.png",
            special: true,
            hidden: false
        });
        specialWidgets.push(<AbstractWidget> {
            name: specialWidgetNames.inputWidget,
            static_image: "/public/images/forward-arrow.png",
            special: true,
            hidden: false
        });
        specialWidgets.push(<AbstractWidget> {
            name: specialWidgetNames.outputWidget,
            static_image: "/public/images/forward-arrow.png",
            special: true,
            hidden: false
        });
        specialWidgets.push(<AbstractWidget> {
            name: specialWidgetNames.forLoopWidgets,
            static_image: "/public/images/loop.png",
            special: true,
            hidden: false
        });
        specialWidgets.push(<AbstractWidget> {
            name: specialWidgetNames.xValidationWidgets,
            static_image: "/public/images/loop.png",
            special: true,
            hidden: false
        });
        let subprocessCategory = new Category(
            specialCategoryName,
            null,
            library[library.length - 1].order + 1,
            [],
            specialWidgets
        );
        subprocessCategory.collapsed = false;
        library.push(subprocessCategory);
        return library;
    }

    public reload() {
        this.init();
    }
}
