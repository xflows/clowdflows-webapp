import {ComponentFixture, TestBed, async} from '@angular/core/testing';
import {testWorkflows} from "../../../testing/data/workflows.testdata";
import {WidgetCanvasComponent} from "./widget-canvas.component";
import {WidgetDialogStub} from "../../../testing/stubs/widget-dialog.component.stub";
import {ContextMenuService, ContextMenuComponent} from "ngx-contextmenu/ngx-contextmenu";
import {Widget} from "../../../models/widget";

describe('WidgetCanvasComponent', () => {

    let comp:WidgetCanvasComponent;
    let fixture:ComponentFixture<WidgetCanvasComponent>;
    let testWidget:Widget;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [],
            declarations: [WidgetDialogStub, ContextMenuComponent, WidgetCanvasComponent],
            providers: [ContextMenuService]
        })
            .compileComponents();
    }));
    beforeEach(() => {
        fixture = TestBed.createComponent(WidgetCanvasComponent);
        comp = fixture.componentInstance;
        comp.workflow = testWorkflows[2];
        testWidget = comp.workflow.widgets[0];
        fixture.detectChanges(); // trigger initial data binding
    });

    it('it should render the correct number of widgets', () => {
        let widgetBoxes = fixture.nativeElement.querySelectorAll(`.widget-box`);
        expect(widgetBoxes.length).toBe(comp.workflow.widgets.length);
    });

    it('it should render the correct number of connections', () => {
        let connections = fixture.nativeElement.querySelectorAll(`.connection`);
        expect(connections.length).toBe(comp.workflow.connections.length);
    });

    it('each widget should have the correct number of inputs and outpus rendered', () => {
        for (let widget of comp.workflow.widgets) {
            let widgetInputs = fixture.nativeElement.querySelectorAll(`#widget-${widget.id} .input`);
            let widgetOutputs = fixture.nativeElement.querySelectorAll(`#widget-${widget.id} .output`);
            expect(widgetInputs.length).toBe(widget.inputs.length);
            expect(widgetOutputs.length).toBe(widget.outputs.length);
        }
    });

    // Note: for some reason angular's DebugElement doesn't support SVG tags, so we can't
    //       trigger user events like clicking, dragging etc, for testing.
});
