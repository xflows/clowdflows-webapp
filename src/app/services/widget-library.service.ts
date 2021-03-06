import {Injectable} from '@angular/core';
import {ClowdFlowsDataService} from "./clowdflows-data.service";
import {Category} from "../models/category";
import {specialCategoryName, specialWidgetNames} from "./special-widgets";
import {AbstractWidget} from "../models/abstract-widget";


@Injectable()
export class WidgetLibraryService {

    // A mapping between abstract input ids and abstract output ids
    public widgetTree: Category[];
    public loading: boolean = true;

    constructor(public clowdflowsDataService: ClowdFlowsDataService) {
        this.init();
    }

    init() {
        this.loading = true;
        this.clowdflowsDataService.getWidgetLibrary()
            .then(data => {
              if (data) {
                let library = this.parseWidgetLibrary(data);
                library = this.addSpecialWidgets(library);
                this.widgetTree = library;
                this.loading = false;
              }
            });
    }

    private parseWidgetLibrary(data:Category[]):Category[] {
        let widgetTree:Category[] = [];
        for (let index in data) {
            let cat = data[index]
            widgetTree.push(new Category(cat.name, cat.user, cat.order, cat.children, cat.widgets));
        }
        return widgetTree;
    }

    private addSpecialWidgets(library:Category[]):Category[] {
        let specialWidgets:AbstractWidget[] = [];
        let cfpackage = 'special';
        specialWidgets.push(<AbstractWidget> {
            name: specialWidgetNames.subprocessWidget,
            static_image: "/public/images/gears.png",
            cfpackage: cfpackage,
            description: 'Encapsulate a workflow inside a widget',
            special: true,
            hidden: false
        });
        specialWidgets.push(<AbstractWidget> {
            name: specialWidgetNames.inputWidget,
            static_image: "/public/images/forward-arrow.png",
            cfpackage: cfpackage,
            description: 'Add an input to a subprocess',
            special: true,
            hidden: false
        });
        specialWidgets.push(<AbstractWidget> {
            name: specialWidgetNames.outputWidget,
            static_image: "/public/images/forward-arrow.png",
            cfpackage: cfpackage,
            description: 'Add an output to a subprocess',
            special: true,
            hidden: false
        });
        specialWidgets.push(<AbstractWidget> {
            name: specialWidgetNames.forLoopWidgets,
            static_image: "/public/images/loop.png",
            cfpackage: cfpackage,
            description: 'Add this into a subprocess to create a for loop',
            special: true,
            hidden: false
        });
        specialWidgets.push(<AbstractWidget> {
            name: specialWidgetNames.xValidationWidgets,
            static_image: "/public/images/loop.png",
            cfpackage: cfpackage,
            description: 'Add this into a subprocess to create a for cross-validation',
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
