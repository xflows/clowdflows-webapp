import {ComponentFixture, TestBed, async} from '@angular/core/testing';
import {testWorkflows} from "../../../testing/data/workflows.testdata";
import {Widget} from "../../../models/widget";
import {WidgetDialogComponent} from "./widget-dialog.component";
import {By} from "@angular/platform-browser";
import {FormsModule} from "@angular/forms";
import {DndModule} from "ng2-dnd";
import {ClowdFlowsDataService} from "../../../services/clowdflows-data.service";
import {LoggerService} from "../../../services/logger.service";
import {Ng2UploaderModule} from "ng2-uploader/ng2-uploader";
import {SanitizeModule} from "../../../pipes/sanitize.module";
import {CutPipe} from "../../../pipes/cut.pipe";

let clowdFlowsDataServiceStub = {
};
let loggerServiceStub = {
};

describe('WidgetDialogComponent', () => {

    let comp:WidgetDialogComponent;
    let fixture:ComponentFixture<WidgetDialogComponent>;
    let testWidget:Widget = testWorkflows[2].widgets[0];

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [FormsModule, Ng2UploaderModule, DndModule.forRoot(), SanitizeModule],
            declarations: [WidgetDialogComponent, CutPipe],
            providers: [
                {provide: ClowdFlowsDataService, useValue: clowdFlowsDataServiceStub},
                {provide: LoggerService, useValue: loggerServiceStub}]
        })
            .compileComponents();
    }));
    beforeEach(() => {
        fixture = TestBed.createComponent(WidgetDialogComponent);
        comp = fixture.componentInstance;
        comp.widget = testWidget;
        fixture.detectChanges(); // trigger initial data binding
    });

    it('toggling showDialog should display the widget parameters dialog', () => {
        let dialogs = fixture.debugElement.queryAll(By.css('.widget-dialog'));
        expect(dialogs.length).toBe(0);
        testWidget.showDialog = true;
        fixture.detectChanges();
        dialogs = fixture.debugElement.queryAll(By.css('.widget-dialog'));
        expect(dialogs.length).toBe(1);
    });
});
